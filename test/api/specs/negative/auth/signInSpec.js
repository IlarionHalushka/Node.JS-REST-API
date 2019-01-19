import { User } from '../../../../../server/models/index';

describe('Negative: Signin', () => {
  const userSignInRoute = routes.auth.login;

  const userCredsSignup = {
    email: 'email@email.com',
    lastName: 'lastname',
    firstName: 'firstname',
    password: 'password123',
    passwordConfirmation: 'password123',
  };

  const params = [
    {
      testCaseDescription: "email doesn't exist",
      creds: {
        email: testHelpers.basic.getUniqueEmail(),
        password: userCredsSignup.password,
      },
      responseCode: 401,
      responseMessage: 'AUTH_FAILED',
    },
    {
      testCaseDescription: 'wrong password',
      creds: {
        email: userCredsSignup.email,
        password: testHelpers.basic.getUniqueString(),
      },
      responseCode: 401,
      responseMessage: 'AUTH_FAILED',
    },
    {
      testCaseDescription: 'empty password',
      creds: {
        email: userCredsSignup.email,
        password: '',
      },
      responseCode: 400,
      responseMessage: '"password" is not allowed to be empty',
    },
    {
      testCaseDescription: 'empty email',
      creds: {
        email: '',
        password: userCredsSignup.password,
      },
      responseCode: 400,
      responseMessage: '"email" is not allowed to be empty',
    },
    {
      testCaseDescription: 'empty email',
      creds: {
        email: '',
        password: userCredsSignup.password,
      },
      responseCode: 400,
      responseMessage: '"email" is not allowed to be empty',
    },
    {
      testCaseDescription: 'empty format is not valid',
      creds: {
        email: 'afdskfhak.com',
        password: userCredsSignup.password,
      },
      responseCode: 400,
      responseMessage: '"email" must be a valid email',
    },
    {
      testCaseDescription: 'no email field',
      creds: {
        password: userCredsSignup.password,
      },
      responseCode: 400,
      responseMessage: '"email" is required',
    },
    {
      testCaseDescription: 'no password field',
      creds: {
        email: userCredsSignup.email,
      },
      responseCode: 400,
      responseMessage: '"password" is required',
    },
  ];

  before(async () => {
    await User.deleteMany({});
    await new User(userCredsSignup).save();
  });

  after(async () => {
    await User.deleteMany({});
  });

  params.forEach(param => {
    it(`should return ${param.responseCode} when ${param.testCaseDescription}`, async () => {
      const res = await api
        .post(userSignInRoute)
        .send(param.creds)
        .expect(param.responseCode);

      const resBodyMessage = res.body.message[0].message || res.body.message;

      expect(resBodyMessage).to.equal(param.responseMessage);
      expect(res.body).to.not.haveOwnProperty('token');
    });
  });
});
