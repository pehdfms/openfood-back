import { Migration } from '@mikro-orm/migrations';

export class Migration20230401005719 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product" alter column "url" type varchar(255) using ("url"::varchar(255));');
    this.addSql('alter table "product" alter column "creator" type varchar(255) using ("creator"::varchar(255));');
    this.addSql('alter table "product" alter column "product_name" type varchar(255) using ("product_name"::varchar(255));');
    this.addSql('alter table "product" alter column "quantity" type varchar(255) using ("quantity"::varchar(255));');
    this.addSql('alter table "product" alter column "categories" type varchar(255) using ("categories"::varchar(255));');
    this.addSql('alter table "product" alter column "labels" type varchar(255) using ("labels"::varchar(255));');
    this.addSql('alter table "product" alter column "cities" type varchar(255) using ("cities"::varchar(255));');
    this.addSql('alter table "product" alter column "purchase_places" type varchar(255) using ("purchase_places"::varchar(255));');
    this.addSql('alter table "product" alter column "stores" type varchar(255) using ("stores"::varchar(255));');
    this.addSql('alter table "product" alter column "traces" type varchar(255) using ("traces"::varchar(255));');
    this.addSql('alter table "product" alter column "serving_size" type varchar(255) using ("serving_size"::varchar(255));');
    this.addSql('alter table "product" alter column "serving_quantity" type varchar(255) using ("serving_quantity"::varchar(255));');
    this.addSql('alter table "product" alter column "nutriscore_score" type varchar(255) using ("nutriscore_score"::varchar(255));');
    this.addSql('alter table "product" alter column "nutriscore_grade" type varchar(255) using ("nutriscore_grade"::varchar(255));');
    this.addSql('alter table "product" alter column "main_category" type varchar(255) using ("main_category"::varchar(255));');
    this.addSql('alter table "product" alter column "image_url" type varchar(255) using ("image_url"::varchar(255));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" alter column "url" type varchar(251) using ("url"::varchar(251));');
    this.addSql('alter table "product" alter column "creator" type varchar(252) using ("creator"::varchar(252));');
    this.addSql('alter table "product" alter column "product_name" type varchar(253) using ("product_name"::varchar(253));');
    this.addSql('alter table "product" alter column "quantity" type varchar(254) using ("quantity"::varchar(254));');
    this.addSql('alter table "product" alter column "categories" type varchar(256) using ("categories"::varchar(256));');
    this.addSql('alter table "product" alter column "labels" type varchar(257) using ("labels"::varchar(257));');
    this.addSql('alter table "product" alter column "cities" type varchar(258) using ("cities"::varchar(258));');
    this.addSql('alter table "product" alter column "purchase_places" type varchar(259) using ("purchase_places"::varchar(259));');
    this.addSql('alter table "product" alter column "stores" type varchar(260) using ("stores"::varchar(260));');
    this.addSql('alter table "product" alter column "traces" type varchar(261) using ("traces"::varchar(261));');
    this.addSql('alter table "product" alter column "serving_size" type varchar(262) using ("serving_size"::varchar(262));');
    this.addSql('alter table "product" alter column "serving_quantity" type varchar(263) using ("serving_quantity"::varchar(263));');
    this.addSql('alter table "product" alter column "nutriscore_score" type varchar(264) using ("nutriscore_score"::varchar(264));');
    this.addSql('alter table "product" alter column "nutriscore_grade" type varchar(265) using ("nutriscore_grade"::varchar(265));');
    this.addSql('alter table "product" alter column "main_category" type varchar(266) using ("main_category"::varchar(266));');
    this.addSql('alter table "product" alter column "image_url" type varchar(267) using ("image_url"::varchar(267));');
  }

}
