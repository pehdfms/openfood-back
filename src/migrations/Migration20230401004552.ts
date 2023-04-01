import { Migration } from '@mikro-orm/migrations'

export class Migration20230401004552 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "product" alter column "serving_quantity" type varchar(255) using ("serving_quantity"::varchar(255));'
    )
    this.addSql(
      'alter table "product" alter column "nutriscore_score" type varchar(255) using ("nutriscore_score"::varchar(255));'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product" alter column "serving_quantity" type int using ("serving_quantity"::int);'
    )
    this.addSql(
      'alter table "product" alter column "nutriscore_score" type int using ("nutriscore_score"::int);'
    )
  }
}
