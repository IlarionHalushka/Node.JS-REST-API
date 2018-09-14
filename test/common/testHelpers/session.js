let userSession;

const Session = {
  getCurrentUser() {
    return userSession;
  },
  setCurrentUser(user) {
    userSession = user;
  },
  resetCurrentUser() {
    userSession = undefined;
  },
};

module.exports = Session;
