import sequelize from '../config/database';
import User, { UserRole } from '../models/User';

export class DatabaseService {
  static async initialize() {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: true });
      // 创建默认管理员账户
      await this.ensureAdminUser();
      console.log('Database connection established');
    } catch (error) {
      console.error('Database connection error:', error);
    }
  }

  private static async ensureAdminUser() {
    const admin = await User.findOne({ where: { username: 'admin' } });
    if (!admin) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        role: UserRole.ADMIN
      });
    }
  }

  static async createUser(username: string, password: string, role: UserRole = UserRole.USER) {
    return User.create({ username, password, role });
  }

  static async findUser(username: string) {
    return User.findOne({ where: { username } });
  }

  static async updateUser(id: number, data: Partial<User>) {
    return User.update(data, { where: { id } });
  }

  static async verifyUser(username: string, password: string) {
    const user = await this.findUser(username);
    if (!user) return false;
    return user.comparePassword(password);
  }

  static async checkPermission(userId: number, requiredRole: UserRole) {
    const user = await User.findByPk(userId);
    if (!user) return false;
    return user.role === UserRole.ADMIN || user.role === requiredRole;
  }
}