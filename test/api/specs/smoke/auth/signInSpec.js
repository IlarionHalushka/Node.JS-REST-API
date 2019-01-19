import { User } from '../../../../../server/models/index';

describe('Smoke: SignIn', () => {
  const userSignInRoute = routes.auth.login;

  const userCredsSignup = {
    email: 'email@email.com',
    lastName: 'lastname',
    firstName: 'firstname',
    password: 'password123',
    passwordConfirmation: 'password123',
  };

  beforeEach(async () => {
    await User.deleteMany({});
    await new User(userCredsSignup).save();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should return 201 when signing in', async () => {
    const res = await api
      .post(userSignInRoute)
      .send({
        email: userCredsSignup.email,
        password: userCredsSignup.password,
      })
      .expect(200);

    expect(res.body.message).to.equal('AUTH_SUCCESSFUL');
    expect(res.body).to.haveOwnProperty('token');
    expect(res.body.token).to.be.a('string');
  });
});
