// index.mjs  – Node.js 20.x, ES module
import { DynamoDBClient }             from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient,
         BatchGetCommand }            from "@aws-sdk/lib-dynamodb";

/* ────────── helpers ────────── */
const toB64 = (bin) => Buffer.from(bin).toString("base64");
const chunk = (arr, n = 100) => {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
};

/* ────────── config ────────── */
const TABLE_NAME  = "Markets";
const ZERO_BINARY = Buffer.from([0]);                   // metadata sort key
const client      = new DynamoDBClient({ region: process.env.AWS_REGION ?? "us-east-1" });
const ddb         = DynamoDBDocumentClient.from(client);

/* CORS */
const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/* ────────── handler ────────── */
export const handler = async (event) => {
  /* -- OPTIONS pre‑flight -- */
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }

  try {
    /* 1) parse input */
    const payload   = typeof event.body === "string" ? JSON.parse(event.body) : event;
    const marketIDs = payload?.body?.marketIDs;
    if (!Array.isArray(marketIDs) || !marketIDs.length) {
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: "No marketIDs provided." }) };
    }

    /* 2) get metadata rows (DATA = 0x00) */
    const metaKeys = marketIDs.map((b64) => ({
      MARKETID: Buffer.from(b64, "base64"), DATA: ZERO_BINARY,
    }));

    const metaRows = [];
    for (const slice of chunk(metaKeys)) {
      const resp = await ddb.send(new BatchGetCommand({
        RequestItems: { [TABLE_NAME]: { Keys: slice } },
      }));
      metaRows.push(...(resp.Responses?.[TABLE_NAME] ?? []));
    }

    /* 3) collect option keys */
    const optionKeys = [];
    metaRows.forEach((row) => {
      (row.Options || []).forEach((optBuf) =>
        optionKeys.push({ MARKETID: row.MARKETID, DATA: optBuf })
      );
    });

    /* 4) batch‑get option rows */
    const optionRows = [];
    for (const slice of chunk(optionKeys)) {
      const resp = await ddb.send(new BatchGetCommand({
        RequestItems: { [TABLE_NAME]: { Keys: slice } },
      }));
      optionRows.push(...(resp.Responses?.[TABLE_NAME] ?? []));
    }

    /* 5) map option rows → marketID → list */
    const optionMap = new Map();      // base64MarketID  →  [ option objects ]
    optionRows.forEach((r) => {
      const mkID = toB64(r.MARKETID);
      const opt = {
        optionID:      toB64(r.DATA),
        optionName:    r.OptionName,
        choice1:       r.Choice1,
        choice2:       r.Choice2,
        choice1Value:  r.Choice1Value,
        choice2Value:  r.Choice2Value,
      };
      if (!optionMap.has(mkID)) optionMap.set(mkID, []);
      optionMap.get(mkID).push(opt);
    });

    /* 6) shape final response */
    const markets = metaRows.map((m) => ({
      marketID:  toB64(m.MARKETID),
      name:      m.Name,
      volume:    m.Volume ?? 0,
      optionIDs: (m.Options || []).map(toB64),
      options:   optionMap.get(toB64(m.MARKETID)) ?? [],
    }));

    /* keep caller order */
    markets.sort((a, b) =>
      marketIDs.indexOf(a.marketID) - marketIDs.indexOf(b.marketID)
    );

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ markets }) };
  } catch (err) {
    console.error("Market fetch error:", err);
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: "Server error", detail: err.message }) };
  }
};
