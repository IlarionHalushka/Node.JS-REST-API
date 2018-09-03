import { User } from '../../../../models/index';

describe('Signin', () => {
  const userSignInRoute = routes.auth.signIn;

  const userCredsSignin = {
    email: 'email@email.com',
    password: 'password123',
  };

  const userCredsSignup = {
    email: 'email@email.com',
    lastName: 'lastname',
    firstName: 'firstname',
    password: 'password123',
    passwordConfirmation: 'password123',
  };

  before(async () => {
    await User(userCredsSignup).save();
  });

  after(async () => {
    await User.deleteMany({});
  });

  it('should return 201 when signIng up', async () => {
    const res = await api
      .post(userSignInRoute)
      .send(userCredsSignin)
      .expect(200);

    expect(res.body.message).to.equal('Auth successful');
    expect(res.body).to.haveOwnProperty('token');
    expect(res.body.token).to.be.a('string');
  });

  it("should return 401 when email doesn't exist", async () => {
    const userCredsSigninWrongPassword = {
      ...userCredsSignin,
      email: 'asdff@sdffa.aa',
    };

    const res = await api
      .post(userSignInRoute)
      .send(userCredsSigninWrongPassword)
      .expect(401);

    expect(res.body.message).to.equal('Auth failed');
    expect(res.body).to.not.haveOwnProperty('token');
  });

  it('should return 401 when wrong password', async () => {
    const userCredsSigninWrongPassword = {
      ...userCredsSignin,
      password: '123123',
    };

    const res = await api
      .post(userSignInRoute)
      .send(userCredsSigninWrongPassword)
      .expect(401);

    expect(res.body.message).to.equal('Auth failed');
    expect(res.body).to.not.haveOwnProperty('token');
  });

  it('should return 400 when empty password', async () => {
    const userCredsSigninEmptyPassword = { ...userCredsSignin, password: '' };

    const res = await api
      .post(userSignInRoute)
      .send(userCredsSigninEmptyPassword)
      .expect(400);

    expect(res.body.message[0].message).to.equal(
      '"password" is not allowed to be empty',
    );
    expect(res.body).to.not.haveOwnProperty('token');
  });

  it('should return 400 when empty email', async () => {
    const userCredsSigninEmptyEmail = { ...userCredsSignin, email: '' };

    const res = await api
      .post(userSignInRoute)
      .send(userCredsSigninEmptyEmail)
      .expect(400);

    expect(res.body.message[0].message).to.equal(
      '"email" is not allowed to be empty',
    );
    expect(res.body).to.not.haveOwnProperty('token');
  });

  it('should return 400 when email is invalid', async () => {
    const userCredsSigninEnvalidEmail = {
      ...userCredsSignin,
      email: 'email123',
    };

    const res = await api
      .post(userSignInRoute)
      .send(userCredsSigninEnvalidEmail)
      .expect(400);

    expect(res.body.message[0].message).to.equal(
      '"email" must be a valid email',
    );
    expect(res.body).to.not.haveOwnProperty('token');
  });

  it('should return 400 when no email field', async () => {
    const userCredsSigninNoEmailField = { ...userCredsSignin };
    delete userCredsSigninNoEmailField.email;

    const res = await api
      .post(userSignInRoute)
      .send(userCredsSigninNoEmailField)
      .expect(400);

    expect(res.body.message[0].message).to.equal('"email" is required');
    expect(res.body).to.not.haveOwnProperty('token');
  });

  it('should return 400 when no password field', async () => {
    const userCredsSigninNoPasswordField = { ...userCredsSignin };
    delete userCredsSigninNoPasswordField.password;

    const res = await api
      .post(userSignInRoute)
      .send(userCredsSigninNoPasswordField)
      .expect(400);

    expect(res.body.message[0].message).to.equal('"password" is required');
    expect(res.body).to.not.haveOwnProperty('token');
  });
});
