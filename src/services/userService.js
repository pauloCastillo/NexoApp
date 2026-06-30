  class UserService {
    constructor(user) {
      this.newUser = user;
    }

    validateUser() {
      if (this.newUser.confirmPassword.toLowerCase() !== this.newUser.password.toLowerCase()) {
        throw new Error(
          "Por favor, revisa que las contraseñas sean escritas iguales"
        );
      }

      if(!this.newUser || Object.keys(this.newUser).length === 0) {
        throw new Error("No se han recibido datos del usuario");
      }
      return true;
    }

  }

export default UserService;