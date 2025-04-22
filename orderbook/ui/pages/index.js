import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  // initial expiration value
  const nowSlice = new Date().toISOString().slice(0,16)
  const [form, setForm] = useState({
    OrderID: '',
    MarketID: '',
    OptionID: '',
    Side: 'BUY',
    All_Or_Nothing: false,
    Quantity: 1,
    Remaining_Quantity: 1,
    Order_Type: 'LIMIT',
    Price: 0,
    Status: 'NEW',
    Time_In_Force: 'GTC',
    Order_Expiration: nowSlice,
  })
  const [resp, setResp] = useState('')

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    let val
    if (type === 'checkbox') {
      val = checked
    } else if (type === 'number') {
      // parse number inputs into actual numbers
      val = value === '' ? '' : Number(value)
    } else {
      val = value
    }
    setForm(f => ({ ...f, [name]: val }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    // build payload (all numeric fields are already numbers)
    const payload = {
      ...form,
      Order_Timestamp: new Date().toISOString(),
      Last_Updated_Timestamp: new Date().toISOString(),
    }

    try {
      const res = await fetch('http://localhost:8081/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setResp(await res.text())
    } catch (err) {
      setResp('Error: ' + err.message)
    }
  }

  return (
    <>
      <Head>
        <title>Submit Order</title>
      </Head>
      <main className="container">
        <h1>Submit Order</h1>
        <form onSubmit={handleSubmit} noValidate>
          {[
            ['OrderID','text'],
            ['MarketID','text'],
            ['OptionID','text'],
            ['Quantity','number'],
            ['Remaining_Quantity','number'],
            ['Price','number']
          ].map(([field, type]) => (
            <label key={field}>
              {field}
              <input
                type={type}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
              />
            </label>
          ))}

          <label>
            Side
            <select name="Side" value={form.Side} onChange={handleChange}>
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              name="All_Or_Nothing"
              checked={form.All_Or_Nothing}
              onChange={handleChange}
            />
            All Or Nothing
          </label>

          {['Order_Type','Status','Time_In_Force'].map(field => (
            <label key={field}>
              {field}
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
              />
            </label>
          ))}

          <label>
            Order Expiration
            <input
              type="datetime-local"
              name="Order_Expiration"
              value={form.Order_Expiration}
              onChange={handleChange}
              step="60"
              required
            />
          </label>

          <button type="submit">Send Order</button>
        </form>
        {resp && <pre className="response">{resp}</pre>}
      </main>

      <style jsx>{`
        .container {
          max-width: 500px;
          margin: 3rem auto;
          padding: 2rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          background: #fff;
          font-family: 'Segoe UI', sans-serif;
        }
        h1 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #333;
        }
        form {
          display: grid;
          gap: 1rem;
        }
        label {
          display: flex;
          flex-direction: column;
          font-size: 0.9rem;
          color: #555;
        }
        input, select {
          margin-top: 0.25rem;
          padding: 0.5rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .checkbox {
          flex-direction: row;
          align-items: center;
        }
        .checkbox input {
          margin: 0 0.5rem 0 0;
          width: auto;
        }
        button {
          margin-top: 1rem;
          padding: 0.75rem;
          font-size: 1rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background: #005ec2;
        }
        .response {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #f6f6f6;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.9rem;
        }
      `}</style>
    </>
  )
}
