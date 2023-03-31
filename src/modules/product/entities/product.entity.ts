import { Entity, PrimaryKey } from '@mikro-orm/core'

@Entity()
export class Product {
  @PrimaryKey() code: string
}
