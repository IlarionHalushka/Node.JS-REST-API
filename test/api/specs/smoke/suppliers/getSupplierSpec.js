import { User, Supplier } from '../../../../../server/models';
import photos from '../../../../common/data/photos';

let authToken;
let currentSessionUserId;
const suppliersRoute = routes.suppliers;

const supplierData = {
  name: 'Baruga Tu',
  description: 'Bazar #8',
  photos: [photos.formats.jpeg, photos.formats.png],
};

describe(`Smoke: Supplier fetching ADMIN role`, () => {
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
    // create two supliers in db
    await Supplier(supplierDataWithCreatedByUpdatedBy).save();
    await Supplier(supplierDataWithCreatedByUpdatedBy).save();
  });

  afterEach(async () => {
    await Supplier.deleteMany();
  });

  after(async () => {
    await User.deleteMany();
  });

  it('should return 200 when fetching suppliers', async () => {
    const res = await api
      .get(suppliersRoute)
      .set({ Authorization: authToken })
      .expect(200);

    expect(res.body.data.length).to.equal(2);

    res.body.data.forEach(data => {
      expect(data.name).to.equal(supplierData.name);
      expect(data.photos).to.deep.equal(supplierData.photos);
      expect(data.description).to.equal(supplierData.description);
      expect(data.createdBy).to.equal(`${currentSessionUserId._id}`);
      expect(data.updatedBy).to.equal(`${currentSessionUserId._id}`);
      expect(new Date(data.updatedAt)).to.not.deep.equal(new Date('Invalid Date'));
      expect(new Date(data.createdAt)).to.not.deep.equal(new Date('Invalid Date'));
    });
  });
});
