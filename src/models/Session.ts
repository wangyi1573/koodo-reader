import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Session extends Model {
  public id!: string;
  public userId!: number;
  public token!: string;
  public expiresAt!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Session.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'session',
    timestamps: true,
    indexes: [
      {
        fields: ['token'],
        unique: true,
      },
      {
        fields: ['userId'],
      },
    ],
  }
);

Session.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Session, { foreignKey: 'userId' });

export default Session;