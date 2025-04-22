(() => {
  const { useState } = React;

  function SubmitOrder() {
    const [form, setForm] = useState({
      market_id:        '',
      option_id:        '',
      order_id:         '',
      side:             '',
      order_type:       '',
      quantity:         '',
      price:            '',
      all_or_nothing:   false,
      time_in_force:    'GTC',
      order_expiration: ''
    });

    const handleChange = e => {
      const { name, type, value, checked } = e.target;
      setForm(f => ({
        ...f,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    const handleSubmit = async e => {
      e.preventDefault();
      const { market_id, option_id, order_id, side } = form;
      if (!market_id || !option_id || !order_id || !side) {
        return alert('MarketID, OptionID, OrderID & Side are required');
      }
      const payload = {
        order_id,
        option_id:        form.option_id,
        side:             form.side,
        all_or_nothing:   form.all_or_nothing,
        order_type:       form.order_type,
        quantity:         Number(form.quantity),
        price:            Number(form.price),
        time_in_force:    form.time_in_force,
        order_expiration: form.order_expiration
      };

      const res = await fetch(
        `/markets/${encodeURIComponent(market_id)}/orders`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload)
        }
      );

      if (res.ok) {
        alert('Order submitted!');
        setForm(f => ({ ...f, order_id: '', quantity: '', price: '' }));
      } else {
        const text = await res.text();
        alert('Error: ' + text);
      }
    };

    return React.createElement('form', { onSubmit: handleSubmit },
      ['market_id','option_id','order_id'].map(name =>
        React.createElement('div', { key: name },
          React.createElement('label', null, name.replace(/_/g,' ').toUpperCase()),
          React.createElement('input', {
            name,
            value: form[name],
            onChange: handleChange,
            type: 'text'
          })
        )
      ),
      React.createElement('div', null,
        React.createElement('label', null, 'SIDE'),
        React.createElement('select', {
            name: 'side', value: form.side, onChange: handleChange
          },
          React.createElement('option', { value: '' }, 'Select…'),
          React.createElement('option', { value: 'buy' }, 'Buy'),
          React.createElement('option', { value: 'sell' }, 'Sell')
        )
      ),
      React.createElement('div', null,
        React.createElement('label', null, 'ORDER TYPE'),
        React.createElement('select', {
            name: 'order_type', value: form.order_type, onChange: handleChange
          },
          React.createElement('option', { value: '' }, 'Select…'),
          React.createElement('option', { value: 'limit' }, 'Limit'),
          React.createElement('option', { value: 'market' }, 'Market')
        )
      ),
      ['quantity','price'].map(name =>
        React.createElement('div', { key: name },
          React.createElement('label', null, name.toUpperCase()),
          React.createElement('input', {
            name,
            type:  'number',
            value: form[name],
            onChange: handleChange
          })
        )
      ),
      React.createElement('div', null,
        React.createElement('label', null, 'TIME IN FORCE'),
        React.createElement('select', {
            name: 'time_in_force', value: form.time_in_force, onChange: handleChange
          },
          React.createElement('option', { value: 'GTC' }, 'GTC'),
          React.createElement('option', { value: 'IOC' }, 'IOC'),
          React.createElement('option', { value: 'FOK' }, 'FOK')
        )
      ),
      React.createElement('div', null,
        React.createElement('label', null, 'ALL OR NOTHING'),
        React.createElement('input', {
          type:    'checkbox',
          name:    'all_or_nothing',
          checked: form.all_or_nothing,
          onChange: handleChange
        })
      ),
      React.createElement('div', null,
        React.createElement('label', null, 'EXPIRATION (ISO)'),
        React.createElement('input', {
          name:  'order_expiration',
          type:  'text',
          value: form.order_expiration,
          onChange: handleChange
        })
      ),
      React.createElement('button', { type: 'submit' }, 'Submit Order'),
      React.createElement('div', { style: { marginTop: '20px' } },
        React.createElement('a', { href: '/liveorderbook/' }, '→ Go to Live Order Book')
      )
    );
  }

  ReactDOM.createRoot(document.getElementById('root'))
    .render(React.createElement(SubmitOrder));
})();
