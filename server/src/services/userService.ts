class UserService {
  protected newUser: Record<string, any>;
  protected _context?: import('@/types/models.js').TenantContext;

  constructor(user: Record<string, any>, context?: import('@/types/models.js').TenantContext) {
    this.newUser = user;
    this._context = context;
  }

  validateUser(): boolean {
    if (this.newUser.confirmPassword !== this.newUser.password) {
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