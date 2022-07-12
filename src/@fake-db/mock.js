// eslint-disable-next-line no-undef
const MockAdapter = require('axios-mock-adapter');
// eslint-disable-next-line no-undef
const axios = require('axios');

const mock = new MockAdapter(axios, { delayResponse: 0 });
export default mock;
