import { User, Category } from '../../../../models/index';
import photos from '../../../common/data/photos';

describe('Category creation permissions', () => {
  let authToken;
  const categoriesRoute = routes.categories;

  const categoryData = {
    name: 'ElectronicsUSERRole',
    photos: [photos.formats.jpeg, photos.formats.png],
    active: true,
  };

  const userCreds = {
    email: 'email@email.com',
    lastName: 'lastname',
    firstName: 'firstname',
    password: 'password123',
    passwordConfirmation: 'password123',
    role: 'USER',
  };

  before(async () => {
    // clear DB
    await Category.deleteMany({});
    await User.deleteMany({});

    // create and sign in user to get jwt token
    await User(userCreds).save();
    await testHelpers.authorization.signIn({
      email: userCreds.email,
      password: userCreds.password,
    });

    authToken = testHelpers.session.getCurrentUser().token;
  });

  afterEach(async () => {
    await Category.deleteMany({});
  });

  after(async () => {
    await User.deleteMany({});
  });

  it('should return 401 when creating category with USER role', async () => {
    await api
      .post(categoriesRoute)
      .set({ Authorization: authToken })
      .send(categoryData)
      .expect(401);

    // check data in DB
    const categoriesInDB = await Category.find({
      name: categoryData.name,
    });
    expect(categoriesInDB.length).to.equal(0);
  });

  it('should return 400 when creating category without token', async () => {
    await api
      .post(categoriesRoute)
      .send(categoryData)
      .expect(400);

    // check data in DB
    const categoriesInDB = await Category.find({
      name: categoryData.name,
    });
    expect(categoriesInDB.length).to.equal(0);
  });
});
