import { Migration } from '@mikro-orm/migrations'

export class Migration20230401004749 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "product" alter column "ingredients_text" type varchar(2048) using ("ingredients_text"::varchar(2048));'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product" alter column "ingredients_text" type varchar(255) using ("ingredients_text"::varchar(255));'
    )
  }
}
