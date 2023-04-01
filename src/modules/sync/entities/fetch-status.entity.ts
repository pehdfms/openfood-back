import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class FetchStatus {
  @PrimaryKey() filename: string
  @Property() cursor: number
  @Property() done: boolean
  @Property() downloaded: boolean
}
