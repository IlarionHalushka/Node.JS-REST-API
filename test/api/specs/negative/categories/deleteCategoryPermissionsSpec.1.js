import { User, Category } from '../../../../../models';
import photos from '../../../../common/data/photos';

const params = [
  {
    role: 'USER',
    responseCode: 401,
  },
  {
    role: '',
    responseCode: 400,
  },
];

let authToken;
const categoriesRoute = routes.categories;

const categoryDataOnePhotoActive = {
  name: 'Electronics',
  photos: [photos.formats.png],
  active: true,
};

params.forEach(param => {
  describe('Negative: Category deleting permissions', () => {
    before(async () => {
      // clear DB
      await Category.deleteMany({});
      await User.deleteMany({});

      // login user with role param.role and get jwt token
      authToken = await testHelpers.authorization.login(param.role);
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

    it(`should return ${param.responseCode} when deleting categories with ${
      param.role
    } role`, async () => {
      const categoriesInDBBeforeDeleting = await Category.find({});
      const categoryIdToDelete = categoriesInDBBeforeDeleting[0]._id;

      await api
        .delete(`${categoriesRoute}/${categoryIdToDelete}`)
        .set({ Authorization: authToken })
        .expect(param.responseCode);

      // check that the category that was attempted to be deleted is still in DB
      const categoriesInDBAfterDeleting = await Category.find({
        _id: categoryIdToDelete,
      });
      expect(categoriesInDBAfterDeleting.length).to.equal(1);
    });
  });
});
