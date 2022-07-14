import _ from 'lodash';
import Utf8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';
import HmacSHA256 from 'crypto-js/hmac-sha256';

import mock from '../mock';

const authDB = {
  users: [
    {
      uuid: 'XgbuVEXBU5gtSKdbQRP1Zbbby1i1',
      from: 'custom-db',
      password: 'Abcd@1234',
      id: '617779cc83f43ef0f3b2',
      roleId: 'admin',
      userName: 'Admin',
      email: 'admin@gmail.com',
    },
  ],
};

mock.onPost('/api/users/login').reply(async (config) => {
  const data = JSON.parse(config.data);
  const { email, password } = data;
  const user = _.cloneDeep(authDB.users.find((_user) => _user.email === email));

  const error = [];

  if (!user) {
    error.push({
      type: 'email',
      message: 'Check your email address',
    });
  }

  if (user && user.password !== password) {
    error.push({
      type: 'password',
      message: 'Check your password',
    });
  }

  if (error.length === 0) {
    delete user.password;

    const access_token = generateJWTToken({ id: user.uuid });

    const response = {
      user,
      access_token,
    };

    return [200, response];
  }

  return [404, { error }];
});

/**
 * JWT Token Generator/Verifier Helpers
 * !! Created for Demonstration Purposes, cannot be used for PRODUCTION
 */

const jwtSecret = 'some-secret-code-goes-here';

function base64url(source) {
  // Encode in classical base64
  let encodedSource = Base64.stringify(source);

  // Remove padding equal characters
  encodedSource = encodedSource.replace(/=+$/, '');

  // Replace characters according to base64url specifications
  encodedSource = encodedSource.replace(/\+/g, '-');
  encodedSource = encodedSource.replace(/\//g, '_');

  // Return the base64 encoded string
  return encodedSource;
}

function generateJWTToken(tokenPayload) {
  // Define token header
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  // Calculate the issued at and expiration dates
  const date = new Date();
  const iat = Math.floor(date.getTime() / 1000);
  const exp = Math.floor(date.setDate(date.getDate() + 7) / 1000);

  // Define token payload
  const payload = {
    iat: iat,
    iss: 'Fuse',
    exp: exp,
    ...tokenPayload,
  };

  // Stringify and encode the header
  const stringifiedHeader = Utf8.parse(JSON.stringify(header));
  const encodedHeader = base64url(stringifiedHeader);

  // Stringify and encode the payload
  const stringifiedPayload = Utf8.parse(JSON.stringify(payload));
  const encodedPayload = base64url(stringifiedPayload);

  // Sign the encoded header and mock-api
  let signature = encodedHeader + '.' + encodedPayload;
  signature = HmacSHA256(signature, jwtSecret);
  signature = base64url(signature);

  // Build and return the token
  return encodedHeader + '.' + encodedPayload + '.' + signature;
}
