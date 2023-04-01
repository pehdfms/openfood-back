import { Migration } from '@mikro-orm/migrations'

export class Migration20230401011859 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "product" alter column "purchase_places" type varchar(2048) using ("purchase_places"::varchar(2048));'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product" alter column "purchase_places" type varchar(255) using ("purchase_places"::varchar(255));'
    )
  }
}
