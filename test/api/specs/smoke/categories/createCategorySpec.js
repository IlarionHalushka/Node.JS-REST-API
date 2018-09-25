import { User, Category } from '../../../../../models/index';
import photos from '../../../../common/data/photos';

let authToken;
let currentSessionUserId;
const categoriesRoute = routes.categories;

const categoryData = {
  name: 'Electronics',
  photos: [photos.formats.jpeg, photos.formats.png],
  active: true,
};

const params = [
  {
    description: 'with 2 photos',
    categoryData: {
      ...categoryData,
    },
    responseMessage: 'New Category is created successfully.',
  },
  {
    description: 'with 1 photo',
    categoryData: {
      ...categoryData,
      photos: [categoryData.photos[0]],
    },
    responseMessage: 'New Category is created successfully.',
  },
  {
    description: 'with 0 photos',
    categoryData: {
      ...categoryData,
      photos: [],
    },
    responseMessage: 'New Category is created successfully.',
  },
  {
    description: 'with no "active" field',
    categoryData: {
      name: categoryData.name,
      photos: categoryData.photos,
    },
    responseMessage: 'New Category is created successfully.',
  },
  {
    description: 'with active false',
    categoryData: {
      name: categoryData.name,
      photos: categoryData.photos,
      active: false,
    },
    responseMessage: 'New Category is created successfully.',
  },
];

describe('Smoke: Category creation', () => {
  before(async () => {
    // clear DB
    await Category.deleteMany();
    await User.deleteMany();

    // login user with role ADMIN and get jwt token
    authToken = await testHelpers.authorization.login('ADMIN');
    currentSessionUserId = testHelpers.session.getCurrentUser()._id;
  });

  afterEach(async () => {
    await Category.deleteMany();
  });

  after(async () => {
    await User.deleteMany();
  });

  params.forEach(param => {
    it(`should return 201 when creating category ${
      param.description
    }`, async () => {
      const res = await api
        .post(categoriesRoute)
        .set({ Authorization: authToken })
        .send(param.categoryData)
        .expect(201);

      // check response from server
      expect(res.body.message).to.equal(param.responseMessage);

      // check data in DB
      const categoriesInDB = await Category.find({
        name: param.categoryData.name,
      });
      expect(categoriesInDB.length).to.equal(1);
      expect(categoriesInDB[0].photos).to.deep.equal(param.categoryData.photos);
      // by default "active" is true
      if (param.categoryData.active === undefined) {
        param.categoryData.active = true;
      }
      expect(categoriesInDB[0].active).to.equal(param.categoryData.active);
      expect(categoriesInDB[0].createdBy).to.deep.equal(currentSessionUserId);
      expect(categoriesInDB[0].updatedBy).to.deep.equal(currentSessionUserId);
      expect(categoriesInDB[0].createdAt).to.be.a('date');
      expect(categoriesInDB[0].updatedAt).to.be.a('date');
    });
  });

  it(`should return 409 when creating category with already existing name`, async () => {
    // set createdBy updatedBy with userId for active category data
    const categoryDataOnePhotoActiveWithCreatedByUpdatedBy = {
      ...categoryData,
      createdBy: currentSessionUserId,
      updatedBy: currentSessionUserId,
    };
    await Category.create(categoryDataOnePhotoActiveWithCreatedByUpdatedBy);

    const res = await api
      .post(categoriesRoute)
      .set({ Authorization: authToken })
      .send(categoryData)
      .expect(409);

    // check response from server
    expect(res.body.message).to.equal('Category is already created.');

    // check data in DB
    const categoriesInDB = await Category.find({
      name: categoryData.name,
    });
    expect(categoriesInDB.length).to.equal(1);
    expect(categoriesInDB[0].photos).to.deep.equal(categoryData.photos);
    expect(categoriesInDB[0].active).to.equal(categoryData.active);
    expect(categoriesInDB[0].createdBy).to.deep.equal(currentSessionUserId);
    expect(categoriesInDB[0].updatedBy).to.deep.equal(currentSessionUserId);
    expect(categoriesInDB[0].createdAt).to.be.a('date');
    expect(categoriesInDB[0].updatedAt).to.be.a('date');
  });
});
