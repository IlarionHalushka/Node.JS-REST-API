import { User, Category } from '../../../../../models';
import photos from '../../../../common/data/photos';

describe('Smoke: Category deleting', () => {
  let authToken;
  const categoriesRoute = routes.categories;

  const categoryDataOnePhotoActive = {
    name: 'Electronics',
    photos: [photos.formats.png],
    active: true,
  };

  before(async () => {
    // clear DB
    await Category.deleteMany({});
    await User.deleteMany({});
    // login user with role param.role and get jwt token
    authToken = await testHelpers.authorization.login('ADMIN');
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

  it('should return 200 when deleting categories with ADMIN role', async () => {
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
});
