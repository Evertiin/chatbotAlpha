import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AutoIncrement
} from "sequelize-typescript";
import User from "./User";
import Group from "./Group";

@Table({ freezeTableName: true })
class UsersGroups extends Model<UsersGroups> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Group)
  @Column
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  tableName: "UsersGroups";
}

export default UsersGroups;
