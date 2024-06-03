// k6 run stress-testing.spec.js

import http from 'k6/http';
import { sleep } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

export const options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  stages: [
    { duration: '10s', target: 120 },
    { duration: '1m', target: 120 },
    { duration: '10s', target: 2000 },
    { duration: '3m', target: 2000 },
    { duration: '10s', target: 120 },
    { duration: '1m', target: 120 },
    { duration: '10s', target: 0 },
  ],
};

const API_URL = 'http://localhost:5050';

export default function () {
  http.batch([
    ['GET', `${API_URL}/api/v1/projects`],
    ['GET', `${API_URL}/api/v1/tags`],
    ['GET', `${API_URL}/api/v1/users`],
  ]);
  sleep(1);
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    'stress-testing.json': JSON.stringify(data['metrics'], null, 2),
  };
}
