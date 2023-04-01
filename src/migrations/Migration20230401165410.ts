import { Migration } from '@mikro-orm/migrations';

export class Migration20230401165410 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "fetch_history" ("id" serial primary key, "run_t" timestamptz(0) not null, "fetch_count" int not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "fetch_history" cascade;');
  }

}
