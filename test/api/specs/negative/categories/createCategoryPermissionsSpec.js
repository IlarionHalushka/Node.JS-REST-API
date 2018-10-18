import { User, Category } from '../../../../../server/models';
import photos from '../../../../common/data/photos';

let authToken;

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

const categoriesRoute = routes.categories;

const categoryData = {
  name: 'ElectronicsUSERRole',
  photos: [photos.formats.jpeg, photos.formats.png],
  active: true,
};

params.forEach(param => {
  describe('Negative: Category creation permissions', () => {
    before(async () => {
      // clear DB
      await Category.deleteMany();
      await User.deleteMany();

      // login user with role param.role and get jwt token
      authToken = await testHelpers.authorization.login(param.role);
    });

    after(async () => {
      await User.deleteMany();
    });

    it(`should return ${param.responseCode} when creating category with ${
      param.role
    } role`, async () => {
      await api
        .post(categoriesRoute)
        .set({ Authorization: authToken })
        .send(categoryData)
        .expect(param.responseCode);

      // check there is no category created in DB
      const categoriesInDB = await Category.find({
        name: categoryData.name,
      });
      expect(categoriesInDB.length).to.equal(0);
    });
  });
});
