import { Migration } from '@mikro-orm/migrations';

export class Migration20230401163737 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product" alter column "brands" type varchar(2048) using ("brands"::varchar(2048));');
    this.addSql('alter table "product" alter column "labels" type varchar(2048) using ("labels"::varchar(2048));');
    this.addSql('alter table "product" alter column "cities" type varchar(4096) using ("cities"::varchar(4096));');
    this.addSql('alter table "product" alter column "stores" type varchar(4096) using ("stores"::varchar(4096));');
    this.addSql('alter table "product" alter column "image_url" type varchar(512) using ("image_url"::varchar(512));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" alter column "brands" type varchar(255) using ("brands"::varchar(255));');
    this.addSql('alter table "product" alter column "labels" type varchar(255) using ("labels"::varchar(255));');
    this.addSql('alter table "product" alter column "cities" type varchar(255) using ("cities"::varchar(255));');
    this.addSql('alter table "product" alter column "stores" type varchar(255) using ("stores"::varchar(255));');
    this.addSql('alter table "product" alter column "image_url" type varchar(255) using ("image_url"::varchar(255));');
  }

}
