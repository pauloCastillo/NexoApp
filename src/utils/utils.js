const bcrypt = require("bcrypt");

const saltRounds = 12;

const encrypt = (password) => {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) throw new Error(err.message);
    bcrypt.hash(password, salt, (err, hashedPsswd) => {
      if (err) throw new Error(err.message);
      return hashedPsswd;
    });
  });
};

// const chckingPsswd = (  )
