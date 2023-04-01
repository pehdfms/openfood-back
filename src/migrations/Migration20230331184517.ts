import { Migration } from '@mikro-orm/migrations'

export class Migration20230331184517 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "fetch_status" ("filename" varchar(255) not null, "done" boolean not null, "cursor" int not null, constraint "fetch_status_pkey" primary key ("filename"));'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "fetch_status" cascade;')
  }
}
