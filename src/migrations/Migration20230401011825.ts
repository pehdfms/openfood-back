import { Migration } from '@mikro-orm/migrations';

export class Migration20230401011825 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product" alter column "categories" type varchar(1024) using ("categories"::varchar(1024));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" alter column "categories" type varchar(255) using ("categories"::varchar(255));');
  }

}
