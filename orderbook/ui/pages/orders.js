import { useEffect, useState } from 'react'
import Head from 'next/head'

export default function Orders() {
  // 1) Make sure this starts as an array, not null
  const [orders, setOrders] = useState([])

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const res = await fetch('http://localhost:8081/orders')
        const data = await res.json()
        if (active) setOrders(data)
      } catch (e) {
        console.error(e)
      }
    }

    load()
    const iv = setInterval(load, 2000)
    return () => {
      active = false
      clearInterval(iv)
    }
  }, [])

  // 2) Guard: if, for some reason, orders isn't an array yet
  if (!Array.isArray(orders)) {
    return <main style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif' }}>
      <Head><title>Order Viewer</title></Head>
      <h1>All Orders</h1>
      <p>Loading orders…</p>
    </main>
  }

  return (
    <>
      <Head><title>Order Viewer</title></Head>
      <main className="viewer">
        <h1>All Orders</h1>
        <table>
          <thead>
            <tr>
              {[
                'OrderID','MarketID','OptionID','Side','AON',
                'Qty','RemQty','Type','Price','Status',
                'Placed','Updated','TIF','Expiration'
              ].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.OrderID}>
                <td>{o.OrderID}</td>
                <td>{o.MarketID}</td>
                <td>{o.OptionID}</td>
                <td>{o.Side}</td>
                <td>{o.All_Or_Nothing ? '✓' : ''}</td>
                <td>{o.Quantity}</td>
                <td>{o.Remaining_Quantity}</td>
                <td>{o.Order_Type}</td>
                <td>{o.Price}</td>
                <td>{o.Status}</td>
                <td>{new Date(o.Order_Timestamp).toLocaleString()}</td>
                <td>{new Date(o.Last_Updated_Timestamp).toLocaleString()}</td>
                <td>{o.Time_In_Force}</td>
                <td>{o.Order_Expiration?.replace('T',' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <style jsx>{`
        .viewer {
          max-width: 95%;
          margin: 2rem auto;
          font-family: 'Segoe UI', sans-serif;
        }
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 1rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 0.5rem;
          font-size: 0.85rem;
        }
        th {
          background: #f4f4f4;
          text-align: left;
          color: #555;
        }
        tbody tr:nth-child(even) {
          background: #fafafa;
        }
        tbody tr:hover {
          background: #f1faff;
        }
      `}</style>
    </>
  )
}
