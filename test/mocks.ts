import { EntityRepository } from '@mikro-orm/core'
import { Product, ProductStatus } from '@modules/product/entities/product.entity'
import { faker } from '@faker-js/faker'

export type Mock<T> = {
  [P in keyof T]?: jest.Mock
}

export const repositoryMockFactory: () => Mock<EntityRepository<Product>> = jest.fn(() => ({
  create: jest.fn().mockImplementation((product) => product),
  assign: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  persistAndFlush: jest.fn()
}))

function generateMockProduct(): Product {
  const created_t = faker.date.recent(30)
  const imported_t = faker.date.between(created_t, new Date())
  const last_modified_t =
    faker.helpers.maybe(() => created_t, { probability: 0.9 }) ||
    faker.date.between(created_t, imported_t)

  function stringListFrom<T>(fn: () => T): string {
    return Array.from({ length: faker.datatype.number({ min: 2, max: 14 }) }, fn).join(', ')
  }

  return {
    code: faker.random
      .numeric(faker.datatype.number({ min: 8, max: 14 }), { allowLeadingZeros: true })
      .toString(),
    status: ProductStatus[faker.helpers.arrayElement(Object.keys(ProductStatus))],
    imported_t,
    url: faker.internet.url(),
    creator: faker.company.name(),
    created_t: created_t.getTime(),
    last_modified_t: last_modified_t.getTime(),
    product_name: faker.commerce.product(),
    quantity: faker.datatype.number({ min: 50, max: 10000 }) + ' g',
    brands: faker.company.name(),
    categories: stringListFrom(faker.commerce.productAdjective),
    labels: stringListFrom(faker.commerce.productMaterial),
    cities: stringListFrom(faker.address.city),
    purchase_places: stringListFrom(faker.address.city),
    stores: stringListFrom(faker.company.name),
    ingredients_text: stringListFrom(faker.commerce.productMaterial),
    traces: stringListFrom(faker.commerce.productMaterial),
    serving_size: faker.datatype.number({ min: 50, max: 5000 }) + ' g',
    serving_quantity: faker.datatype.number({ min: 50, max: 5000 }).toString(),
    nutriscore_score: faker.datatype.number({ min: 0, max: 100 }).toString(),
    nutriscore_grade: faker.helpers.arrayElement(['a', 'b', 'c', 'd', 'e']),
    main_category: faker.commerce.productAdjective(),
    image_url: faker.internet.url()
  }
}

export function generateMockProducts(count: number = 1): Product[] {
  return Array.from({ length: count }, generateMockProduct)
}
