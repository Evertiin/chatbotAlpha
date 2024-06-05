import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    CreatedAt,
    UpdatedAt,
    ForeignKey,
    BelongsTo
  } from "sequelize-typescript";
  import Tenant from "./Tenant";
  import User from "./User";
  import Whatsapp from "./Whatsapp"; // Importe o modelo Whatsapp
  
  @Table({
    tableName: 'MessageTemplate', // Define o nome da tabela como "MessageTemplate"
  })
  class MessageTemplate extends Model<MessageTemplate> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;
  
    @Column
    trans_status_code: number;
  
    @Column
    message: string;
  
    @CreatedAt
    createdAt: Date;
  
    @UpdatedAt
    updatedAt: Date;
  
    @ForeignKey(() => User)
    @Column
    userId: number;
  
    @BelongsTo(() => User)
    user: User;
  
    @ForeignKey(() => Tenant)
    @Column
    tenantId: number;
  
    @BelongsTo(() => Tenant)
    tenant: Tenant;
  
    @ForeignKey(() => Whatsapp) // Vincule a coluna whatsappId ao modelo Whatsapp
    @Column
    whatsappId: number;
  
    @BelongsTo(() => Whatsapp)
    whatsapp: Whatsapp;
  }
  
  export default MessageTemplate;
  