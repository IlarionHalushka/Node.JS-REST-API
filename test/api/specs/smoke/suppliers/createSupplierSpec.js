import { User, Supplier } from '../../../../../server/models';
import photos from '../../../../common/data/photos';

let authToken;
let currentSessionUserId;
const suppliersRoute = routes.suppliers;

const supplierData = {
  name: 'Baruga',
  description: 'Bazar #6',
  photos: [photos.formats.jpeg, photos.formats.png],
  // createdBy updatedBy createrAt updatedAt
};

const params = [
  {
    description: 'with 2 photos',
    supplierData: {
      ...supplierData,
    },
    responseMessage: `Supplier_${constants.MESSAGES.CREATED}`,
  },
  {
    description: 'with 1 photo',
    supplierData: {
      ...supplierData,
      photos: [supplierData.photos[0]],
    },
    responseMessage: `Supplier_${constants.MESSAGES.CREATED}`,
  },
  {
    description: 'with 0 photos',
    supplierData: {
      ...supplierData,
      photos: [],
    },
    responseMessage: `Supplier_${constants.MESSAGES.CREATED}`,
  },
  {
    description: 'with empty description',
    supplierData: {
      ...supplierData,
      description: '',
    },
    responseMessage: `Supplier_${constants.MESSAGES.CREATED}`,
  },
];

describe('Smoke: Supplier creation', () => {
  before(async () => {
    // clear DB
    await Supplier.deleteMany();
    await User.deleteMany();

    // login user with role ADMIN and get jwt token
    authToken = await testHelpers.authorization.login('ADMIN');
    currentSessionUserId = testHelpers.session.getCurrentUser()._id;
  });

  afterEach(async () => {
    await Supplier.deleteMany();
  });

  after(async () => {
    await User.deleteMany();
  });

  params.forEach(param => {
    it(`should return 201 when creating supplier ${param.description}`, async () => {
      const res = await api
        .post(suppliersRoute)
        .set({ Authorization: authToken })
        .send(param.supplierData)
        .expect(201);

      // check response from server
      expect(res.body.message).to.equal(param.responseMessage);

      // check data in DB
      const suppliersInDB = await Supplier.find({
        name: param.supplierData.name,
      });
      expect(suppliersInDB.length).to.equal(1);
      expect(suppliersInDB[0].photos).to.deep.equal(param.supplierData.photos);
      expect(suppliersInDB[0].description).to.deep.equal(param.supplierData.description);
      expect(suppliersInDB[0].createdBy).to.deep.equal(currentSessionUserId);
      expect(suppliersInDB[0].updatedBy).to.deep.equal(currentSessionUserId);
      expect(suppliersInDB[0].createdAt).to.be.a('date');
      expect(suppliersInDB[0].updatedAt).to.be.a('date');
    });
  });

  it(`should return 409 when creating supplier with already existing name`, async () => {
    // set createdBy updatedBy with userId
    const supplierDataWithCreatedByUpdatedBy = {
      ...supplierData,
      createdBy: currentSessionUserId,
      updatedBy: currentSessionUserId,
    };

    await Supplier.create(supplierDataWithCreatedByUpdatedBy);

    const res = await api
      .post(suppliersRoute)
      .set({ Authorization: authToken })
      .send(supplierData)
      .expect(409);

    // check response from server
    expect(res.body.message).to.equal('Supplier_ALREADY_EXISTS');

    // check data in DB
    const suppliersInDB = await Supplier.find({
      name: supplierData.name,
    });
    expect(suppliersInDB.length).to.equal(1);
    expect(suppliersInDB[0].photos).to.deep.equal(supplierData.photos);
    expect(suppliersInDB[0].description).to.equal(supplierData.description);
    expect(suppliersInDB[0].createdBy).to.deep.equal(currentSessionUserId);
    expect(suppliersInDB[0].updatedBy).to.deep.equal(currentSessionUserId);
    expect(suppliersInDB[0].createdAt).to.be.a('date');
    expect(suppliersInDB[0].updatedAt).to.be.a('date');
  });
});
