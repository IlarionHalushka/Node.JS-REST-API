import { User, Category } from '../../../../../server/models';
import photos from '../../../../common/data/photos';

let authToken;
const categoriesRoute = routes.categories;
let categoryIdToUpdate;
let currentSessionUserId;

const categoryDataOnePhotoActive = {
  name: 'Electronics',
  photos: [photos.formats.png],
  active: true,
};
const responseMessage = 'Category has been updated.';

const params = [
  {
    description: 'with 2 photos, name, active',
    responseMsg: responseMessage,
    categoryDataToEdit: {
      name: 'somenameTwoPics',
      photos: [photos.formats.jpeg, photos.formats.png],
      active: false,
    },
  },
  {
    description: 'with 1 photos, empty name, active',
    responseMsg: responseMessage,
    categoryDataToEdit: {
      name: '',
      photos: [photos.formats.jpeg],
      active: true,
    },
  },
  {
    description: 'with 0 photos, name, active',
    responseMsg: responseMessage,
    categoryDataToEdit: {
      name: 'somenameZeroPics',
      photos: [],
      active: false,
    },
  },
  {
    description: 'with 1 photos, name, no field active',
    responseMsg: responseMessage,
    categoryDataToEdit: {
      name: 'chanedgname',
      photos: [photos.formats.jpeg],
    },
  },
  {
    description: 'with 1 photos, active, no field name',
    responseMsg: responseMessage,
    categoryDataToEdit: {
      photos: [photos.formats.jpeg],
      active: true,
    },
  },
  {
    description: 'active, name, no field photos',
    responseMsg: responseMessage,
    categoryDataToEdit: {
      name: 'newNamechanged',
      active: true,
    },
  },
];

describe('Smoke: Category editing', () => {
  before(async () => {
    // clear DB
    await Category.deleteMany({});
    await User.deleteMany({});

    // login user with role ADMIN and get jwt token
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
    categoryIdToUpdate = await Category(
      categoryDataOnePhotoActiveWithCreatedByUpdatedBy,
    )
      .save()
      .then(data => data._id);
  });

  afterEach(async () => {
    await Category.deleteMany({});
  });

  after(async () => {
    await User.deleteMany({});
  });

  params.forEach(param => {
    it(`should return 200 when updating category ${
      param.description
    }`, async () => {
      const res = await api
        .patch(`${categoriesRoute}/${categoryIdToUpdate}`)
        .set({ Authorization: authToken })
        .send(param.categoryDataToEdit)
        .expect(200);

      // check response message from server
      expect(res.body.message).to.equal(param.responseMsg);

      // if field 'active', 'photos', 'name' is undefined in param.categoryDataToEdit
      // then the field should not be changed in DB so assign initial value to it
      if (param.categoryDataToEdit.photos === undefined) {
        param.categoryDataToEdit.photos = categoryDataOnePhotoActive.photos;
      }
      if (param.categoryDataToEdit.active === undefined) {
        param.categoryDataToEdit.active = categoryDataOnePhotoActive.active;
      }
      if (
        param.categoryDataToEdit.name === undefined ||
        param.categoryDataToEdit.name === ''
      ) {
        param.categoryDataToEdit.name = categoryDataOnePhotoActive.name;
      }

      // check that data in DB was edited
      const editedCategoryInDB = await Category.find({
        _id: categoryIdToUpdate,
      });

      expect(editedCategoryInDB.length).to.equal(1);

      expect(editedCategoryInDB[0].photos).to.deep.equal(
        param.categoryDataToEdit.photos,
      );
      expect(editedCategoryInDB[0].active).to.equal(
        param.categoryDataToEdit.active,
      );
      expect(editedCategoryInDB[0].name).to.equal(
        param.categoryDataToEdit.name,
      );
    });
  });
});
