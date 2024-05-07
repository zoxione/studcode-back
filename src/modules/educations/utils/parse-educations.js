const fs = require('fs');
const csv = require('csv');
require('dotenv').config({
  path: '.env.development',
});

const educations = [];
const file = './src/modules/educations/utils/data.csv';

fs.createReadStream(file)
  .pipe(csv.parse({ columns: true }))
  .on('data', (education) => {
    educations.push(education);
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
    for (let i = 0; i < educations.length; i++) {
      console.log(`[${i + 1}/${educations.length}] ${educations[i].name}`);
      const res = await fetch(`http://localhost:${process.env.PORT}/api/v1/educations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(educations[i]),
      });
      if (!res.ok) {
        throw new Error(`[${i + 1}/${educations.length}] ${educations[i].name} - ${res.statusText}`);
      }
    }
  });
