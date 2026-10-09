import { UserService } from './user.service'

export class ServiceProvider {
  private static userService?: UserService

  static get users(): UserService {
    // Якщо сервіс ще не створено (??=), створюємо його. Якщо створено — просто віддаємо.
    this.userService ??= new UserService()
    return this.userService
  }
}
