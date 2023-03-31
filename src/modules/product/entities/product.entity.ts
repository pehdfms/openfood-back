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

  @Property()
  url: string

  @Property()
  creator: string

  @Property()
  product_name: string

  @Property()
  quantity: string

  @Property()
  brands: string

  @Property()
  categories: string

  @Property()
  labels: string

  @Property()
  cities: string

  @Property()
  purchase_places: string

  @Property()
  stores: string

  @Property()
  ingredients_text: string

  @Property()
  traces: string

  @Property()
  serving_size: string

  @Property()
  serving_quantity: number

  @Property()
  nutriscore_score: number

  @Property()
  nutriscore_grade: string

  @Property()
  main_category: string

  @Property()
  image_url: string
}
