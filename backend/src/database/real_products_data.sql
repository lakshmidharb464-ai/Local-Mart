-- =====================================================================
-- LocalFarm Direct - Pure SQL Real Product Data Insertion
-- Safe idempotent insertion using ON DUPLICATE KEY UPDATE.
-- Can be executed multiple times without errors or table truncation.
-- =====================================================================

-- 1. Ensure Categories
INSERT INTO categories (id, name, icon, description) VALUES
  ('Seasonal Picks', 'Seasonal Picks', 'Sparkles', 'Fresh seasonal handpicked crops and fruits'),
  ('Organic Veggies', 'Organic Veggies', 'Carrot', 'Certified chemical-free daily fresh vegetables'),
  ('Dairy & Eggs', 'Dairy & Eggs', 'Milk', 'Raw A2 desi milk, butter, and pasture-raised eggs'),
  ('Bulk Farm Boxes', 'Bulk Farm Boxes', 'Package', 'Direct value bundles and weekly family farm baskets'),
  ('Grocery & Oils', 'Grocery & Oils', 'ShoppingBag', 'Cold-pressed oils, grains, and traditional stone-ground spices')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  icon = VALUES(icon),
  description = VALUES(description);

-- 2. Ensure Farmer Accounts
INSERT INTO users (id, name, email, password_hash, phone, role, avatar_url, is_active) VALUES
  ('f1', 'Rajesh Kumar', 'rajesh.farmer@localfarm.in', '$2a$10$wTqB0qY9K5Z4P5z4Z3G.qOa7t5B7K5b5K5b5K5b5K5b5K5b5K5b5', '+91 98230 11223', 'Farmer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 1),
  ('f2', 'Sunita Patil', 'sunita.patil@localfarm.in', '$2a$10$wTqB0qY9K5Z4P5z4Z3G.qOa7t5B7K5b5K5b5K5b5K5b5K5b5K5b5', '+91 97654 33211', 'Farmer', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', 1),
  ('f3', 'Mahesh Deshmukh', 'mahesh.d@localfarm.in', '$2a$10$wTqB0qY9K5Z4P5z4Z3G.qOa7t5B7K5b5K5b5K5b5K5b5K5b5K5b5', '+91 98901 44556', 'Farmer', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', 1),
  ('f4', 'Ganesh Shinde', 'ganesh.shinde@solapurfarms.org', '$2a$10$wTqB0qY9K5Z4P5z4Z3G.qOa7t5B7K5b5K5b5K5b5K5b5K5b5K5b5', '+91 94220 88991', 'Farmer', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', 1),
  ('f5', 'Meena Kulkarni', 'meena.berry@mahabaleshwar.in', '$2a$10$wTqB0qY9K5Z4P5z4Z3G.qOa7t5B7K5b5K5b5K5b5K5b5K5b5K5b5', '+91 91580 77665', 'Farmer', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  phone = VALUES(phone),
  avatar_url = VALUES(avatar_url);

-- 3. Ensure Farmer Profiles
INSERT INTO farmer_profiles (user_id, farm_name, location_address, district, state, latitude, longitude, experience_years, specialty, organic_certified, certificate_url, rating, total_earnings, approval_status, account_status, badge) VALUES
  ('f1', 'Rajesh Kumar Organic Belt', 'Plot 14, Pune Rural Hub, Baner Road, Pune', 'Pune', 'Maharashtra', 18.559, 73.7868, 12, 'Tomatoes & Root Veggies', 1, 'https://example.com/cert1.pdf', 4.90, 142800.00, 'Approved', 'Active', 'Top Rated Farmer'),
  ('f2', 'Sunita Hydroponics Valley', 'Nashik Organic Farm, Dindori Road, Nashik', 'Nashik', 'Maharashtra', 19.9975, 73.7898, 8, 'Leafy Greens & Salad Produce', 1, 'https://example.com/cert2.pdf', 4.95, 98500.00, 'Approved', 'Active', 'Pesticide Free Master'),
  ('f3', 'Satara Indigenous Dairy Collective', 'Satara Cattle Farm, Mahabaleshwar Road, Satara', 'Satara', 'Maharashtra', 17.6805, 73.9902, 15, 'A2 Milk & Vedic Ghee', 1, 'https://example.com/cert3.pdf', 4.98, 215400.00, 'Approved', 'Active', 'Certified Organic Dairy'),
  ('f4', 'Solapur Oil Press Works', 'Solapur Organic Belt, Solapur', 'Solapur', 'Maharashtra', 17.6599, 75.9064, 6, 'Cold-Pressed Oils & Pulses', 1, null, 4.50, 34000.00, 'Approved', 'Active', 'Oil Press Specialist'),
  ('f5', 'Mahabaleshwar Berry Orchards', 'Mahabaleshwar Valley, Satara Dist', 'Satara', 'Maharashtra', 17.9237, 73.6586, 10, 'Strawberries & Berries', 1, null, 4.80, 62000.00, 'Approved', 'Active', 'Fruit Specialist')
ON DUPLICATE KEY UPDATE
  farm_name = VALUES(farm_name),
  location_address = VALUES(location_address),
  rating = VALUES(rating),
  approval_status = 'Approved';

-- 4. Insert 20 Real Products
INSERT INTO products (id, farmer_id, category_id, name, description, price, unit, stock, is_organic, harvest_tag, harvest_date, rating, reviews_count, flash_discount, is_unavailable, status) VALUES
  ('p1', 'f1', 'Organic Veggies', 'Fresh Farm Organic Tomatoes', 'Vine-ripened red tomatoes grown without synthetic pesticides. Juicy, firm, and nutrient rich.', 40.00, 'kg', 120, 1, 'Harvested Fresh Today', 'Today 5:30 AM', 4.90, 48, 0.00, 0, 'Approved'),
  ('p2', 'f2', 'Organic Veggies', 'Crisp Hydroponic Spinach', 'Pesticide-free leafy spinach harvested at first light. High iron and nutrient content.', 30.00, 'bunch', 85, 1, 'Harvested Fresh Today', 'Today 6:00 AM', 4.95, 34, 0.00, 0, 'Approved'),
  ('p3', 'f5', 'Seasonal Picks', 'Devgad Alphonso Mangoes (Hapus)', 'Tree-ripened, GI-tagged Alphonso mangoes. Unmatched aroma and sweet rich flavor.', 650.00, 'dozen', 45, 1, 'Tree Ripened Yesterday', 'Yesterday Evening', 4.92, 60, 5.00, 0, 'Approved'),
  ('p4', 'f3', 'Dairy & Eggs', 'Pure A2 Gir Cow Raw Milk', 'Raw, unadulterated A2 milk from free-grazing Gir cows. Chilled and delivered fresh in glass bottles.', 85.00, 'liter', 200, 1, 'Milked This Morning', 'Today 4:30 AM', 4.98, 112, 0.00, 0, 'Approved'),
  ('p5', 'f4', 'Grocery & Oils', 'Cold-Pressed Groundnut Oil', 'Traditional wood-pressed (Ghani) peanut oil preserving natural antioxidants and aroma.', 240.00, 'liter', 60, 1, 'Cold Pressed Batch #402', 'Batch #402', 4.70, 19, 0.00, 0, 'Approved'),
  ('p6', 'f3', 'Dairy & Eggs', 'Farm Fresh Pasture Brown Eggs', 'Cruelty-free free-range eggs laid by pasture-raised hens fed natural grain and greens.', 95.00, 'pack of 6', 60, 1, 'Collected Today', 'Today 6:15 AM', 4.85, 27, 0.00, 0, 'Approved'),
  ('p7', 'f1', 'Bulk Farm Boxes', 'Family Weekly Organic Harvest Box', 'Complete family staple box: 4kg essential veggies, 2kg seasonal fruits, and farm fresh greens at 20% bulk savings.', 549.00, 'box (8kg mixed)', 25, 1, 'Curated This Morning', 'Curated This Morning', 4.96, 52, 10.00, 0, 'Approved'),
  ('p8', 'f3', 'Dairy & Eggs', 'Traditional Bilona Desi Cow Ghee', 'Hand-churned Vedic Bilona ghee prepared from curd of grass-fed desi cows over slow wood-fire.', 950.00, '500g jar', 35, 1, 'Artisan Batch #12', 'Batch #12', 4.99, 88, 0.00, 0, 'Approved'),
  ('p9', 'f5', 'Seasonal Picks', 'Fresh Mahabaleshwar Sweet Strawberries', 'Handpicked sweet ruby red berries from the misty hill slopes of Mahabaleshwar.', 180.00, '250g box', 40, 1, 'Harvested Fresh Today', 'Today 5:00 AM', 4.80, 22, 0.00, 0, 'Approved'),
  ('p10', 'f2', 'Bulk Farm Boxes', 'Immunity & Detox Farm Wellness Box', 'Handpicked citrus, fresh ginger, raw turmeric root, amla, and organic green leafy bundles.', 420.00, 'box (5kg)', 30, 1, 'Harvested Fresh Today', 'Today 6:30 AM', 4.90, 15, 0.00, 0, 'Approved'),
  ('p11', 'f1', 'Organic Veggies', 'Crisp Sweet Orange Carrots', 'Sweet, crunchy farm-fresh red carrots grown in rich organic soil. High in beta-carotene.', 45.00, 'kg', 110, 1, 'Harvested Fresh Today', 'Today 6:00 AM', 4.88, 31, 0.00, 0, 'Approved'),
  ('p12', 'f1', 'Organic Veggies', 'Organic Country Potatoes', 'Naturally cultivated unpolished earthen potatoes from Pune rural farms. Perfect texture for cooking.', 35.00, 'kg', 250, 1, 'Harvested This Week', 'This Week', 4.75, 42, 0.00, 0, 'Approved'),
  ('p13', 'f2', 'Organic Veggies', 'Nashik Red Onions', 'Flavorful, pungent sun-cured red onions sourced directly from the renowned onion fields of Nashik.', 38.00, 'kg', 300, 1, 'Sun Cured Fresh', 'Harvest Batch #88', 4.82, 38, 0.00, 0, 'Approved'),
  ('p14', 'f3', 'Dairy & Eggs', 'Farm Fresh Malai Paneer', 'Melt-in-mouth artisanal cottage cheese made from pure whole A2 milk with zero synthetic additives.', 130.00, '250g pack', 45, 1, 'Freshly Made Today', 'Today 4:00 AM', 4.95, 64, 0.00, 0, 'Approved'),
  ('p15', 'f2', 'Organic Veggies', 'Crisp Green Bell Peppers', 'Crisp, thick-walled glossy green capsicums grown in hydroponic polyhouses. Crunchy and mildly sweet.', 55.00, 'kg', 80, 1, 'Harvested Fresh Today', 'Today 5:45 AM', 4.80, 20, 0.00, 0, 'Approved'),
  ('p16', 'f2', 'Organic Veggies', 'Fresh Organic Broccoli Florets', 'Tender, deep green compact broccoli heads packed with antioxidants, dietary fiber, and vitamin C.', 75.00, '500g', 65, 1, 'Harvested Fresh Today', 'Today 6:10 AM', 4.89, 29, 0.00, 0, 'Approved'),
  ('p17', 'f4', 'Grocery & Oils', 'Cold-Pressed Pure Yellow Mustard Oil', 'Authentic Sarson tel extracted via traditional Kachi Ghani cold press. Distinctive aroma and purity.', 210.00, 'liter', 55, 1, 'Cold Pressed Batch #109', 'Batch #109', 4.84, 25, 0.00, 0, 'Approved'),
  ('p18', 'f4', 'Grocery & Oils', 'Raw Wild Forest Multi-Flora Honey', 'Unfiltered, unpasteurized natural honey collected by tribal beekeepers. Retains living enzymes and pollen.', 380.00, '500g jar', 50, 1, 'Raw Forest Harvest', 'Forest Harvest Oct', 4.97, 72, 0.00, 0, 'Approved'),
  ('p19', 'f1', 'Seasonal Picks', 'Golden Sweet Corn Cobs', 'Tender, juicy sweet corn on the cob harvested fresh before sunrise. Bursting with natural sweetness.', 40.00, 'pack of 2', 95, 1, 'Harvested Fresh Today', 'Today 5:15 AM', 4.86, 18, 0.00, 0, 'Approved'),
  ('p20', 'f5', 'Seasonal Picks', 'Ruby Red Pomegranates (Bhagwa)', 'Premium Solapur Bhagwa variety pomegranates with deep crimson sweet arils and thin skin.', 160.00, 'kg', 70, 1, 'Direct Orchard Pick', 'Yesterday Afternoon', 4.93, 56, 5.00, 0, 'Approved')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category_id = VALUES(category_id),
  description = VALUES(description),
  price = VALUES(price),
  unit = VALUES(unit),
  stock = VALUES(stock),
  is_organic = VALUES(is_organic),
  harvest_tag = VALUES(harvest_tag),
  harvest_date = VALUES(harvest_date),
  rating = VALUES(rating),
  reviews_count = VALUES(reviews_count),
  flash_discount = VALUES(flash_discount),
  status = 'Approved';

-- 5. Insert Product Images
INSERT INTO product_images (id, product_id, image_url, cloudinary_public_id, is_primary, display_order) VALUES
  ('img-1', 'p1', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-2', 'p2', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-3', 'p3', 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-4', 'p4', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-5', 'p5', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-6', 'p6', 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-7', 'p7', 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-8', 'p8', 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-9', 'p9', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-10', 'p10', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-11', 'p11', 'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-12', 'p12', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-13', 'p13', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-14', 'p14', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-15', 'p15', 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-16', 'p16', 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-17', 'p17', 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-18', 'p18', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-19', 'p19', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80', null, 1, 0),
  ('img-20', 'p20', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80', null, 1, 0)
ON DUPLICATE KEY UPDATE
  image_url = VALUES(image_url),
  is_primary = VALUES(is_primary),
  display_order = VALUES(display_order);
