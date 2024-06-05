import { Model, Table, PrimaryKey, AutoIncrement, Column, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, DataType, AllowNull } from 'sequelize-typescript';
import User from './User';
import Tenant from './Tenant';
import Group from './Group';

@Table({ tableName: 'InternalMessage' }) // Ajuste o nome da tabela
class InternalMessage extends Model<InternalMessage> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    text: string;

    @Column
    timestamp: number;

    @Column
    read: Boolean;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @ForeignKey(() => User)
    @Column
    senderId: number;

    @BelongsTo(() => User)
    sender: User;

    @ForeignKey(() => User)
    @AllowNull(true)
    @Column
    receiverId: number;

    @BelongsTo(() => User)
    receiver: User;

    @ForeignKey(() => Group)
    @AllowNull(true)
    @Column
    groupId: number;

    @BelongsTo(() => Group)
    group: Group


    @Column(DataType.VIRTUAL)
    get mediaName(): string | null {
        return this.getDataValue("mediaUrl");
    }

    @Column(DataType.STRING)
    get mediaUrl(): string | null {
        if (this.getDataValue("mediaUrl")) {
            const { BACKEND_URL } = process.env;
            const value = this.getDataValue("mediaUrl");
            return `${BACKEND_URL}:${process.env.PROXY_PORT}/public/${value}`;
        }
        return null;
    }

    @Column
    mediaType: string;

    @ForeignKey(() => Tenant)
    @Column
    tenantId: number;

    @BelongsTo(() => Tenant)
    tenant: Tenant;
}

export default InternalMessage;
