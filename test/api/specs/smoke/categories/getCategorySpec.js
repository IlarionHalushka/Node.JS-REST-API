import { User, Category } from '../../../../../models';
import photos from '../../../../common/data/photos';

let authToken;
let currentSessionUserId;

const params = [{ role: 'USER' }, { role: 'ADMIN' }, { role: '' }];

const categoriesRoute = routes.categories;

const categoryDataOnePhotoActive = {
  name: 'Electronics',
  photos: [photos.formats.png],
  active: true,
};

const categoryDataInactive = {
  name: 'InactiveCategory',
  photos: [photos.formats.png],
  active: false,
};

params.forEach(param => {
  describe(`Smoke: Category fetching (user role: ${param.role})`, () => {
    before(async () => {
      // clear DB
      await Category.deleteMany();
      await User.deleteMany();

      // login user with role param.role and get jwt token
      authToken = await testHelpers.authorization.login(param.role);
      currentSessionUserId = testHelpers.session.getCurrentUser()._id;
    });

    beforeEach(async () => {
      // set createdBy updatedBy with userId for active category data
      const categoryDataOnePhotoActiveWithCreatedByUpdatedBy = {
        ...categoryDataOnePhotoActive,
        createdBy: currentSessionUserId,
        updatedBy: currentSessionUserId,
      };
      // set createdBy updatedBy with userId for inactive category data
      const categoryDataOnePhotoInactiveWithCreatedByUpdatedBy = {
        ...categoryDataInactive,
        createdBy: currentSessionUserId,
        updatedBy: currentSessionUserId,
      };
      // save 2 active and one inactive category in DB
      await Category(categoryDataOnePhotoActiveWithCreatedByUpdatedBy).save();
      await Category(categoryDataOnePhotoActiveWithCreatedByUpdatedBy).save();
      await Category(categoryDataOnePhotoInactiveWithCreatedByUpdatedBy).save();
    });

    afterEach(async () => {
      await Category.deleteMany();
    });

    after(async () => {
      await User.deleteMany();
    });

    it('should return 200 when fetching only active categories', async () => {
      const res = await api
        .get(categoriesRoute)
        .set({ Authorization: authToken })
        .expect(200);

      expect(res.body.data.length).to.equal(2);

      res.body.data.forEach(data => {
        expect(data.name).to.equal(categoryDataOnePhotoActive.name);
        expect(data.photos).to.deep.equal(categoryDataOnePhotoActive.photos);
        expect(data.active).to.equal(categoryDataOnePhotoActive.active);
      });
    });

    it('should return 200 when fetching category by id', async () => {
      const categoriesInDB = await Category.find({});
      const categoryId = categoriesInDB[0]._id;

      const res = await api
        .get(`${categoriesRoute}/${categoryId}`)
        .set({ Authorization: authToken })
        .expect(200);

      expect(res.body.data.name).to.equal(categoryDataOnePhotoActive.name);
      expect(res.body.data.photos).to.deep.equal(
        categoryDataOnePhotoActive.photos,
      );
      expect(res.body.data.active).to.equal(categoryDataOnePhotoActive.active);
    });

    it('should return 200 when fetching includeInactive=true categories', async () => {
      const res = await api
        .get(`${categoriesRoute}?includeInactive=true`)
        .set({ Authorization: authToken })
        .expect(200);

      expect(res.body.data.length).to.equal(3);

      const inactiveCategories = res.body.data.filter(
        value => value.active === false,
      );
      expect(inactiveCategories[0].active).to.equal(false);
    });
  });
});
