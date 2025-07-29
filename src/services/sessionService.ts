import jwt from 'jsonwebtoken';
import Session from '../models/Session';
import { DatabaseService } from './databaseService';
import { UserRole } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SESSION_EXPIRE_HOURS = 24;

export class SessionService {
  static async createSession(userId: number) {
    const token = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: `${SESSION_EXPIRE_HOURS}h`,
    });

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRE_HOURS);

    return Session.create({
      userId,
      token,
      expiresAt,
    });
  }

  static async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      const session = await Session.findOne({
        where: { token, userId: decoded.userId },
      });

      if (!session || new Date() > session.expiresAt) {
        return null;
      }

      return decoded.userId;
    } catch {
      return null;
    }
  }

  static async checkPermission(token: string, requiredRole: UserRole) {
    const userId = await this.verifyToken(token);
    if (!userId) return false;
    return DatabaseService.checkPermission(userId, requiredRole);
  }

  static async invalidateSession(token: string) {
    return Session.destroy({ where: { token } });
  }

  static async invalidateAllSessions(userId: number) {
    return Session.destroy({ where: { userId } });
  }
}