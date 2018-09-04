import { User, Category } from '../../../../models';
import photos from '../../../common/data/photos';

describe('Category deleting', () => {
  let authToken;
  const categoriesRoute = routes.categories;

  const categoryDataOnePhotoActive = {
    name: 'Electronics',
    photos: [photos.formats.png],
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

  beforeEach(async () => {
    await Category(categoryDataOnePhotoActive).save();
    await Category(categoryDataOnePhotoActive).save();
  });

  afterEach(async () => {
    await Category.deleteMany({});
  });

  after(async () => {
    await User.deleteMany({});
  });

  it('should return 400 when deleting categories with USER role', async () => {
    const categoriesInDBBeforeDeleting = await Category.find({});
    const categoryIdToDelete = categoriesInDBBeforeDeleting[0]._id;

    await api
      .delete(`${categoriesRoute}/${categoryIdToDelete}`)
      .set({ Authorization: authToken })
      .expect(401);

    // check data in DB and compare with response data
    const categoriesInDBAfterDeleting = await Category.find({
      _id: categoryIdToDelete,
    });
    expect(categoriesInDBAfterDeleting.length).to.equal(1);
  });

  it('should return 200 when deleting categories with ADMIN role', async () => {
    const userCredsAdminRole = { ...userCreds, role: 'ADMIN' };

    await User.deleteMany();
    await User(userCredsAdminRole).save();
    await testHelpers.authorization.signIn({
      email: userCredsAdminRole.email,
      password: userCredsAdminRole.password,
    });

    authToken = testHelpers.session.getCurrentUser().token;

    const categoriesInDBBeforeDeleting = await Category.find({});
    const categoryIdToDelete = categoriesInDBBeforeDeleting[0]._id;

    await api
      .delete(`${categoriesRoute}/${categoryIdToDelete}`)
      .set({ Authorization: authToken })
      .expect(200);

    // check data in DB and compare with response data
    const categoriesInDBAfterDeleting = await Category.find({
      _id: categoryIdToDelete,
    });
    expect(categoriesInDBAfterDeleting.length).to.equal(0);
  });

  it('should return 400 when deleting categories with ADMIN role with not existing id', async () => {
    const categoryId = `${new Date().getTime()}asdfkjskafsdfasdRANDOMSTRING`;

    await api
      .delete(`${categoriesRoute}/${categoryId}`)
      .set({ Authorization: authToken })
      .expect(400);
  });

  it('should return 400 when deleting categories not logged in', async () => {
    const categoriesInDBBeforeDeleting = await Category.find({});
    const categoryIdToDelete = categoriesInDBBeforeDeleting[0]._id;

    await api.delete(`${categoriesRoute}/${categoryIdToDelete}`).expect(400);
  });
});
