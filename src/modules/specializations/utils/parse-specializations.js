const fs = require('fs');
const csv = require('csv');
require('dotenv').config({
  path: '.env.test',
});

const specializations = [];
const file = './src/modules/specializations/utils/data.csv';

fs.createReadStream(file)
  .pipe(csv.parse({ columns: true }))
  .on('data', (specialization) => {
    specializations.push(specialization);
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
    for (let i = 0; i < specializations.length; i++) {
      console.log(`[${i + 1}/${specializations.length}] ${specializations[i].name}`);
      const res = await fetch(`http://localhost:${process.env.PORT}/api/v1/specializations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(specializations[i]),
      });
      if (!res.ok) {
        throw new Error(`[${i + 1}/${specializations.length}] ${specializations[i].name} - ${res.statusText}`);
      }
    }
  });
