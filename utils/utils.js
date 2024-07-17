let newUserID = {};
export const setUser = function (user) {
  console.log(user);
  newUserID = user;
};

export const getUser = function () {
  return newUserID;
};
