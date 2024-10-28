import { db } from '../db';
import { products } from '../models/schema';
import { faker } from '@faker-js/faker';

async function seed() {
  try {
    // Clear existing data
    await db.delete(products);
    console.log('Existing data cleared.');

    const productCount = 10;
    const initialProducts = [];

    for (let i = 0; i < productCount; i++) {
      initialProducts.push({
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        inventoryCount: faker.number.int({ min: 1, max: 10 }),
      });
    }

    await db.insert(products).values(initialProducts);

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
