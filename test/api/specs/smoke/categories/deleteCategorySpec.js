import { User, Category } from '../../../../../server/models';
import photos from '../../../../common/data/photos';

let authToken;
let currentSessionUserId;
const categoriesRoute = routes.categories;

const categoryDataOnePhotoActive = {
  name: 'Electronics',
  photos: [photos.formats.png],
  active: true,
};

describe('Smoke: Category deleting', () => {
  before(async () => {
    // clear DB
    await Category.deleteMany();
    await User.deleteMany();
    // login user with role param.role and get jwt token
    authToken = await testHelpers.authorization.login('ADMIN');
    currentSessionUserId = testHelpers.session.getCurrentUser()._id;
  });

  beforeEach(async () => {
    // set createdBy updatedBy with userId
    const categoryDataOnePhotoActiveWithCreatedByUpdatedBy = {
      ...categoryDataOnePhotoActive,
      createdBy: currentSessionUserId,
      updatedBy: currentSessionUserId,
    };

    await Category(categoryDataOnePhotoActiveWithCreatedByUpdatedBy).save();
    await Category(categoryDataOnePhotoActiveWithCreatedByUpdatedBy).save();
  });

  afterEach(async () => {
    await Category.deleteMany();
  });

  after(async () => {
    await User.deleteMany();
  });

  it('should return 200 when deleting categories with ADMIN role', async () => {
    const categoriesInDBBeforeDeleting = await Category.find({});
    const categoryIdToDelete = categoriesInDBBeforeDeleting[0]._id;

    await api
      .delete(`${categoriesRoute}/${categoryIdToDelete}`)
      .set({ Authorization: authToken })
      .expect(200);

    // check data in DB and compare with response data
    const categoriesInDBAfterDeleting = await Category.findById(categoryIdToDelete);
    expect(categoriesInDBAfterDeleting).to.be.a('null');
  });
});
