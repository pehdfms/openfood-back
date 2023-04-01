import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core'

export enum ProductStatus {
  Draft = 'draft',
  Trash = 'trash',
  Published = 'published'
}

@Entity()
export class Product {
  // Product JSON has this as a number, but EAN-13 barcodes may start with 0
  @PrimaryKey() code: string

  @Enum(() => ProductStatus)
  status: ProductStatus

  @Property()
  created_t: number

  @Property()
  last_modified_t: number

  @Property()
  imported_t: Date = new Date()

  @Property({ length: 1024 })
  url: string

  @Property()
  creator: string

  @Property()
  product_name: string

  @Property()
  quantity: string

  @Property({ length: 2048 })
  brands: string

  @Property({ length: 1024 })
  categories: string

  @Property({ length: 2048 })
  labels: string

  @Property({ length: 4096 })
  cities: string

  @Property({ length: 8192 })
  purchase_places: string

  @Property({ length: 4096 })
  stores: string

  @Property({ length: 8192 })
  ingredients_text: string

  @Property({ length: 2048 })
  traces: string

  @Property()
  serving_size: string

  // These following two properties are supposed to be numbers, but
  // are very often empty in the input
  // I could maybe justify serving_quantity defaulting to zero, but I
  // can't say the same for nutriscore_score
  @Property()
  serving_quantity: string

  @Property()
  nutriscore_score: string

  @Property()
  nutriscore_grade: string

  @Property()
  main_category: string

  @Property({ length: 512 })
  image_url: string
}
