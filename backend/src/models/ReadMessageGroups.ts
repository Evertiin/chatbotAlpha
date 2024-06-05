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
import InternalMessage from "./InternalMessage";
import UsersGroups from "./UsersGroups";

@Table({ freezeTableName: true })
class ReadMessageGroups extends Model<ReadMessageGroups> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => InternalMessage)
    @Column
    internalMessageId: number;

    @BelongsTo(() => InternalMessage)
    internalMessage: InternalMessage;

    @ForeignKey(() => UsersGroups)
    @Column
    userGroupId: number;

    @BelongsTo(() => UsersGroups)
    userGroup: UsersGroups;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    tableName: "ReadMessageGroups";
}

export default ReadMessageGroups;
