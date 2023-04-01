import { Migration } from '@mikro-orm/migrations'

export class Migration20230401012527 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "product" alter column "purchase_places" type varchar(8192) using ("purchase_places"::varchar(8192));'
    )
    this.addSql(
      'alter table "product" alter column "ingredients_text" type varchar(8192) using ("ingredients_text"::varchar(8192));'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product" alter column "purchase_places" type varchar(4096) using ("purchase_places"::varchar(4096));'
    )
    this.addSql(
      'alter table "product" alter column "ingredients_text" type varchar(4096) using ("ingredients_text"::varchar(4096));'
    )
  }
}
