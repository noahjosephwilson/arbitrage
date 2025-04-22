(() => {
  const { useState, useEffect } = React;

  function LiveBook() {
    const [market, setMarket] = useState('');
    const [option, setOption] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
      if (!loaded) return;
      const fetchBook = async () => {
        const res = await fetch(
          `/orderbook?market=${encodeURIComponent(market)}&option=${encodeURIComponent(option)}`
        );
        setOrders(await res.json());
      };
      fetchBook();
      const id = setInterval(fetchBook, 3000);
      return () => clearInterval(id);
    }, [loaded, market, option]);

    if (!loaded) {
      return React.createElement('div', null,
        React.createElement('h2', null, 'Load Live Order Book'),
        React.createElement('input', {
          placeholder: 'Market ID',
          value: market,
          onChange: e => setMarket(e.target.value)
        }),
        React.createElement('input', {
          placeholder: 'Option ID',
          value: option,
          onChange: e => setOption(e.target.value)
        }),
        React.createElement('button', {
          onClick: () => {
            if (!market || !option) return alert('Both fields required');
            setLoaded(true);
          }
        }, 'Load')
      );
    }

    return React.createElement('div', null,
      React.createElement('h2', null, `Live Order Book: ${market} / ${option}`),
      React.createElement('a', { href: '/submitorder/' }, '← Back to Submit Order'),
      React.createElement('table', null,
        React.createElement('thead', null,
          React.createElement('tr', null,
            ['OrderID','Side','OrigQty','RemQty','Type','Price','Status','OrderTs','UpdatedTs','TIF','Expiration','Cancel']
              .map(h => React.createElement('th',{key:h}, h))
          )
        ),
        React.createElement('tbody', null,
          orders.map(o =>
            React.createElement('tr',{key:o.order_id},
              React.createElement('td', null, o.order_id),
              React.createElement('td', null, o.side),
              React.createElement('td', null, o.original_quantity),
              React.createElement('td', null, o.remaining_quantity),
              React.createElement('td', null, o.order_type),
              React.createElement('td', null, o.price),
              React.createElement('td', null, o.status),
              React.createElement('td', null, new Date(o.order_timestamp).toLocaleString()),
              React.createElement('td', null, new Date(o.last_updated_timestamp).toLocaleString()),
              React.createElement('td', null, o.time_in_force),
              React.createElement('td', null, new Date(o.order_expiration).toLocaleString()),
              React.createElement('td', null,
                React.createElement('button',{
                  onClick: async () => {
                    await fetch(`/orders/${o.order_id}/cancel`, { method:'POST' });
                    setOrders(prev => prev.filter(x => x.order_id !== o.order_id));
                  }
                }, 'Cancel')
              )
            )
          )
        )
      )
    );
  }

  ReactDOM.createRoot(document.getElementById('root'))
    .render(React.createElement(LiveBook));
})();
