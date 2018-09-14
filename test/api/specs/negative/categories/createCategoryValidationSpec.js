import { User, Category } from '../../../../../models';
import photos from '../../../../common/data/photos';

describe('Category creation validation', () => {
  let authToken;
  const categoriesRoute = routes.categories;

  const params = [
    {
      categoryData: {
        photos: [photos.formats.jpeg, photos.formats.png],
        active: true,
      },
      validationMessage: '"name" is required',
    },
    {
      categoryData: {
        name: '',
        photos: [photos.formats.jpeg, photos.formats.png],
        active: true,
      },
      validationMessage: '"name" is not allowed to be empty',
    },
  ];

  before(async () => {
    // clear DB
    await Category.deleteMany();
    await User.deleteMany();

    // login user with role ADMIN and get jwt token
    authToken = await testHelpers.authorization.login('ADMIN');
  });

  afterEach(async () => {
    await Category.deleteMany();
  });

  after(async () => {
    await User.deleteMany();
  });

  params.forEach(param => {
    it(`should return 400 when creating category with ${
      param.validationMessage
    }`, async () => {
      const res = await api
        .post(categoriesRoute)
        .set({ Authorization: authToken })
        .send(param.categoryData)
        .expect(400);

      expect(res.body.message[0].message).to.equal(param.validationMessage);

      const categoriesCountInDB = await Category.find().countDocuments();
      expect(categoriesCountInDB).to.equal(0);
    });
  });
});
