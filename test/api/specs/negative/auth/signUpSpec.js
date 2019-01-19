import { User } from '../../../../../server/models/index';

describe('Negative: Signup', () => {
  const userSignUpRoute = routes.auth.signUp;

  const userCreds = {
    email: 'email@email.com',
    lastName: 'lastname',
    firstName: 'firstname',
    password: 'password123',
    passwordConfirmation: 'password123',
  };

  const params = [
    {
      testCaseDescription: 'email format is invalid',
      creds: {
        email: 'afadsfadsf.asdf',
        password: userCreds.password,
        lastName: userCreds.lastName,
        firstName: userCreds.password,
        passwordConfirmation: userCreds.passwordConfirmation,
      },
      responseCode: 400,
      responseMessage: '"email" must be a valid email',
    },
    {
      testCaseDescription: 'password and confirmation do not match',
      creds: {
        email: userCreds.email,
        password: userCreds.password,
        lastName: userCreds.lastName,
        firstName: userCreds.password,
        passwordConfirmation: testHelpers.basic.getUniqueString(),
      },
      responseCode: 400,
      responseMessage: '"passwordConfirmation" must match password',
    },
    {
      testCaseDescription: 'password is empty',
      creds: {
        email: userCreds.email,

        password: '',
        lastName: userCreds.lastName,
        firstName: userCreds.password,
        passwordConfirmation: userCreds.passwordConfirmation,
      },
      responseCode: 400,
      responseMessage: '"password" is not allowed to be empty',
    },
    {
      testCaseDescription: 'email is empty',
      creds: {
        email: '',
        password: userCreds.password,
        lastName: userCreds.lastName,
        firstName: userCreds.password,
        passwordConfirmation: userCreds.passwordConfirmation,
      },
      responseCode: 400,
      responseMessage: '"email" is not allowed to be empty',
    },
    {
      testCaseDescription: 'firstName is empty',
      creds: {
        email: userCreds.email,
        password: userCreds.password,
        lastName: userCreds.lastName,
        firstName: '',
        passwordConfirmation: userCreds.passwordConfirmation,
      },
      responseCode: 400,
      responseMessage: '"firstName" is not allowed to be empty',
    },
    {
      testCaseDescription: 'lastName is empty',
      creds: {
        email: userCreds.email,
        password: userCreds.password,
        firstName: userCreds.firstName,
        lastName: '',
        passwordConfirmation: userCreds.passwordConfirmation,
      },
      responseCode: 400,
      responseMessage: '"lastName" is not allowed to be empty',
    },
    {
      testCaseDescription: 'passwordConfirmation is empty',
      creds: {
        email: userCreds.email,
        password: userCreds.password,
        firstName: userCreds.firstName,
        passwordConfirmation: '',
        lastName: userCreds.lastName,
      },
      responseCode: 400,
      responseMessage: '"passwordConfirmation" must match password',
    },
    {
      testCaseDescription: 'password length is less than 6',
      creds: {
        email: userCreds.email,
        password: '12345',
        firstName: userCreds.firstName,
        passwordConfirmation: '12345',
        lastName: userCreds.lastName,
      },
      responseCode: 400,
      responseMessage: '"password" length must be at least 6 characters long',
    },
    {
      testCaseDescription: 'no email field',
      creds: {
        password: userCreds.password,
        firstName: userCreds.firstName,
        passwordConfirmation: userCreds.passwordConfirmation,
        lastName: userCreds.lastName,
      },
      responseCode: 400,
      responseMessage: '"email" is required',
    },
    {
      testCaseDescription: 'no password field',
      creds: {
        email: userCreds.email,
        firstName: userCreds.firstName,
        passwordConfirmation: userCreds.passwordConfirmation,
        lastName: userCreds.lastName,
      },
      responseCode: 400,
      responseMessage: '"password" is required',
    },
  ];

  beforeEach(async () => {
    await User.deleteMany();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  params.forEach(param => {
    it(`should return ${param.responseCode} when ${param.testCaseDescription}`, async () => {
      const res = await api
        .post(userSignUpRoute)
        .send(param.creds)
        .expect(param.responseCode);

      expect(res.body.message[0].message).to.equal(param.responseMessage);

      // check that no user was created in DB
      const usersCountInDB = await User.find().countDocuments();
      expect(usersCountInDB).to.equal(0);
    });
  });
});
