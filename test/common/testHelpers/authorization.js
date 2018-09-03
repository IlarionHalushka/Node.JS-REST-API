import * as Session from './session';

const APIHelpers = {
  signIn: async user => {
    const response = await api.post(routes.auth.signIn).send({
      email: user.email,
      password: user.password,
    });

    // set jwt token to current session
    user.token = response.body.token;
    Session.setCurrentUser(user);
  },
};

module.exports = APIHelpers;
