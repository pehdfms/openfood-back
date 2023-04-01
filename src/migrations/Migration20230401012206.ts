import { Migration } from '@mikro-orm/migrations'

export class Migration20230401012206 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "product" alter column "purchase_places" type varchar(4096) using ("purchase_places"::varchar(4096));'
    )
    this.addSql(
      'alter table "product" alter column "ingredients_text" type varchar(4096) using ("ingredients_text"::varchar(4096));'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product" alter column "purchase_places" type varchar(2048) using ("purchase_places"::varchar(2048));'
    )
    this.addSql(
      'alter table "product" alter column "ingredients_text" type varchar(2048) using ("ingredients_text"::varchar(2048));'
    )
  }
}
