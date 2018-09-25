import { User, Category } from '../../../../../models';
import photos from '../../../../common/data/photos';

let authToken;
let currentSessionUserId;
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

    // login user with role param.role and get jwt token
    authToken = await testHelpers.authorization.login('ADMIN');
    currentSessionUserId = testHelpers.session.getCurrentUser()._id;

    // set createdBy updatedBy with userId
    const categoryDataOnePhotoActiveWithCreatedByUpdatedBy = {
      ...categoryDataOnePhotoActive,
      createdBy: currentSessionUserId,
      updatedBy: currentSessionUserId,
    };
    await Category(categoryDataOnePhotoActiveWithCreatedByUpdatedBy).save();
    await Category(categoryDataOnePhotoActiveWithCreatedByUpdatedBy).save();
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
      .expect(500);
  });
});
