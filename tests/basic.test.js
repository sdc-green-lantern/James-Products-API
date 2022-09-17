const axios = require('axios');
axios.defaults.baseURL = 'http://localhost:3000'; 
axios.defaults.headers.post['Content-Type'] = 'application/json';

describe('/products/ endpoint', () => {
  test('it should return an array of 5 wrapped in JSON', async () => {
    const res = await axios.get('/') // once deployed, baseURL will be /products/
    //expect(res.json.length).toEqual(5);
    expect(res.data.length).toEqual(5);
  });
});
