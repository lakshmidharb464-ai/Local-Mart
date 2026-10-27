import { query } from '../config/db.js';

async function run() {
  await query(`
    INSERT INTO products (id, farmer_id, category_id, name, description, price, unit, stock, is_organic, harvest_tag, harvest_date, rating, reviews_count, flash_discount, is_unavailable, status)
    VALUES ('faa9f05f-9d28-4c53-8465-c82ffd53c748', 'f1', 'Organic Veggies', 'Fresh Farm Organic Tomatoes', 'Vine-ripened red tomatoes grown without synthetic pesticides.', 40.00, 'kg', 100, 1, 'Harvested Fresh Today', 'Today 5:30 AM', 4.90, 48, 0.00, 0, 'Approved')
    ON DUPLICATE KEY UPDATE name=VALUES(name);
  `);

  await query(`
    INSERT INTO product_images (id, product_id, image_url, cloudinary_public_id, is_primary, display_order)
    VALUES ('img-faa9f05f', 'faa9f05f-9d28-4c53-8465-c82ffd53c748', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', null, 1, 0)
    ON DUPLICATE KEY UPDATE image_url=VALUES(image_url);
  `);

  console.log('Successfully inserted legacy product faa9f05f-9d28-4c53-8465-c82ffd53c748 into database!');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
