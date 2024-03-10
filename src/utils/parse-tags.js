const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config({
  path: '.env.test',
});

const rows = [];

fs.createReadStream('./src/utils/data.csv')
  .pipe(csv())
  .on('data', (row) => {
    rows.push(row);
  })
  .on('end', async () => {
    const res = await fetch(`http://localhost:${process.env.PORT}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      }),
    });
    const { access_token } = await res.json();
    console.log('access_token: ', access_token);
    if (!access_token) {
      throw new Error('No access token');
    }
    for (let i = 0; i < rows.length; i++) {
      console.log(`[${i + 1}/${rows.length}] ${rows[i].name}`);
      const res = await fetch(`http://localhost:${process.env.PORT}/api/v1/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(rows[i]),
      });
      if (!res.ok) {
        throw new Error(`[${i + 1}/${rows.length}] ${rows[i].name} - ${res.statusText}`);
      }
    }
  });
