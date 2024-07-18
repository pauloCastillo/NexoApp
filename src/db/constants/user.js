const bcrypt = require("bcrypt");

export default class User {
  #password = "";
  saltRounds = 12;

  constructor(username, email, password, phone) {
    this.username = username;
    this.email = email;
    this.#password = password;
    this.phone = phone;
  }

  #encrypt(password) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) throw new Error(err.message);
      bcrypt.hash(password, salt, (err, hashedPsswd) => {
        if (err) throw new Error(err.message);
        console.log(hashedPsswd);
        return hashedPsswd;
      });
    });
  }

  set cipher(userPassword) {
    this.#encrypt(userPassword);
  }
  get cipher() {
    return "cifrado exitosamente";
  }
}
