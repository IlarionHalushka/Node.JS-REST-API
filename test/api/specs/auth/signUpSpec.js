import { User } from '../../../../models/index';

describe('Signup', () => {
  const userSignupRoute = '/api/v1/auth/signUp';

  const userCreds = {
    email: 'email@email.com',
    lastName: 'lastname',
    firstName: 'firstname',
    password: 'password123',
    passwordConfirmation: 'password123',
  };

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should return 201 when signIng up a new user', async () => {
    const res = await api
      .post(userSignupRoute)
      .send(userCreds)
      .expect(201);

    // check response from server
    expect(res.body.message).to.equal('New user is created successfully.');

    // check data in DB
    const usersInDB = await User.find();
    expect(usersInDB[0].email).to.equal(userCreds.email);
    expect(usersInDB[0].lastName).to.equal(userCreds.lastName);
    expect(usersInDB[0].firstName).to.equal(userCreds.firstName);
    expect(usersInDB[0].password).to.be.a('string');
    expect(usersInDB[0].role).to.equal('USER');
    expect(usersInDB.length).to.equal(1);
  });

  it('should return 409 when registering user with existing email', async () => {
    await new User(userCreds).save();

    const res = await api
      .post(userSignupRoute)
      .send(userCreds)
      .expect(409);

    expect(res.body.message).to.equal('Email is already registered.');

    const usersCountInDB = await User.find().countDocuments();
    expect(usersCountInDB).to.equal(1);
  });

  it('should return 400 when email is invalid', async () => {
    const userCredsInvalidEmail = { ...userCreds, email: 'string' };

    const res = await api
      .post(userSignupRoute)
      .send(userCredsInvalidEmail)
      .expect(400);

    expect(res.body.message[0].message).to.equal(
      '"email" must be a valid email',
    );

    const usersCountInDB = await User.find().countDocuments();
    expect(usersCountInDB).to.equal(0);
  });

  it('should return 400 when password and confirmation do not match', async () => {
    const userCredsNotMatchingConfirmation = {
      ...userCreds,
      password: 'string',
      passwordConfirmation: 'string123',
    };

    const res = await api
      .post(userSignupRoute)
      .send(userCredsNotMatchingConfirmation)
      .expect(400);

    expect(res.body.message[0].message).to.equal(
      '"passwordConfirmation" must match password',
    );

    const usersCountInDB = await User.find().countDocuments();
    expect(usersCountInDB).to.equal(0);
  });

  it('should return 400 when password is empty', async () => {
    const userCredsEmptyPassword = { ...userCreds, password: '' };

    const res = await api
      .post(userSignupRoute)
      .send(userCredsEmptyPassword)
      .expect(400);

    expect(res.body.message[0].message).to.equal(
      '"password" is not allowed to be empty',
    );

    const usersCountInDB = await User.find().countDocuments();
    expect(usersCountInDB).to.equal(0);
  });

  it('should return 400 when email is empty', async () => {
    const userCredsEmptyEmail = { ...userCreds, email: '' };

    const res = await api
      .post(userSignupRoute)
      .send(userCredsEmptyEmail)
      .expect(400);

    expect(res.body.message[0].message).to.equal(
      '"email" is not allowed to be empty',
    );

    const usersCountInDB = await User.find().countDocuments();
    expect(usersCountInDB).to.equal(0);
  });

  it('should return 400 when firstName is empty', async () => {
    const userCredsEmptyFirstName = { ...userCreds, firstName: '' };

    const res = await api
      .post(userSignupRoute)
      .send(userCredsEmptyFirstName)
      .expect(400);

    expect(res.body.message[0].message).to.equal(
      '"firstName" is not allowed to be empty',
    );

    const usersCountInDB = await User.find().countDocuments();
    expect(usersCountInDB).to.equal(0);
  });

  it('should return 400 when lastName is empty', async () => {
    const userCredsEmptyLastName = { ...userCreds, lastName: '' };

    const res = await api
      .post(userSignupRoute)
      .send(userCredsEmptyLastName)
      .expect(400);

    expect(res.body.message[0].message).to.equal(
      '"lastName" is not allowed to be empty',
    );

    const usersCountInDB = await User.find().countDocuments();
    expect(usersCountInDB).to.equal(0);
  });

  it('should return 400 when passwordConfirmation is empty', async () => {
    const userCredsEmptyPasswordConfirmation = {
      ...userCreds,
      passwordConfirmation: '',
    };

    const res = await api
      .post(userSignupRoute)
      .send(userCredsEmptyPasswordConfirmation)
      .expect(400);

    expect(res.body.message[0].message).to.equal(
      '"passwordConfirmation" must match password',
    );

    const usersCountInDB = await User.find().countDocuments();
    expect(usersCountInDB).to.equal(0);
  });

  it('should return 400 when password length is less than 6', async () => {
    const userCredsPasswordFiveChars = {
      ...userCreds,
      password: 'strin',
      passwordConfirmation: 'strin',
    };

    const res = await api
      .post(userSignupRoute)
      .send(userCredsPasswordFiveChars)
      .expect(400);

    expect(res.body.message[0].message).to.equal(
      '"password" length must be at least 6 characters long',
    );

    const usersCountInDB = await User.find().countDocuments();
    expect(usersCountInDB).to.equal(0);
  });

  it('should return 400 when no "email" field', async () => {
    const userCredsNoEmail = { ...userCreds };
    delete userCredsNoEmail.email;

    const res = await api
      .post(userSignupRoute)
      .send(userCredsNoEmail)
      .expect(400);

    expect(res.body.message[0].message).to.equal('"email" is required');

    const usersCountInDB = await User.find().countDocuments();
    expect(usersCountInDB).to.equal(0);
  });

  it('should return 400 when no "password" field', async () => {
    const userCredsNoPassword = { ...userCreds };
    delete userCredsNoPassword.password;

    const res = await api
      .post(userSignupRoute)
      .send(userCredsNoPassword)
      .expect(400);

    expect(res.body.message[0].message).to.equal('"password" is required');

    const usersCountInDB = await User.find().countDocuments();
    expect(usersCountInDB).to.equal(0);
  });
});
