import { Migration } from '@mikro-orm/migrations'

export class Migration20230331040229 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "product" ("code" varchar(255) not null, "status" text check ("status" in (\'draft\', \'trash\', \'published\')) not null, "created_t" int not null, "last_modified_t" int not null, "imported_t" timestamptz(0) not null, "url" varchar(255) not null, "creator" varchar(255) not null, "product_name" varchar(255) not null, "quantity" varchar(255) not null, "brands" varchar(255) not null, "categories" varchar(255) not null, "labels" varchar(255) not null, "cities" varchar(255) not null, "purchase_places" varchar(255) not null, "stores" varchar(255) not null, "ingredients_text" varchar(255) not null, "traces" varchar(255) not null, "serving_size" varchar(255) not null, "serving_quantity" int not null, "nutriscore_score" int not null, "nutriscore_grade" varchar(255) not null, "main_category" varchar(255) not null, "image_url" varchar(255) not null, constraint "product_pkey" primary key ("code"));'
    )
  }
}
