import { User, Category } from '../../../../models';
import photos from '../../../common/data/photos';

describe('Category editing', () => {
  let authToken;
  const categoriesRoute = routes.categories;
  let categoryIdToUpdate;

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

  beforeEach(async () => {
    categoryIdToUpdate = await Category(categoryDataOnePhotoActive)
      .save()
      .then(data => data._id);
    console.log(categoryIdToUpdate, 'TO UPDATE');
  });

  afterEach(async () => {
    await Category.deleteMany({});
  });

  after(async () => {
    await User.deleteMany({});
  });

  it('should return 200 when updating category with 2 photos, name, active', async () => {
    const categoryDataTwoPictures = {
      name: 'somenameTwoPics',
      photos: [photos.formats.jpeg, photos.formats.png],
      active: false,
    };

    const res = await api
      .patch(`${categoriesRoute}/${categoryIdToUpdate}`)
      .set({ Authorization: authToken })
      .send(categoryDataTwoPictures)
      .expect(200);

    // check response from server
    expect(res.body.message).to.equal('Category has been updated.');

    // check data in DB
    const categoriesInDB = await Category.find({
      name: categoryDataTwoPictures.name,
    });
    expect(categoriesInDB.length).to.equal(1);
    expect(categoriesInDB[0].photos).to.deep.equal(
      categoryDataTwoPictures.photos,
    );
    expect(categoriesInDB[0].active).to.equal(categoryDataTwoPictures.active);
  });

  it('should return 200 when updating category with 0 photos, name, active', async () => {
    const categoryDataZeroPictures = {
      name: 'somenameZeroPics',
      photos: [],
      active: false,
    };

    const res = await api
      .patch(`${categoriesRoute}/${categoryIdToUpdate}`)
      .set({ Authorization: authToken })
      .send(categoryDataZeroPictures)
      .expect(200);

    // check response from server
    expect(res.body.message).to.equal('Category has been updated.');

    // check data in DB
    const categoriesInDB = await Category.find({
      name: categoryDataZeroPictures.name,
    });
    expect(categoriesInDB.length).to.equal(1);
    expect(categoriesInDB[0].photos).to.deep.equal(
      categoryDataZeroPictures.photos,
    );
    expect(categoriesInDB[0].active).to.equal(categoryDataZeroPictures.active);
  });

  it('should return 200 when updating category with 1 photos, empty name, active', async () => {
    const categoryDataEmptyName = {
      name: '',
      photos: [photos.formats.jpeg],
      active: true,
    };

    const res = await api
      .patch(`${categoriesRoute}/${categoryIdToUpdate}`)
      .set({ Authorization: authToken })
      .send(categoryDataEmptyName)
      .expect(200)
      .catch(err => console.error(err));

    // check response from server
    expect(res.body.message).to.equal('Category has been updated.');

    // check data in DB
    const categoryInDB = await Category.findById(categoryIdToUpdate);
    expect(categoryInDB.photos).to.deep.equal(categoryDataEmptyName.photos);
    expect(categoryInDB.active).to.equal(categoryDataEmptyName.active);
    expect(categoryInDB.name).to.equal(categoryDataOnePhotoActive.name);
  });

  it('should return 200 when updating category with 1 photos, name, no field active', async () => {
    const categoryDataNoActiveField = {
      name: 'chanedgname',
      photos: [photos.formats.jpeg],
    };

    const res = await api
      .patch(`${categoriesRoute}/${categoryIdToUpdate}`)
      .set({ Authorization: authToken })
      .send(categoryDataNoActiveField)
      .expect(200);

    // check response from server
    expect(res.body.message).to.equal('Category has been updated.');

    // check data in DB
    const categoriesInDB = await Category.find({
      name: categoryDataNoActiveField.name,
    });
    expect(categoriesInDB.length).to.equal(1);
    expect(categoriesInDB[0].photos).to.deep.equal(
      categoryDataNoActiveField.photos,
    );
    expect(categoriesInDB[0].active).to.equal(
      categoryDataOnePhotoActive.active,
    );
  });

  it('should return 200 when updating category with 1 photos, active, no field name', async () => {
    const categoryDataNoNameField = {
      photos: [photos.formats.jpeg],
      active: true,
    };

    const res = await api
      .patch(`${categoriesRoute}/${categoryIdToUpdate}`)
      .set({ Authorization: authToken })
      .send(categoryDataNoNameField)
      .expect(200);

    // check response from server
    expect(res.body.message).to.equal('Category has been updated.');

    // check data in DB
    const categoriesInDB = await Category.find({
      name: categoryDataOnePhotoActive.name,
    });
    expect(categoriesInDB.length).to.equal(1);
    expect(categoriesInDB[0].photos).to.deep.equal(
      categoryDataNoNameField.photos,
    );
    expect(categoriesInDB[0].active).to.equal(categoryDataNoNameField.active);
  });

  it('should return 200 when updating category active, name, no field photos,', async () => {
    const categoryDataNoPhotosField = {
      name: 'newNamechanged',
      active: true,
    };

    const res = await api
      .patch(`${categoriesRoute}/${categoryIdToUpdate}`)
      .set({ Authorization: authToken })
      .send(categoryDataNoPhotosField)
      .expect(200);

    // check response from server
    expect(res.body.message).to.equal('Category has been updated.');

    // check data in DB
    const categoriesInDB = await Category.find({
      name: categoryDataNoPhotosField.name,
    });
    expect(categoriesInDB.length).to.equal(1);
    expect(categoriesInDB[0].photos).to.deep.equal(
      categoryDataOnePhotoActive.photos,
    );
    expect(categoriesInDB[0].active).to.equal(categoryDataNoPhotosField.active);
  });
});
