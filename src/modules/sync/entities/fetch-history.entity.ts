import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class FetchHistory {
  @PrimaryKey() id: number
  @Property() run_t: Date = new Date()
  @Property() fetch_count: number
}
