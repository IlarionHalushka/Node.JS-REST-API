const BasicResource = {
  getUniqueEmail() {
    return `${Math.random()
      .toString(36)
      .substr(2, 9)}@codemotion.eu`;
  },

  getUniqueString() {
    return Math.random()
      .toString(36)
      .substr(2, 9);
  },

  formatDateToString(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },
};

module.exports = BasicResource;
