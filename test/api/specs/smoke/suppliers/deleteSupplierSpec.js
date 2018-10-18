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

describe('Smoke: Supplier deleting', () => {
  before(async () => {
    // clear DB
    await Supplier.deleteMany();
    await User.deleteMany();
    // login user with role param.role and get jwt token
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

  it('should return 200 when deleting suppliers with ADMIN role', async () => {
    const suppliersInDBBeforeDeleting = await Supplier.find({});
    const supplierIdToDelete = suppliersInDBBeforeDeleting[0]._id;

    await api
      .delete(`${suppliersRoute}/${supplierIdToDelete}`)
      .set({ Authorization: authToken })
      .expect(200);

    // check in DB that supplier with id supplierIdToDelete is deleted
    const suppliersInDBAfterDeleting = await Supplier.findById(
      supplierIdToDelete,
    );
    expect(suppliersInDBAfterDeleting).to.be.a('null');
  });
});
