import { User, Category } from '../../../../../server/models';
import photos from '../../../../common/data/photos';

let authToken;
const categoriesRoute = routes.categories;
let categoryIdToEdit;
let currentSessionUserId;

const categoryDataOnePhotoActive = {
  name: 'Electronics',
  photos: [photos.formats.png],
  active: true,
};

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

params.forEach(param => {
  describe('Negative: Category editing permissions', () => {
    before(async () => {
      // clear DB
      await Category.deleteMany({});
      await User.deleteMany({});

      // login user with role ADMIN and get jwt token
      authToken = await testHelpers.authorization.login(param.role);
      currentSessionUserId = testHelpers.session.getCurrentUser()._id;
    });

    beforeEach(async () => {
      // set createdBy updatedBy with userId
      const categoryDataOnePhotoActiveWithCreatedByUpdatedBy = {
        ...categoryDataOnePhotoActive,
        createdBy: currentSessionUserId,
        updatedBy: currentSessionUserId,
      };
      categoryIdToEdit = await Category(categoryDataOnePhotoActiveWithCreatedByUpdatedBy)
        .save()
        .then(document => document._id);
    });

    afterEach(async () => {
      await Category.deleteMany({});
    });

    after(async () => {
      await User.deleteMany({});
    });

    it(`should return ${param.responseCode} when editing categories with ${
      param.role
    } role`, async () => {
      await api
        .patch(`${categoriesRoute}/${categoryIdToEdit}`)
        .set({ Authorization: authToken })
        .send(param.categoryDataToEdit)
        .expect(param.responseCode);

      // check that the category that was attempted to be edited is not edited
      const categoriesInDBAfterEditing = await Category.find({
        _id: categoryIdToEdit,
      });
      expect(categoriesInDBAfterEditing.length).to.equal(1);

      expect(categoriesInDBAfterEditing[0].photos).to.deep.equal(categoryDataOnePhotoActive.photos);
      expect(categoriesInDBAfterEditing[0].active).to.equal(categoryDataOnePhotoActive.active);
      expect(categoriesInDBAfterEditing[0].name).to.equal(categoryDataOnePhotoActive.name);
    });
  });
});
