const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const UserDAO = require('../../../../src/daos/userDAO');
const DatabaseHelper = require('../../../../src/helpers/databaseHelper');
const queries = require('../../../../src/queries/user.json');

describe('UserDAO', () => {
  const databaseHelper = new DatabaseHelper();

  const userDAO = new UserDAO({
    databaseHelper: databaseHelper,
    queries,
  });

  let date;

  beforeEach(() => {
    executeStub = sinon.stub(databaseHelper, 'execute');
    date = new Date();
  });

  afterEach(() => {
    executeStub.restore();
  });


  describe('create', () => {
    it('Should return a message error when occurred an error on insert',
        async () => {
          executeStub
              .withArgs(
                  queries.insert,
                  ['test', 'test@email.com', 'password', true, date],
              )
              .throws({ error: 'An error occurred' });

          try {
            await userDAO.create({
              nickname: 'test',
              email: 'test@email.com',
              password: 'password',
              createdDate: date,
            });
            expect(0).equal(1);
          } catch (error) {
            expect(error).to.be.eql({ error: 'An error occurred' });
            expect(executeStub.callCount).to.be.equal(1);
          }
        });

    it('Should return a message success when user is inserted with success',
        async () => {
          executeStub
              .withArgs(
                  queries.insert,
                  ['test', 'test@email.com', 'password', true, date],
              )
              .returns({
                insertId: 1,
              });

          const message = await userDAO.create({
            nickname: 'test',
            email: 'test@email.com',
            password: 'password',
            createdDate: date,
          });

          expect(message).to.be.eqls({ insertId: 1 });
          expect(executeStub.callCount).to.be.equal(1);
        });
  });
});
