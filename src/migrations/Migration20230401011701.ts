import { Migration } from '@mikro-orm/migrations'

export class Migration20230401011701 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "product" alter column "url" type varchar(1024) using ("url"::varchar(1024));'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product" alter column "url" type varchar(255) using ("url"::varchar(255));'
    )
  }
}
