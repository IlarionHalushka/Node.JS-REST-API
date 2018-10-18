import { User } from '../../../../../server/models/index';

describe('Smoke: Signup', () => {
  const userSignupRoute = routes.auth.signUp;

  const userCreds = {
    email: 'email@email.com',
    lastName: 'lastname',
    firstName: 'firstname',
    password: 'password123',
    passwordConfirmation: 'password123',
  };

  beforeEach(async () => {
    await User.deleteMany();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  it('should return 201 when signing up a new user', async () => {
    const res = await api
      .post(userSignupRoute)
      .send(userCreds)
      .expect(201);

    // check response from server
    expect(res.body.message).to.equal('New user is created successfully.');

    // check user data in DB
    const usersInDB = await User.findOne();
    expect(usersInDB.email).to.equal(userCreds.email);
    expect(usersInDB.lastName).to.equal(userCreds.lastName);
    expect(usersInDB.firstName).to.equal(userCreds.firstName);
    expect(usersInDB.password).to.be.a('string');
    expect(usersInDB.role).to.equal('USER');
  });

  it('should return 409 when registering user with existing email', async () => {
    await new User(userCreds).save();

    const res = await api
      .post(userSignupRoute)
      .send(userCreds)
      .expect(409);

    expect(res.body.message).to.equal('Email is already registered.');

    // check that second user was not created wtih same email
    const usersCountInDB = await User.find().countDocuments();
    expect(usersCountInDB).to.equal(1);
  });
});
