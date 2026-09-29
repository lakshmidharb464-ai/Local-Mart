-- ==============================================================================
-- LOCALFARM DIRECT — MASTER RELATIONAL DDL (MySQL 8.0+ InnoDB Engine)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS localfarm_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE localfarm_db;

-- 1. Users Table (Core Identity & Authentication)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('Customer', 'Farmer', 'Delivery', 'Admin') NOT NULL DEFAULT 'Customer',
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 2. Delivery Hubs Table (Distribution Centers)
CREATE TABLE IF NOT EXISTS delivery_hubs (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'pune_central', 'chittoor_link'
    name VARCHAR(100) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Farmer Profiles (1:1 with users WHERE role = 'Farmer')
CREATE TABLE IF NOT EXISTS farmer_profiles (
    user_id VARCHAR(36) PRIMARY KEY,
    farm_name VARCHAR(150) NOT NULL,
    location_address VARCHAR(255) NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    experience_years INT DEFAULT 0,
    specialty VARCHAR(150),
    organic_certified BOOLEAN DEFAULT FALSE,
    certificate_url VARCHAR(500),
    rating DECIMAL(3, 2) DEFAULT 5.00,
    total_earnings DECIMAL(12, 2) DEFAULT 0.00,
    approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    account_status ENUM('Active', 'Suspended') DEFAULT 'Active',
    badge VARCHAR(50) DEFAULT 'New Farmer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Delivery Partner Profiles (1:1 with users WHERE role = 'Delivery')
CREATE TABLE IF NOT EXISTS delivery_profiles (
    user_id VARCHAR(36) PRIMARY KEY,
    hub_id VARCHAR(50) NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    vehicle_number VARCHAR(50) NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    license_doc_url VARCHAR(500),
    is_online BOOLEAN DEFAULT FALSE,
    current_lat DECIMAL(10, 8),
    current_lng DECIMAL(11, 8),
    rating DECIMAL(3, 2) DEFAULT 5.00,
    total_deliveries INT DEFAULT 0,
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hub_id) REFERENCES delivery_hubs(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Customer Addresses (1:N with users)
CREATE TABLE IF NOT EXISTS customer_addresses (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    label VARCHAR(50) DEFAULT 'Home',
    address_line VARCHAR(255) NOT NULL,
    landmark VARCHAR(150),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_customer_addr (customer_id)
) ENGINE=InnoDB;

-- 6. Customer Loyalty & Member Ranks (1:1 with users)
CREATE TABLE IF NOT EXISTS customer_loyalty (
    customer_id VARCHAR(36) PRIMARY KEY,
    order_count INT DEFAULT 0,
    total_spent DECIMAL(12, 2) DEFAULT 0.00,
    tier ENUM('Bronze', 'Silver', 'Gold') DEFAULT 'Bronze',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) DEFAULT 'Sparkles',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 8. Products Table (Crop Listings)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    farmer_id VARCHAR(36) NOT NULL,
    category_id VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL DEFAULT 'kg',
    stock INT NOT NULL DEFAULT 0,
    is_organic BOOLEAN DEFAULT TRUE,
    harvest_tag VARCHAR(100) DEFAULT 'Harvested Fresh Today',
    harvest_date VARCHAR(100) NULL,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    reviews_count INT DEFAULT 0,
    flash_discount DECIMAL(5, 2) DEFAULT 0.00,
    is_unavailable BOOLEAN DEFAULT FALSE,
    status ENUM('Approved', 'Pending', 'Rejected', 'Inactive') DEFAULT 'Approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_product_category (category_id),
    INDEX idx_product_farmer (farmer_id),
    INDEX idx_product_status (status)
) ENGINE=InnoDB;

-- 9. Product Images (Cloudinary Multi-Image Stream)
CREATE TABLE IF NOT EXISTS product_images (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    cloudinary_public_id VARCHAR(200),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_prod_img (product_id)
) ENGINE=InnoDB;

-- 10. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'ORD-8821'
    customer_id VARCHAR(36) NOT NULL,
    delivery_partner_id VARCHAR(36) NULL,
    address_text TEXT NOT NULL,
    customer_lat DECIMAL(10, 8),
    customer_lng DECIMAL(11, 8),
    status ENUM('Pending', 'Approved', 'Packed', 'Assigned', 'Accepted', 'Picked Up', 'Out for Delivery', 'Delivered', 'Cancelled', 'Failed') DEFAULT 'Pending',
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) DEFAULT 30.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    tip_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('Pending', 'Paid', 'Refunded', 'Failed') DEFAULT 'Pending',
    eta VARCHAR(50) DEFAULT '30-45 mins',
    failure_reason TEXT NULL,
    proof_photo_url VARCHAR(500) NULL,
    otp_code VARCHAR(6) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (delivery_partner_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_order_status (status),
    INDEX idx_order_customer (customer_id),
    INDEX idx_order_rider (delivery_partner_id)
) ENGINE=InnoDB;

-- 11. Order Line Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    farmer_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    quantity DECIMAL(8, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_item_order (order_id),
    INDEX idx_item_farmer (farmer_id)
) ENGINE=InnoDB;

-- 12. Order Timeline History
CREATE TABLE IF NOT EXISTS order_timeline (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    actor_id VARCHAR(36) NULL,
    actor_role ENUM('Customer', 'Farmer', 'Delivery', 'Admin', 'System') DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_timeline_order (order_id)
) ENGINE=InnoDB;

-- 13. Real-Time Delivery Tracking Beacon
CREATE TABLE IF NOT EXISTS delivery_tracking (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL UNIQUE,
    delivery_partner_id VARCHAR(36) NOT NULL,
    current_lat DECIMAL(10, 8) NOT NULL,
    current_lng DECIMAL(11, 8) NOT NULL,
    speed_kmh DECIMAL(5, 2) DEFAULT 0.00,
    heading_deg DECIMAL(5, 2) DEFAULT 0.00,
    last_beacon_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (delivery_partner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. Customer Subscriptions
CREATE TABLE IF NOT EXISTS customer_subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    farmer_id VARCHAR(36) NOT NULL,
    quantity VARCHAR(50) NOT NULL,
    frequency ENUM('Daily', 'Alternate Days', 'Every Tue & Fri', 'Weekly') NOT NULL DEFAULT 'Daily',
    price DECIMAL(10, 2) NOT NULL,
    next_delivery_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    skip_next BOOLEAN DEFAULT FALSE,
    whatsapp_notify BOOLEAN DEFAULT TRUE,
    streak_count INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 15. Customer Wishlist (N:M)
CREATE TABLE IF NOT EXISTS customer_wishlists (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_wishlist (customer_id, product_id),
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 16. Delivery Partner Shifts & Bookings
CREATE TABLE IF NOT EXISTS delivery_shifts (
    id VARCHAR(36) PRIMARY KEY,
    delivery_partner_id VARCHAR(36) NOT NULL,
    hub_id VARCHAR(50) NOT NULL,
    shift_date DATE NOT NULL,
    preset_id VARCHAR(50) DEFAULT 'morning_express',
    start_hour INT NOT NULL,
    end_hour INT NOT NULL,
    status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (delivery_partner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hub_id) REFERENCES delivery_hubs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 17. Farmer Harvest Planner Schedules
CREATE TABLE IF NOT EXISTS farmer_harvest_plans (
    id VARCHAR(36) PRIMARY KEY,
    farmer_id VARCHAR(36) NOT NULL,
    crop_name VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    expected_volume DECIMAL(10, 2) NOT NULL,
    current_yield DECIMAL(10, 2) DEFAULT 0.00,
    status ENUM('Scheduled', 'Active', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    buyer_notified BOOLEAN DEFAULT FALSE,
    last_broadcast_msg TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 18. Farmer Inventory Batches & Spoilage Log
CREATE TABLE IF NOT EXISTS inventory_batches (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    farmer_id VARCHAR(36) NOT NULL,
    batch_number VARCHAR(50) NOT NULL,
    harvest_date DATE NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    waste_quantity DECIMAL(10, 2) DEFAULT 0.00,
    waste_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 19. Farmer Payouts & Commission Engine
CREATE TABLE IF NOT EXISTS farmer_payouts (
    id VARCHAR(36) PRIMARY KEY,
    farmer_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    commission_deducted DECIMAL(10, 2) NOT NULL,
    gst_deducted DECIMAL(10, 2) DEFAULT 0.00,
    net_payout DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Processing', 'Paid', 'Failed') DEFAULT 'Processing',
    bank_account_no VARCHAR(50),
    bank_ifsc VARCHAR(30),
    bank_name VARCHAR(100),
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 20. KYC Verification Documents Queue
CREATE TABLE IF NOT EXISTS kyc_documents (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    doc_type ENUM('Organic Farming Certificate', 'FSSAI Food Business License', 'Land Title Proof (Khata)', 'Driving License', 'RC Document') NOT NULL,
    doc_url VARCHAR(500) NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 21. Product Reviews & Ratings
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 22. Coupons, In-App Notifications, Settings & Audit Logs
CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('percentage', 'flat') NOT NULL DEFAULT 'percentage',
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0.00,
    max_discount_amount DECIMAL(10, 2) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS coupon_redemptions (
    id VARCHAR(36) PRIMARY KEY,
    coupon_id VARCHAR(36) NOT NULL,
    order_id VARCHAR(50) NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    discount_applied DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('order', 'harvest', 'payout', 'system') DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_notify (user_id, is_read)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS system_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id VARCHAR(36) NOT NULL,
    admin_name VARCHAR(100) NOT NULL,
    action VARCHAR(150) NOT NULL,
    entity VARCHAR(200) NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB;
