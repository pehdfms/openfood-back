import { EntityRepository } from '@mikro-orm/core'
import { Product } from '@modules/product/entities/product.entity'

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>
}

export const repositoryMockFactory: () => MockType<EntityRepository<Product>> = jest.fn(() => ({
  findAll: jest.fn((entities: Product[]) => [entities, entities.length])
}))

export const mockProducts: Product[] = []
