import { User, Category } from '../../../../../models';
import photos from '../../../../common/data/photos';

let authToken;

const params = [{ role: 'USER' }, { role: 'ADMIN' }, { role: '' }];

const categoriesRoute = routes.categories;

const categoryDataOnePhotoActive = {
  name: 'Electronics',
  photos: [photos.formats.png],
  active: true,
};

const categoryDatInactive = {
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

      // login user with role ADMIN and get jwt token
      authToken = await testHelpers.authorization.login(param.role);
    });

    beforeEach(async () => {
      // save 2 active and one inactive category in DB
      await Category(categoryDataOnePhotoActive).save();
      await Category(categoryDataOnePhotoActive).save();
      await Category(categoryDatInactive).save();
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
      expect(res.body.data[0].name).to.equal(categoryDataOnePhotoActive.name);
      expect(res.body.data[0].photos).to.deep.equal(
        categoryDataOnePhotoActive.photos,
      );
      expect(res.body.data[0].active).to.equal(
        categoryDataOnePhotoActive.active,
      );
      expect(res.body.data[1].name).to.equal(categoryDataOnePhotoActive.name);
      expect(res.body.data[1].photos).to.deep.equal(
        categoryDataOnePhotoActive.photos,
      );
      expect(res.body.data[1].active).to.equal(
        categoryDataOnePhotoActive.active,
      );
    });

    it('should return 200 when fetching category by id', async () => {
      const categoriesInDB = await Category.find({});
      const categoryId = categoriesInDB[0]._id;

      const res = await api
        .get(`${categoriesRoute}/${categoryId}`)
        .set({ Authorization: authToken })
        .expect(200);

      expect(res.body.data.length).to.equal(1);
      expect(res.body.data[0].name).to.equal(categoryDataOnePhotoActive.name);
      expect(res.body.data[0].photos).to.deep.equal(
        categoryDataOnePhotoActive.photos,
      );
      expect(res.body.data[0].active).to.equal(
        categoryDataOnePhotoActive.active,
      );
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
