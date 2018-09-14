import { User, Supplier } from '../../../../../models';
import photos from '../../../../common/data/photos';

let authToken;
let currentSessionUserId;
let supplierIdToUpdate;
const suppliersRoute = routes.suppliers;

const supplierData = {
  name: 'Baruga Tu',
  description: 'Bazar #8',
  photos: [photos.formats.jpeg, photos.formats.png],
};
const responseMessage = 'Supplier has been updated.';

const params = [
  {
    description: 'with 2 photos, name, description',
    responseMsg: responseMessage,
    supplierDataToEdit: {
      name: 'somenameTwoPics',
      photos: [photos.formats.jpeg, photos.formats.png],
      description: 'baruga bazar tyt',
    },
  },
  {
    description: 'with 1 photos, empty name, description',
    responseMsg: responseMessage,
    supplierDataToEdit: {
      name: '',
      photos: [photos.formats.jpeg],
      description: 'baruga bazar tyt',
    },
  },
  {
    description: 'with 1 photos, name, empty description',
    responseMsg: responseMessage,
    supplierDataToEdit: {
      name: 'Baruga11',
      photos: [photos.formats.jpeg],
      description: '',
    },
  },
  {
    description: 'with 0 photos, name, description',
    responseMsg: responseMessage,
    supplierDataToEdit: {
      name: 'somenameZeroPics',
      photos: [],
      description: 'baruga bazar tyt',
    },
  },
  {
    description: 'with 1 photos, name, no field description',
    responseMsg: responseMessage,
    supplierDataToEdit: {
      name: 'chanedgname',
      photos: [photos.formats.jpeg],
    },
  },
  {
    description: 'with 1 photos, description, no field name',
    responseMsg: responseMessage,
    supplierDataToEdit: {
      photos: [photos.formats.jpeg],
      description: 'baruga bazar tyt',
    },
  },
  {
    description: 'description, name, no field photos',
    responseMsg: responseMessage,
    supplierDataToEdit: {
      name: 'newNamechanged',
      description: 'baruga bazar tyt',
    },
  },
];

describe('Smoke: Supplier editing', () => {
  before(async () => {
    // clear DB
    await Supplier.deleteMany();
    await User.deleteMany();

    // login user with role ADMIN and get jwt token
    authToken = await testHelpers.authorization.login('ADMIN');

    currentSessionUserId = testHelpers.session.getCurrentUser()._id;
  });

  beforeEach(async () => {
    // set createdBy updatedBy with userId
    const supplierDataWithCreatedByUpdatedBy = {
      ...supplierData,
      createdBy: currentSessionUserId,
      updatedBy: currentSessionUserId,
    };
    // create one suplier in db
    supplierIdToUpdate = await Supplier(supplierDataWithCreatedByUpdatedBy)
      .save()
      .then(data => data._id);
  });

  afterEach(async () => {
    await Supplier.deleteMany();
  });

  after(async () => {
    await User.deleteMany();
  });

  params.forEach(param => {
    it(`should return 200 when updating supplier ${
      param.description
    }`, async () => {
      const res = await api
        .patch(`${suppliersRoute}/${supplierIdToUpdate}`)
        .set({ Authorization: authToken })
        .send(param.supplierDataToEdit)
        .expect(200);

      // check response message from server
      expect(res.body.message).to.equal(param.responseMsg);

      // if field 'description', 'photos', 'name' is undefined in param.supplierDataToEdit
      // then the field should not be changed in DB so assign initial value to it
      if (param.supplierDataToEdit.photos === undefined) {
        param.supplierDataToEdit.photos = supplierData.photos;
      }
      if (param.supplierDataToEdit.description === undefined) {
        param.supplierDataToEdit.description = supplierData.description;
      }
      if (
        param.supplierDataToEdit.name === undefined ||
        param.supplierDataToEdit.name === ''
      ) {
        param.supplierDataToEdit.name = supplierData.name;
      }

      // check that data in DB was edited
      const editedSupplierInDB = await Supplier.find({
        _id: supplierIdToUpdate,
      });

      expect(editedSupplierInDB.length).to.equal(1);

      expect(editedSupplierInDB[0].photos).to.deep.equal(
        param.supplierDataToEdit.photos,
      );
      expect(editedSupplierInDB[0].description).to.equal(
        param.supplierDataToEdit.description,
      );
      expect(editedSupplierInDB[0].name).to.equal(
        param.supplierDataToEdit.name,
      );
      expect(editedSupplierInDB[0].createdBy).to.deep.equal(
        currentSessionUserId,
      );
      expect(editedSupplierInDB[0].updatedBy).to.deep.equal(
        currentSessionUserId,
      );
      expect(editedSupplierInDB[0].createdAt).to.be.a('date');
      expect(editedSupplierInDB[0].updatedAt).to.be.a('date');
    });
  });
});
