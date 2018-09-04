import { User, Category } from '../../../../models/index';
import photos from '../../../common/data/photos';

describe('Category creation', () => {
  let authToken;
  const categoriesRoute = routes.categories;

  const categoryData = {
    name: 'Electronics',
    photos: [photos.formats.jpeg, photos.formats.png],
    active: true,
  };

  const userCreds = {
    email: 'email@email.com',
    lastName: 'lastname',
    firstName: 'firstname',
    password: 'password123',
    passwordConfirmation: 'password123',
    role: 'ADMIN',
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

  it('should return 201 when creating category with 2 photos', async () => {
    const res = await api
      .post(categoriesRoute)
      .set({ Authorization: authToken })
      .send(categoryData)
      .expect(201);

    // check response from server
    expect(res.body.message).to.equal('New category is created successfully.');

    // check data in DB
    const categoriesInDB = await Category.find({
      name: categoryData.name,
    });
    expect(categoriesInDB.length).to.equal(1);
    expect(categoriesInDB[0].photos).to.deep.equal(categoryData.photos);
    expect(categoriesInDB[0].active).to.equal(true);
  });

  it('should return 201 when creating category with 1 photo', async () => {
    const categoryDataOnePicture = { ...categoryData };
    categoryDataOnePicture.photos.length = 1;

    const res = await api
      .post(categoriesRoute)
      .set({ Authorization: authToken })
      .send(categoryDataOnePicture)
      .expect(201);

    // check response from server
    expect(res.body.message).to.equal('New category is created successfully.');

    // check data in DB
    const categoriesInDB = await Category.find({
      name: categoryDataOnePicture.name,
    });
    expect(categoriesInDB.length).to.equal(1);
    expect(categoriesInDB[0].photos.length).to.equal(1);
    expect(categoriesInDB[0].active).to.equal(true);
  });

  it('should return 201 when creating category with 0 photos', async () => {
    const categoryDataZeroPictures = { ...categoryData };
    categoryDataZeroPictures.photos.length = 0;

    const res = await api
      .post(categoriesRoute)
      .set({ Authorization: authToken })
      .send(categoryDataZeroPictures)
      .expect(201);

    // check response from server
    expect(res.body.message).to.equal('New category is created successfully.');

    // check data in DB
    const categoriesInDB = await Category.find({
      name: categoryDataZeroPictures.name,
    });
    expect(categoriesInDB[0].photos.length).to.equal(0);
    expect(categoriesInDB.length).to.equal(1);
    expect(categoriesInDB[0].active).to.equal(true);
  });

  it('should return 201 when creating category with no "photos" field', async () => {
    const categoryDataNoPhotosField = { ...categoryData };
    delete categoryDataNoPhotosField.photos;

    const res = await api
      .post(categoriesRoute)
      .set({ Authorization: authToken })
      .send(categoryDataNoPhotosField)
      .expect(201);

    // check response from server
    expect(res.body.message).to.equal('New category is created successfully.');

    // check data in DB
    const categoriesInDB = await Category.find({
      name: categoryDataNoPhotosField.name,
    });
    expect(categoriesInDB[0].photos.length).to.equal(0);
    expect(categoriesInDB.length).to.equal(1);
    expect(categoriesInDB[0].active).to.equal(true);
  });

  it('should return 201 when creating category with no "active" field', async () => {
    const categoryDataNoActiveField = { ...categoryData };
    delete categoryDataNoActiveField.active;

    const res = await api
      .post(categoriesRoute)
      .set({ Authorization: authToken })
      .send(categoryDataNoActiveField)
      .expect(201);

    // check response from server
    expect(res.body.message).to.equal('New category is created successfully.');

    // check data in DB
    const categoriesInDB = await Category.find({
      name: categoryDataNoActiveField.name,
    });
    expect(categoriesInDB[0].active).to.equal(true);
  });

  it('should return 400 when creating category with no "name" field', async () => {
    const categoryDataNoNameField = { ...categoryData };
    delete categoryDataNoNameField.name;

    const res = await api
      .post(categoriesRoute)
      .set({ Authorization: authToken })
      .send(categoryDataNoNameField)
      .expect(400);

    expect(res.body.message[0].message).to.equal('"name" is required');

    const categoriesCountInDB = await Category.find().countDocuments();
    expect(categoriesCountInDB).to.equal(0);
  });

  it('should return 400 when creating category with empty "name" field', async () => {
    const categoryDataNoNameField = { ...categoryData, name: '' };

    const res = await api
      .post(categoriesRoute)
      .set({ Authorization: authToken })
      .send(categoryDataNoNameField)
      .expect(400);

    expect(res.body.message[0].message).to.equal(
      '"name" is not allowed to be empty',
    );

    const categoriesCountInDB = await Category.find().countDocuments();
    expect(categoriesCountInDB).to.equal(0);
  });
});
