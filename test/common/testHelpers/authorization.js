import User from '../../../models/User';

const APIHelpers = {
  login: async userRole => {
    const userRoles = User.schema.path('role').enumValues;

    // if userRole is empty or undefined return empty token
    if (!userRole) {
      return '';
    }

    // Filter the user role for sign in
    const userRoleToAuthorize = userRoles.filter(role => userRole === role);

    // if no userRoleToAuthorize exists then return empty token
    if (!userRoleToAuthorize) {
      return '';
    }

    // user creds with role 'userRoleToAuthorize'
    const userCreds = {
      password: `${userRoleToAuthorize}password`,
      role: userRoleToAuthorize,
      email: `email${userRoleToAuthorize}@email.com`,
      lastName: `lastname${userRoleToAuthorize}`,
      firstName: `firstname${userRoleToAuthorize}`,
      passwordConfirmation: `${userRoleToAuthorize}password`,
    };

    // create User in DB with role 'userRoleToAuthorize'
    await new User(userCreds).save();

    // Log in user and save session in globals.userAgentApi
    const responseLogin = await api
      .post(routes.auth.login)
      .send({ email: userCreds.email, password: userCreds.password })
      .catch(err => console.error(err));

    return responseLogin.body.token;
  },
};

module.exports = APIHelpers;
