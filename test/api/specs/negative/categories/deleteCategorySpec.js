import { User, Category } from '../../../../../models';
import photos from '../../../../common/data/photos';

let authToken;
const categoriesRoute = routes.categories;

const categoryDataOnePhotoActive = {
  name: 'Electronics',
  photos: [photos.formats.png],
  active: true,
};

describe('Negative: Category deleting', () => {
  before(async () => {
    // clear DB
    await Category.deleteMany({});
    await User.deleteMany({});

    await Category(categoryDataOnePhotoActive).save();
    await Category(categoryDataOnePhotoActive).save();

    // login user with role param.role and get jwt token
    authToken = await testHelpers.authorization.login('ADMIN');
  });

  after(async () => {
    await User.deleteMany({});
    await Category.deleteMany({});
  });

  it('should return 400 when deleting categories with ADMIN role with not existing id', async () => {
    const categoryId = testHelpers.basic.getUniqueString();

    await api
      .delete(`${categoriesRoute}/${categoryId}`)
      .set({ Authorization: authToken })
      .expect(400);
  });
});
