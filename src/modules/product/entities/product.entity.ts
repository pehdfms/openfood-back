import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core'
import { Expose } from 'class-transformer'

export enum ProductStatus {
  Draft = 'draft',
  Trash = 'trash',
  Published = 'published'
}

@Entity()
export class Product {
  // Product JSON has this as a number, but EAN-13 barcodes may start with 0
  @Expose()
  @PrimaryKey()
  code: string

  @Expose()
  @Enum(() => ProductStatus)
  status: ProductStatus

  @Expose()
  @Property()
  created_t: number

  @Expose()
  @Property()
  last_modified_t: number

  @Expose()
  @Property()
  imported_t: Date = new Date()

  @Expose()
  @Property({ length: 1024 })
  url: string

  @Expose()
  @Property()
  creator: string

  @Expose()
  @Property()
  product_name: string

  @Expose()
  @Property()
  quantity: string

  @Expose()
  @Property({ length: 2048 })
  brands: string

  @Expose()
  @Property({ length: 1024 })
  categories: string

  @Expose()
  @Property({ length: 2048 })
  labels: string

  @Expose()
  @Property({ length: 4096 })
  cities: string

  @Expose()
  @Property({ length: 8192 })
  purchase_places: string

  @Expose()
  @Property({ length: 4096 })
  stores: string

  @Expose()
  @Property({ length: 8192 })
  ingredients_text: string

  @Expose()
  @Property({ length: 2048 })
  traces: string

  @Expose()
  @Property()
  serving_size: string

  // These following two properties are supposed to be numbers, but
  // are very often empty in the input
  // I could maybe justify serving_quantity defaulting to zero, but I
  // can't say the same for nutriscore_score
  @Expose()
  @Property()
  serving_quantity: string

  @Expose()
  @Property()
  nutriscore_score: string

  @Expose()
  @Property()
  nutriscore_grade: string

  @Expose()
  @Property()
  main_category: string

  @Expose()
  @Property({ length: 512 })
  image_url: string
}
