import { Migration } from '@mikro-orm/migrations'

export class Migration20230401012429 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "product" alter column "traces" type varchar(2048) using ("traces"::varchar(2048));'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product" alter column "traces" type varchar(262) using ("traces"::varchar(262));'
    )
  }
}
