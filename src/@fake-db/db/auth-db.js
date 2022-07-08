import _ from 'lodash';
import mock from '../mock';

const authDB = {
  users: [
    {
      uuid: 'XgbuVEXBU5gtSKdbQRP1Zbbby1i1',
      from: 'custom-db',
      password: 'Abcd@1234',
      id: '617779cc83f43ef0f3b2',
      roleId: 'admin',
      name: 'Admin',
      email: 'admin@gmail.com',
    },
  ],
};

mock.onPost('/api/users/login').reply(async (config) => {
  console.log(config);
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

    const response = {
      user,
    };

    return [200, response];
  }

  return [200, { error }];
});
