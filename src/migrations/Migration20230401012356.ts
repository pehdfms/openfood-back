import { Migration } from '@mikro-orm/migrations'

export class Migration20230401012356 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "product" alter column "creator" type varchar(254) using ("creator"::varchar(254));'
    )
    this.addSql(
      'alter table "product" alter column "product_name" type varchar(256) using ("product_name"::varchar(256));'
    )
    this.addSql(
      'alter table "product" alter column "quantity" type varchar(257) using ("quantity"::varchar(257));'
    )
    this.addSql(
      'alter table "product" alter column "brands" type varchar(258) using ("brands"::varchar(258));'
    )
    this.addSql(
      'alter table "product" alter column "labels" type varchar(259) using ("labels"::varchar(259));'
    )
    this.addSql(
      'alter table "product" alter column "cities" type varchar(260) using ("cities"::varchar(260));'
    )
    this.addSql(
      'alter table "product" alter column "stores" type varchar(261) using ("stores"::varchar(261));'
    )
    this.addSql(
      'alter table "product" alter column "traces" type varchar(262) using ("traces"::varchar(262));'
    )
    this.addSql(
      'alter table "product" alter column "serving_size" type varchar(263) using ("serving_size"::varchar(263));'
    )
    this.addSql(
      'alter table "product" alter column "serving_quantity" type varchar(264) using ("serving_quantity"::varchar(264));'
    )
    this.addSql(
      'alter table "product" alter column "nutriscore_score" type varchar(265) using ("nutriscore_score"::varchar(265));'
    )
    this.addSql(
      'alter table "product" alter column "nutriscore_grade" type varchar(266) using ("nutriscore_grade"::varchar(266));'
    )
    this.addSql(
      'alter table "product" alter column "main_category" type varchar(267) using ("main_category"::varchar(267));'
    )
    this.addSql(
      'alter table "product" alter column "image_url" type varchar(268) using ("image_url"::varchar(268));'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product" alter column "creator" type varchar(255) using ("creator"::varchar(255));'
    )
    this.addSql(
      'alter table "product" alter column "product_name" type varchar(255) using ("product_name"::varchar(255));'
    )
    this.addSql(
      'alter table "product" alter column "quantity" type varchar(255) using ("quantity"::varchar(255));'
    )
    this.addSql(
      'alter table "product" alter column "brands" type varchar(255) using ("brands"::varchar(255));'
    )
    this.addSql(
      'alter table "product" alter column "labels" type varchar(255) using ("labels"::varchar(255));'
    )
    this.addSql(
      'alter table "product" alter column "cities" type varchar(255) using ("cities"::varchar(255));'
    )
    this.addSql(
      'alter table "product" alter column "stores" type varchar(255) using ("stores"::varchar(255));'
    )
    this.addSql(
      'alter table "product" alter column "traces" type varchar(255) using ("traces"::varchar(255));'
    )
    this.addSql(
      'alter table "product" alter column "serving_size" type varchar(255) using ("serving_size"::varchar(255));'
    )
    this.addSql(
      'alter table "product" alter column "serving_quantity" type varchar(255) using ("serving_quantity"::varchar(255));'
    )
    this.addSql(
      'alter table "product" alter column "nutriscore_score" type varchar(255) using ("nutriscore_score"::varchar(255));'
    )
    this.addSql(
      'alter table "product" alter column "nutriscore_grade" type varchar(255) using ("nutriscore_grade"::varchar(255));'
    )
    this.addSql(
      'alter table "product" alter column "main_category" type varchar(255) using ("main_category"::varchar(255));'
    )
    this.addSql(
      'alter table "product" alter column "image_url" type varchar(255) using ("image_url"::varchar(255));'
    )
  }
}
