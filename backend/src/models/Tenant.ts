import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  DataType,
  Default
} from "sequelize-typescript";
import User from "./User";

@Table
class Tenant extends Model<Tenant> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ defaultValue: "active" })
  status: string;

  @Column
  name: string;

  @Column
  maxUsers: number;

  @Column
  maxConnections: number;

  @Column
  cnpj: string;

  @ForeignKey(() => Tenant)
  @Column
  ownerId: number;

  @BelongsTo(() => Tenant)
  owner: Tenant;

  @Column(DataType.JSONB)
  businessHours: [];

  @Column
  messageBusinessHours: string;

  @Column
  enableIa: Boolean;

  @Column
  apiKey: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Tenant;
