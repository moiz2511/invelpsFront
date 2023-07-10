import React from 'react';

const PortfoliosTable = () => {
  return (
    <div>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th
              style={{
                fontSize: '1.2rem',
                textAlign: 'left',
                borderBottom: '1px solid yellow',
              }}
              colSpan="1"
            >
              Portfolio
            </th>
            <th
              style={{
                fontSize: '1.2rem',
                textAlign: 'center',
                borderBottom: '1px solid blue',
                color: 'blue',
              }}
              colSpan="6"
            >
              Allocation %
            </th>
            <th
              style={{
                fontSize: '1.2rem',
                textAlign: 'center',
                borderBottom: '1px solid green',
                color: 'green',
              }}
              colSpan="2"
            >
              Return
            </th>
            <th
              style={{
                fontSize: '1.2rem',
                textAlign: 'center',
                borderBottom: '1px solid red',
                color: 'red',
              }}
              colSpan="2"
            >
              Risk
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ borderBottom: '1px solid black', padding: '8px' }}>Name</td>
            <td style={{ borderBottom: '1px solid blue', padding: '8px' }}>Stocks</td>
            <td style={{ borderBottom: '1px solid blue', padding: '8px' }}>Bonds</td>
            <td style={{ borderBottom: '1px solid blue', padding: '8px' }}>T.Bills</td>
            <td style={{ borderBottom: '1px solid blue', padding: '8px' }}>Gold</td>
            <td style={{ borderBottom: '1px solid blue', padding: '8px' }}>REIT</td>
            <td style={{ borderBottom: '1px solid blue', padding: '8px' }}>Cash</td>
            <td
              style={{
                borderBottom: '1px solid green',
                padding: '8px',
                color: 'green',
              }}
            >
              Annualized return
            </td>
            <td
              style={{
                borderBottom: '1px solid green',
                padding: '8px',
                color: 'green',
              }}
            >
              Rolling return
            </td>
            <td
              style={{
                borderBottom: '1px solid red',
                padding: '8px',
                color: 'red',
              }}
            >
              Standard deviation
            </td>
            <td
              style={{
                borderBottom: '1px solid red',
                padding: '8px',
                color: 'red',
              }}
            >
              Max drawdown
            </td>
          </tr>
          <tr>
            <td style={{ borderBottom: '1px solid black', padding: '8px' }}>
              Portfolio test 1
            </td>
            <td style={{ borderBottom: '1px solid blue', padding: '8px', color: 'blue' }}>
              80
            </td>
            <td style={{ borderBottom: '1px solid blue', padding: '8px', color: 'blue' }}>
              20
            </td>
            <td style={{ borderBottom: '1px solid blue', padding: '8px' }}></td>
            <td style={{ borderBottom: '1px solid blue', padding: '8px' }}></td>
            <td style={{ borderBottom: '1px solid blue', padding: '8px' }}></td>
            <td style={{ borderBottom: '1px solid blue', padding: '8px' }}></td>
            <td style={{ borderBottom: '1px solid green', padding: '8px', color: 'green' }}>
              7.4
            </td>
            <td style={{ borderBottom: '1px solid green', padding: '8px', color: 'green' }}>
              8.7
            </td>
            <td style={{ borderBottom: '1px solid red', padding: '8px', color: 'red' }}>
              18.3
            </td>
            <td style={{ borderBottom: '1px solid red', padding: '8px', color: 'red' }}>
              -24.3
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PortfoliosTable;
