import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import { ENV } from '../config/env.js';

export async function seedDatabase() {
  console.log('🌱 Starting LocalFarm Demo Database Seeder...');
  let connection;

  try {
    connection = await mysql.createConnection({
      host: ENV.DB.HOST,
      port: ENV.DB.PORT,
      user: ENV.DB.USER,
      password: ENV.DB.PASSWORD,
      database: ENV.DB.NAME,
      multipleStatements: true,
    });

    console.log(`🔌 Connected to database '${ENV.DB.NAME}'`);

    // Common password hash for demo accounts: "password123"
    const salt = await bcrypt.genSalt(10);
    const demoPasswordHash = await bcrypt.hash('password123', salt);

    // 1. Disable Foreign Key checks for clean truncate/re-seed
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

    // Truncate tables
    const tables = [
      'audit_logs',
      'system_settings',
      'notifications',
      'coupon_redemptions',
      'coupons',
      'reviews',
      'kyc_documents',
      'farmer_payouts',
      'inventory_batches',
      'farmer_harvest_plans',
      'delivery_shifts',
      'customer_wishlists',
      'customer_subscriptions',
      'delivery_tracking',
      'order_timeline',
      'order_items',
      'orders',
      'product_images',
      'products',
      'categories',
      'customer_loyalty',
      'customer_addresses',
      'delivery_profiles',
      'farmer_profiles',
      'delivery_hubs',
      'users',
    ];

    for (const table of tables) {
      await connection.query(`TRUNCATE TABLE ${table};`);
    }

    console.log('🧹 Cleaned existing tables.');

    // 2. Insert Delivery Hubs
    const hubs = [
      ['pune_west', 'Pune West Metro Hub', 'Pune Metro', 'Baner-Pashan Link Rd, Pune', 18.559, 73.7868],
      ['pune_central', 'Pune Central Express Depot', 'Shivajinagar', 'FC Road, Shivajinagar, Pune', 18.5204, 73.8416],
      ['chittoor_central', 'Chittoor Central Hub', 'Chittoor Town', 'MSR Circle, Chittoor, Andhra Pradesh', 13.2172, 79.1003],
      ['nashik_hub', 'Nashik Organic Valley Hub', 'Nashik', 'Panchavati Agro Yard, Nashik', 19.9975, 73.7898],
    ];
    await connection.query(
      'INSERT INTO delivery_hubs (id, name, zone, address, latitude, longitude) VALUES ?',
      [hubs]
    );

    // 3. Insert Users (Admin, Farmers, Delivery Riders, Customers)
    const users = [
      // Admin
      ['admin-1', 'Admin Supervisor', 'admin@localfarmdirect.in', demoPasswordHash, '+91 90000 00001', 'Admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', 1],
      
      // Farmers
      ['f1', 'Rajesh Kumar', 'rajesh.farmer@localfarm.in', demoPasswordHash, '+91 98230 11223', 'Farmer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 1],
      ['f2', 'Sunita Patil', 'sunita.patil@localfarm.in', demoPasswordHash, '+91 97654 33211', 'Farmer', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', 1],
      ['f3', 'Mahesh Deshmukh', 'mahesh.d@localfarm.in', demoPasswordHash, '+91 98901 44556', 'Farmer', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', 1],
      ['f4', 'Ganesh Shinde', 'ganesh.shinde@solapurfarms.org', demoPasswordHash, '+91 94220 88991', 'Farmer', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', 1],
      ['f5', 'Meena Kulkarni', 'meena.berry@mahabaleshwar.in', demoPasswordHash, '+91 91580 77665', 'Farmer', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', 1],

      // Delivery Riders
      ['d1', 'Rohan Sharma', 'rohan.delivery@localfarm.in', demoPasswordHash, '+91 98765 43210', 'Delivery', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 1],

      // Customers
      ['c1', 'Aniket Sharma', 'aniket.sharma@gmail.com', demoPasswordHash, '+91 98112 34567', 'Customer', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80', 1],
      ['c2', 'Priya Joshi', 'priya.j@outlook.com', demoPasswordHash, '+91 99223 88776', 'Customer', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', 1],
      ['c3', 'Vikram Mehta', 'vikram.m@techcorp.io', demoPasswordHash, '+91 97334 11223', 'Customer', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80', 1],
      ['c4', 'Sneha Rane', 'sneha.rane@yahoo.co.in', demoPasswordHash, '+91 98556 44332', 'Customer', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', 1],
      ['c5', 'K. Venkatramana', 'k.venkatramana@localfarm.in', demoPasswordHash, '+91 94402 88990', 'Customer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 1],
    ];

    await connection.query(
      'INSERT INTO users (id, name, email, password_hash, phone, role, avatar_url, is_active) VALUES ?',
      [users]
    );

    // 4. Insert Farmer Profiles
    const farmerProfiles = [
      ['f1', 'Rajesh Kumar Organic Belt', 'Plot 14, Pune Rural Hub, Baner Road, Pune', 'Pune', 'Maharashtra', 18.559, 73.7868, 12, 'Tomatoes & Root Veggies', 1, 'https://example.com/cert1.pdf', 4.90, 142800.00, 'Approved', 'Active', 'Top Rated Farmer'],
      ['f2', 'Sunita Hydroponics Valley', 'Nashik Organic Farm, Dindori Road, Nashik', 'Nashik', 'Maharashtra', 19.9975, 73.7898, 8, 'Leafy Greens & Salad Produce', 1, 'https://example.com/cert2.pdf', 4.95, 98500.00, 'Approved', 'Active', 'Pesticide Free Master'],
      ['f3', 'Satara Indigenous Dairy Collective', 'Satara Cattle Farm, Mahabaleshwar Road, Satara', 'Satara', 'Maharashtra', 17.6805, 73.9902, 15, 'A2 Milk & Vedic Ghee', 1, 'https://example.com/cert3.pdf', 4.98, 215400.00, 'Approved', 'Active', 'Certified Organic Dairy'],
      ['f4', 'Solapur Oil Press Works', 'Solapur Organic Belt, Solapur', 'Solapur', 'Maharashtra', 17.6599, 75.9064, 6, 'Cold-Pressed Oils & Pulses', 1, null, 4.50, 34000.00, 'Pending', 'Active', 'New Applicant'],
      ['f5', 'Mahabaleshwar Berry Orchards', 'Mahabaleshwar Valley, Satara Dist', 'Satara', 'Maharashtra', 17.9237, 73.6586, 10, 'Strawberries & Berries', 1, null, 4.80, 62000.00, 'Pending', 'Active', 'Fruit Specialist'],
    ];

    await connection.query(
      'INSERT INTO farmer_profiles (user_id, farm_name, location_address, district, state, latitude, longitude, experience_years, specialty, organic_certified, certificate_url, rating, total_earnings, approval_status, account_status, badge) VALUES ?',
      [farmerProfiles]
    );

    // 5. Insert Delivery Profile
    const deliveryProfiles = [
      ['d1', 'pune_west', 'EV Scooter (Ather 450X)', 'MH 12 FX 4920', 'DL-MH12-2022-00492', 'https://example.com/dl.pdf', 1, 18.559, 73.7868, 4.90, 342, 2450.00, 'Approved'],
    ];

    await connection.query(
      'INSERT INTO delivery_profiles (user_id, hub_id, vehicle_type, vehicle_number, license_number, license_doc_url, is_online, current_lat, current_lng, rating, total_deliveries, wallet_balance, approval_status) VALUES ?',
      [deliveryProfiles]
    );

    // 6. Insert Customer Loyalty
    const customerLoyalty = [
      ['c1', 14, 4850.00, 'Silver'],
      ['c2', 22, 12400.00, 'Gold'],
      ['c3', 8, 3100.00, 'Bronze'],
      ['c4', 3, 850.00, 'Bronze'],
      ['c5', 18, 7200.00, 'Silver'],
    ];

    await connection.query(
      'INSERT INTO customer_loyalty (customer_id, order_count, total_spent, tier) VALUES ?',
      [customerLoyalty]
    );

    // 7. Insert Customer Addresses
    const customerAddresses = [
      ['addr-1', 'c1', 'Home', 'Flat 402, Green Acres Apt, Kothrud', 'Near Ideal Colony Ground', 'Pune', 'Maharashtra', '411038', 18.5074, 73.8077, 1],
      ['addr-2', 'c2', 'Home', 'B-701, Pinnacle Towers, Aundh', 'Opposite Westend Mall', 'Pune', 'Maharashtra', '411007', 18.5602, 73.8031, 1],
      ['addr-3', 'c3', 'Home', 'Villa 12, Palm Meadows, Baner', 'Near Cummins India Office', 'Pune', 'Maharashtra', '411045', 18.5596, 73.7791, 1],
      ['addr-4', 'c4', 'Home', 'House 45, Viman Nagar', 'Behind Symbiosis Campus', 'Pune', 'Maharashtra', '411014', 18.5679, 73.9143, 1],
      ['addr-5', 'c5', 'Home', 'Door 14-22, MSR Circle, Chittoor Town', 'Near Town Railway Station', 'Chittoor', 'Andhra Pradesh', '517001', 13.2172, 79.1003, 1],
    ];

    await connection.query(
      'INSERT INTO customer_addresses (id, customer_id, label, address_line, landmark, city, state, pincode, latitude, longitude, is_default) VALUES ?',
      [customerAddresses]
    );

    // 8. Insert Categories
    const categories = [
      ['Seasonal Picks', 'Seasonal Picks', 'Sparkles', 'Fresh seasonal handpicked crops and fruits'],
      ['Organic Veggies', 'Organic Veggies', 'Carrot', 'Certified chemical-free daily fresh vegetables'],
      ['Dairy & Eggs', 'Dairy & Eggs', 'Milk', 'Raw A2 desi milk, butter, and pasture-raised eggs'],
      ['Bulk Farm Boxes', 'Bulk Farm Boxes', 'Package', 'Direct value bundles and weekly family farm baskets'],
      ['Grocery & Oils', 'Grocery & Oils', 'ShoppingBag', 'Cold-pressed oils, grains, and traditional stone-ground spices'],
    ];

    await connection.query(
      'INSERT INTO categories (id, name, icon, description) VALUES ?',
      [categories]
    );

    // 9. Insert Products
    const products = [
      ['p1', 'f1', 'Organic Veggies', 'Fresh Farm Organic Tomatoes', 'Vine-ripened red tomatoes grown without synthetic pesticides. Juicy & nutrient rich.', 40.00, 'kg', 120, 1, 'Harvested Fresh Today', 'Today 5:30 AM', 4.90, 48, 0.00, 0, 'Approved'],
      ['p2', 'f2', 'Organic Veggies', 'Crisp Hydroponic Spinach', 'Pesticide-free leafy spinach harvested at first light. High iron and nutrient content.', 30.00, 'bunch', 85, 1, 'Harvested Fresh Today', 'Today 6:00 AM', 4.95, 34, 0.00, 0, 'Approved'],
      ['p3', 'f5', 'Seasonal Picks', 'Alphonso Mangoes (Devgad)', 'Tree-ripened, GI-tagged Alphonso mangoes. Unmatched aroma and sweet rich flavor.', 650.00, 'dozen', 45, 1, 'Yesterday Evening', 'Yesterday Evening', 4.92, 60, 5.00, 0, 'Approved'],
      ['p4', 'f3', 'Dairy & Eggs', 'Pure A2 Gir Cow Milk', 'Raw, unadulterated A2 milk from free-grazing Gir cows. Chilled and delivered cold.', 80.00, 'liter', 200, 1, 'Harvested Fresh Today', 'Today 4:30 AM', 4.98, 112, 0.00, 0, 'Approved'],
      ['p5', 'f4', 'Grocery & Oils', 'Cold-Pressed Groundnut Oil', 'Traditional wood-pressed (Ghani) peanut oil preserving natural antioxidants and aroma.', 240.00, 'liter', 60, 1, 'Batch #402', 'Batch #402', 4.70, 19, 0.00, 0, 'Approved'],
      ['p6', 'f3', 'Dairy & Eggs', 'Farm Fresh Brown Eggs', 'Cruelty-free free-range eggs laid by pasture-raised hens fed natural grain.', 90.00, 'pack of 6', 12, 1, 'Harvested Fresh Today', 'Today 6:15 AM', 4.85, 27, 0.00, 0, 'Approved'],
      ['p7', 'f1', 'Bulk Farm Boxes', 'Family Weekly Organic Harvest Box', 'Complete family staple box: 4kg essential veggies, 2kg seasonal fruits, and farm fresh greens at 20% bulk savings.', 549.00, 'box (8kg mixed)', 25, 1, 'Curated This Morning', 'Curated This Morning', 4.96, 52, 10.00, 0, 'Approved'],
      ['p8', 'f3', 'Grocery & Oils', 'Palamaner Farm Pure Desi Ghee', 'Traditional Bilona method ghee made by churning curd from free-grazing AP farm cows.', 950.00, '500g jar', 8, 1, 'Batch #12', 'Batch #12', 4.99, 88, 0.00, 0, 'Approved'],
      ['p9', 'f5', 'Seasonal Picks', 'Fresh Strawberries (Mahabaleshwar)', 'Handpicked sweet berries from hill slopes of Mahabaleshwar.', 180.00, '250g box', 18, 1, 'Harvested Fresh Today', 'Today 5:00 AM', 4.80, 22, 0.00, 0, 'Approved'],
      ['p10', 'f2', 'Bulk Farm Boxes', 'Immunity & Detox Farm Box', 'Handpicked citrus, ginger, turmeric root, amla, and fresh green leafy bundles.', 420.00, 'box (5kg)', 30, 1, 'Harvested Fresh Today', 'Today 6:30 AM', 4.90, 15, 0.00, 0, 'Approved'],
    ];

    await connection.query(
      'INSERT INTO products (id, farmer_id, category_id, name, description, price, unit, stock, is_organic, harvest_tag, harvest_date, rating, reviews_count, flash_discount, is_unavailable, status) VALUES ?',
      [products]
    );

    // 10. Insert Product Images
    const productImages = [
      ['img-1', 'p1', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', null, 1, 0],
      ['img-2', 'p2', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80', null, 1, 0],
      ['img-3', 'p3', 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=600&q=80', null, 1, 0],
      ['img-4', 'p4', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', null, 1, 0],
      ['img-5', 'p5', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', null, 1, 0],
      ['img-6', 'p6', 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80', null, 1, 0],
      ['img-7', 'p7', 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80', null, 1, 0],
      ['img-8', 'p8', 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=600&q=80', null, 1, 0],
      ['img-9', 'p9', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80', null, 1, 0],
      ['img-10', 'p10', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', null, 1, 0],
    ];

    await connection.query(
      'INSERT INTO product_images (id, product_id, image_url, cloudinary_public_id, is_primary, display_order) VALUES ?',
      [productImages]
    );

    // 11. Insert Orders
    const orders = [
      ['ORD-8821', 'c1', 'd1', 'Flat 402, Green Acres Apt, Kothrud, Pune - 411038', 18.5074, 73.8077, 'Out for Delivery', 110.00, 30.00, 0.00, 20.00, 160.00, 'UPI (Paid)', 'Paid', '18 mins', null, null, '4921'],
      ['ORD-8820', 'c2', 'd1', 'B-701, Pinnacle Towers, Aundh, Pune - 411007', 18.5602, 73.8031, 'Delivered', 810.00, 30.00, 0.00, 0.00, 840.00, 'Credit Card', 'Paid', 'Delivered', null, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500', '8820'],
      ['ORD-8819', 'c3', 'd1', 'Villa 12, Palm Meadows, Baner, Pune - 411045', 18.5596, 73.7791, 'Accepted', 330.00, 30.00, 0.00, 15.00, 375.00, 'Cash on Delivery', 'Pending', '25 mins', null, null, '1934'],
      ['ORD-8818', 'c4', null, 'House 45, Viman Nagar, Pune - 411014', 18.5679, 73.9143, 'Pending', 480.00, 30.00, 0.00, 0.00, 510.00, 'UPI (Paid)', 'Paid', '35 mins', null, null, '5518'],
      ['ORD-CTR-7701', 'c5', 'd1', 'Door 14-22, MSR Circle, Chittoor Town, Andhra Pradesh - 517001', 13.2172, 79.1003, 'Out for Delivery', 970.00, 30.00, 50.00, 30.00, 980.00, 'UPI (Prepaid)', 'Paid', '20 mins', null, null, '7701'],
    ];

    await connection.query(
      'INSERT INTO orders (id, customer_id, delivery_partner_id, address_text, customer_lat, customer_lng, status, subtotal, delivery_fee, discount_amount, tip_amount, total_amount, payment_method, payment_status, eta, failure_reason, proof_photo_url, otp_code) VALUES ?',
      [orders]
    );

    // 12. Insert Order Items
    const orderItems = [
      // ORD-8821 items
      ['oi-1', 'ORD-8821', 'p1', 'f1', 'Fresh Farm Organic Tomatoes', 2.00, 'kg', 40.00, 80.00],
      ['oi-2', 'ORD-8821', 'p2', 'f2', 'Crisp Hydroponic Spinach', 1.00, 'bunch', 30.00, 30.00],

      // ORD-8820 items
      ['oi-3', 'ORD-8820', 'p4', 'f3', 'Pure A2 Gir Cow Milk', 2.00, 'liter', 80.00, 160.00],
      ['oi-4', 'ORD-8820', 'p3', 'f5', 'Alphonso Mangoes (Devgad)', 1.00, 'dozen', 650.00, 650.00],

      // ORD-8819 items
      ['oi-5', 'ORD-8819', 'p2', 'f2', 'Crisp Hydroponic Spinach', 3.00, 'bunch', 30.00, 90.00],
      ['oi-6', 'ORD-8819', 'p5', 'f4', 'Cold-Pressed Groundnut Oil', 1.00, 'liter', 240.00, 240.00],

      // ORD-8818 items
      ['oi-7', 'ORD-8818', 'p5', 'f4', 'Cold-Pressed Groundnut Oil', 2.00, 'liter', 240.00, 480.00],

      // ORD-CTR-7701 items
      ['oi-8', 'ORD-CTR-7701', 'p8', 'f3', 'Palamaner Farm Pure Desi Ghee', 1.00, '500g jar', 950.00, 950.00],
      ['oi-9', 'ORD-CTR-7701', 'p1', 'f1', 'Fresh Farm Organic Tomatoes', 0.50, 'kg', 40.00, 20.00],
    ];

    await connection.query(
      'INSERT INTO order_items (id, order_id, product_id, farmer_id, product_name, quantity, unit, unit_price, total_price) VALUES ?',
      [orderItems]
    );

    // 13. Insert Order Timelines
    const orderTimelines = [
      ['ot-1', 'ORD-8821', 'Order Placed', 'Customer placed order via UPI', 'c1', 'Customer'],
      ['ot-2', 'ORD-8821', 'Assigned to Courier', 'Assigned to rider Rohan Sharma', 'admin-1', 'Admin'],
      ['ot-3', 'ORD-8821', 'Picked Up', 'Collected fresh produce from Rajesh Kumar farm', 'd1', 'Delivery'],
      ['ot-4', 'ORD-8821', 'Out for Delivery', 'En route to Kothrud with live tracking', 'd1', 'Delivery'],

      ['ot-5', 'ORD-8820', 'Order Placed', 'Customer placed order with Credit Card', 'c2', 'Customer'],
      ['ot-6', 'ORD-8820', 'Delivered', 'Delivered fresh milk and mangoes directly to door', 'd1', 'Delivery'],
    ];

    await connection.query(
      'INSERT INTO order_timeline (id, order_id, title, description, actor_id, actor_role) VALUES ?',
      [orderTimelines]
    );

    // 14. Insert Real-Time Delivery Tracking
    const tracking = [
      ['dt-1', 'ORD-8821', 'd1', 18.5280, 73.8150, 24.5, 185.0],
      ['dt-2', 'ORD-CTR-7701', 'd1', 13.2100, 79.0800, 32.0, 90.0],
    ];

    await connection.query(
      'INSERT INTO delivery_tracking (id, order_id, delivery_partner_id, current_lat, current_lng, speed_kmh, heading_deg) VALUES ?',
      [tracking]
    );

    // 15. Insert Customer Subscriptions
    const subscriptions = [
      ['sub-1', 'c1', 'p4', 'f3', '2 Liters', 'Daily', 160.00, '2026-09-29', 1, 0, 1, 14],
      ['sub-2', 'c2', 'p7', 'f1', '1 Box (8kg)', 'Weekly', 549.00, '2026-10-02', 1, 0, 1, 6],
    ];

    await connection.query(
      'INSERT INTO customer_subscriptions (id, customer_id, product_id, farmer_id, quantity, frequency, price, next_delivery_date, is_active, skip_next, whatsapp_notify, streak_count) VALUES ?',
      [subscriptions]
    );

    // 16. Insert Delivery Shifts
    const shifts = [
      ['shift-1', 'd1', 'pune_west', '2026-09-28', 'morning_express', 6, 12, 'Scheduled'],
      ['shift-2', 'd1', 'pune_west', '2026-09-29', 'evening_peak', 16, 22, 'Scheduled'],
    ];

    await connection.query(
      'INSERT INTO delivery_shifts (id, delivery_partner_id, hub_id, shift_date, preset_id, start_hour, end_hour, status) VALUES ?',
      [shifts]
    );

    // 17. Insert Farmer Harvest Plans
    const harvestPlans = [
      ['hp-1', 'f1', 'Organic Heirloom Tomatoes', '2026-09-25', '2026-10-10', 800.00, 320.00, 'Active', 1, 'Fresh organic heirloom tomatoes ripening on the vine. Expect high yield next week!'],
      ['hp-2', 'f2', 'Crisp Hydroponic Lettuce & Spinach', '2026-09-28', '2026-10-05', 250.00, 50.00, 'Active', 1, 'New hydroponic batch ready for daily morning dispatch.'],
    ];

    await connection.query(
      'INSERT INTO farmer_harvest_plans (id, farmer_id, crop_name, start_date, end_date, expected_volume, current_yield, status, buyer_notified, last_broadcast_msg) VALUES ?',
      [harvestPlans]
    );

    // 18. Insert Inventory Batches
    const batches = [
      ['b-1', 'p1', 'f1', 'TOM-BATCH-0928', '2026-09-28', 150.00, 5.00, 'Minor sorting bruise waste'],
      ['b-2', 'p2', 'f2', 'SPN-BATCH-0928', '2026-09-28', 90.00, 2.00, 'Trimmed outer leaves'],
    ];

    await connection.query(
      'INSERT INTO inventory_batches (id, product_id, farmer_id, batch_number, harvest_date, quantity, waste_quantity, waste_reason) VALUES ?',
      [batches]
    );

    // 19. Insert Farmer Payouts
    const payouts = [
      ['pay-1', 'f1', 25000.00, 1250.00, 0.00, 23750.00, 'Paid', 'HDFC0001234', 'HDFC0001234', 'HDFC Bank Baner', new Date()],
      ['pay-2', 'f2', 18000.00, 900.00, 0.00, 17100.00, 'Paid', 'SBIN0004567', 'SBIN0004567', 'State Bank of India Nashik', new Date()],
    ];

    await connection.query(
      'INSERT INTO farmer_payouts (id, farmer_id, amount, commission_deducted, gst_deducted, net_payout, status, bank_account_no, bank_ifsc, bank_name, processed_at) VALUES ?',
      [payouts]
    );

    // 20. Insert KYC Documents
    const kycDocs = [
      ['kyc-1', 'f1', 'Organic Farming Certificate', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', 'Approved', 'NPOP Certification verified valid until 2027'],
      ['kyc-2', 'f2', 'FSSAI Food Business License', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', 'Approved', 'FSSAI central registration verified'],
      ['kyc-3', 'f4', 'Land Title Proof (Khata)', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', 'Pending', 'Awaiting original khata document upload'],
    ];

    await connection.query(
      'INSERT INTO kyc_documents (id, user_id, doc_type, doc_url, status, admin_notes) VALUES ?',
      [kycDocs]
    );

    // 21. Insert Reviews
    const reviews = [
      ['rev-1', 'p1', 'c1', 5, 'Super fresh and full of natural flavor. Arrived within 30 minutes!'],
      ['rev-2', 'p4', 'c2', 5, 'Best A2 milk in Pune. Thick malai and genuine farm taste.'],
      ['rev-3', 'p2', 'c3', 5, 'Crisp hydroponic spinach, zero mud or pesticides.'],
    ];

    await connection.query(
      'INSERT INTO reviews (id, product_id, customer_id, rating, comment) VALUES ?',
      [reviews]
    );

    // 22. Insert Coupons
    const coupons = [
      ['coup-1', 'LOCALFARM50', 'flat', 50.00, 200.00, 50.00, 1, '2026-12-31'],
      ['coup-2', 'FRESH10', 'percentage', 10.00, 100.00, 100.00, 1, '2026-12-31'],
      ['coup-3', 'WELCOME15', 'percentage', 15.00, 150.00, 75.00, 1, '2026-12-31'],
    ];

    await connection.query(
      'INSERT INTO coupons (id, code, discount_type, discount_value, min_order_amount, max_discount_amount, is_active, expires_at) VALUES ?',
      [coupons]
    );

    // 23. Insert Notifications
    const notifications = [
      ['notif-1', 'c1', 'Order Out for Delivery', 'Your order ORD-8821 is on the way with rider Rohan Sharma.', 'order', 0],
      ['notif-2', 'f1', 'New Order Received', 'You have a new order for Fresh Organic Tomatoes (2kg).', 'order', 0],
      ['notif-3', 'd1', 'New Delivery Task', 'Task assigned for ORD-8821 in Kothrud.', 'order', 0],
    ];

    await connection.query(
      'INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES ?',
      [notifications]
    );

    // 24. Insert System Settings
    const settings = [
      ['marketplace', JSON.stringify({ storeName: 'Local Farm Direct', deliveryFee: 30, minOrderAmount: 100, currency: '₹ (INR)' })],
      ['notifications', JSON.stringify({ newOrderAlert: true, farmerRegAlert: true, lowStockAlert: true })],
      ['commission', JSON.stringify({ defaultCommissionRate: 5.0, organicFarmerDiscountRate: 3.5, gstRate: 0.0 })],
      ['security', JSON.stringify({ twoFactorAuth: false, sessionTimeout: '30 mins' })],
    ];

    for (const [key, val] of settings) {
      await connection.query(
        'INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, val, val]
      );
    }

    // 25. Insert Audit Logs
    const auditLogs = [
      ['admin-1', 'Admin Supervisor', 'System Initialized', 'system_settings', '127.0.0.1'],
      ['admin-1', 'Admin Supervisor', 'Verified Farmer Rajesh Kumar', 'farmer_profiles:f1', '127.0.0.1'],
      ['admin-1', 'Admin Supervisor', 'Approved KYC Document', 'kyc_documents:kyc-1', '127.0.0.1'],
    ];

    await connection.query(
      'INSERT INTO audit_logs (admin_id, admin_name, action, entity, ip_address) VALUES ?',
      [auditLogs]
    );

    // Re-enable Foreign Key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('✅ Demo database seeded successfully with all 4 user roles, products, orders, and telemetry!');
    return { success: true };
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then((res) => {
    process.exit(res.success ? 0 : 1);
  });
}
