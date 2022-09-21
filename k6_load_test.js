import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5s', target: 20 },
    { duration: '5s', target: 100 },
    { duration: '5s', target: 100 },
    { duration: '5s', target: 10 },
  ],
};

const max = 1000012;
const choice = (max) => Math.floor( Math.random() * max);
const baseURL = 'http://localhost:3000/products';

export default function() {
  //http.get('http://localhost:5000');
  http.batch([
    ['GET', `${baseURL}?page=${choice(1000)}&count=${choice(1000)}`],
    ['GET', `${baseURL}/${choice(max)}`],
    ['GET', `${baseURL}/${choice(max)}/styles`],
    ['GET', `${baseURL}/${choice(max)}/related`],
  ]);
  //sleep(1)
}
