let currentUser;

const Session = {
  setCurrentUser(user) {
    currentUser = user;
  },

  getCurrentUser() {
    return currentUser;
  },
  // reset() { currentUser = undefined; }
};

module.exports = Session;
