import { Migration } from '@mikro-orm/migrations'

export class Migration20230401000754 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "fetch_status" add column "downloaded" boolean not null;')
  }

  async down(): Promise<void> {
    this.addSql('alter table "fetch_status" drop column "downloaded";')
  }
}
