import { User, Category } from '../../../../models';
import photos from '../../../common/data/photos';

describe('Category fetching', () => {
  let authToken;
  const categoriesRoute = routes.categories;

  const categoryDataOnePhotoActive = {
    name: 'Electronics',
    photos: [photos.formats.png],
    active: true,
  };

  const categoryDatInactive = {
    name: 'InactiveCategory',
    photos: [photos.formats.png],
    active: false,
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
    await Category(categoryDatInactive).save();
  });

  afterEach(async () => {
    await Category.deleteMany({});
  });

  after(async () => {
    await User.deleteMany({});
  });

  it('should return 200 when fetching categories not logged in (only active)', async () => {
    const res = await api.get(categoriesRoute).expect(200);

    expect(res.body.data.length).to.equal(2);
    expect(res.body.data[0].name).to.equal(categoryDataOnePhotoActive.name);
    expect(res.body.data[0].photos).to.deep.equal(
      categoryDataOnePhotoActive.photos,
    );
    expect(res.body.data[0].active).to.equal(categoryDataOnePhotoActive.active);
    expect(res.body.data[1].name).to.equal(categoryDataOnePhotoActive.name);
    expect(res.body.data[1].photos).to.deep.equal(
      categoryDataOnePhotoActive.photos,
    );
    expect(res.body.data[1].active).to.equal(categoryDataOnePhotoActive.active);
  });

  it('should return 200 when fetching categories USER role (only active)', async () => {
    const res = await api
      .get(categoriesRoute)
      .set({ Authorization: authToken })
      .expect(200);

    expect(res.body.data.length).to.equal(2);
    expect(res.body.data[0].name).to.equal(categoryDataOnePhotoActive.name);
    expect(res.body.data[0].photos).to.deep.equal(
      categoryDataOnePhotoActive.photos,
    );
    expect(res.body.data[0].active).to.equal(categoryDataOnePhotoActive.active);
    expect(res.body.data[1].name).to.equal(categoryDataOnePhotoActive.name);
    expect(res.body.data[1].photos).to.deep.equal(
      categoryDataOnePhotoActive.photos,
    );
    expect(res.body.data[1].active).to.equal(categoryDataOnePhotoActive.active);
  });

  it('should return 200 when fetching category by id', async () => {
    const categoriesInDB = await Category.find({});
    const categoryId = categoriesInDB[0]._id;

    const res = await api.get(`${categoriesRoute}/${categoryId}`).expect(200);

    expect(res.body.data.length).to.equal(1);
    expect(res.body.data[0].name).to.equal(categoryDataOnePhotoActive.name);
    expect(res.body.data[0].photos).to.deep.equal(
      categoryDataOnePhotoActive.photos,
    );
    expect(res.body.data[0].active).to.equal(categoryDataOnePhotoActive.active);
  });

  it('should return 200 when fetching includeInactive=true categories', async () => {
    const res = await api
      .get(`${categoriesRoute}?includeInactive=true`)
      .expect(200);

    expect(res.body.data.length).to.equal(3);

    const inactiveCategories = res.body.data.filter(value => {
      if (value.active === false) {
        return true;
      }
      return false;
    });
    expect(inactiveCategories[0].active).to.equal(false);
  });

  it('should return 200 when fetching categories ADMIN role (only active)', async () => {
    const userCredsAdminRole = { ...userCreds, role: 'ADMIN' };

    await User(userCredsAdminRole).save();
    await testHelpers.authorization.signIn({
      email: userCredsAdminRole.email,
      password: userCredsAdminRole.password,
    });

    authToken = testHelpers.session.getCurrentUser().token;

    const res = await api
      .get(categoriesRoute)
      .set({ Authorization: authToken })
      .expect(200);

    expect(res.body.data.length).to.equal(2);
    expect(res.body.data[0].name).to.equal(categoryDataOnePhotoActive.name);
    expect(res.body.data[0].photos).to.deep.equal(
      categoryDataOnePhotoActive.photos,
    );
    expect(res.body.data[0].active).to.equal(categoryDataOnePhotoActive.active);
    expect(res.body.data[1].name).to.equal(categoryDataOnePhotoActive.name);
    expect(res.body.data[1].photos).to.deep.equal(
      categoryDataOnePhotoActive.photos,
    );
    expect(res.body.data[1].active).to.equal(categoryDataOnePhotoActive.active);
  });
});
