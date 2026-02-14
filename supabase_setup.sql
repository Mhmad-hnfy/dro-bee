-- =====================================================
-- Supabase Database Setup for E-commerce Platform
-- =====================================================
-- This script creates all necessary tables, relationships, and policies
-- for the e-commerce application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'staff')),
    permissions TEXT[], -- Array of permission strings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- 2. CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(5, 2) DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    category VARCHAR(255),
    image TEXT, -- URL or base64 image data
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (category) REFERENCES categories(name) ON UPDATE CASCADE ON DELETE SET NULL
);

-- Indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_views ON products(views DESC);

-- =====================================================
-- 4. ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    user_name VARCHAR(255), -- For guest orders
    user_email VARCHAR(255), -- For guest orders
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    promo_discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    promo_code VARCHAR(100),
    -- Customer details
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_city VARCHAR(255),
    customer_postal_code VARCHAR(50),
    customer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- =====================================================
-- 5. ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(5, 2) DEFAULT 0,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Index for faster order item lookups
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- =====================================================
-- 6. PROMO CODES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    discount DECIMAL(5, 2) NOT NULL CHECK (discount >= 0 AND discount <= 100),
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    max_usage INTEGER, -- NULL means unlimited
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for code lookups
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(is_active);

-- =====================================================
-- 7. SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
    ('shipping_cost', '10', 'Default shipping cost in currency units')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 8. CART TABLE (Optional - for persistent carts)
-- =====================================================
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id) -- One entry per product per user
);

-- Index for cart lookups
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS POLICIES
-- =====================================================
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text OR role = 'admin');

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Admin can do everything
CREATE POLICY "Admin full access to users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
        )
    );

-- Allow user registration (insert)
CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- CATEGORIES POLICIES
-- =====================================================
-- Everyone can read categories
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- Only admin can modify categories
CREATE POLICY "Admin can manage categories" ON categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
        )
    );

-- =====================================================
-- PRODUCTS POLICIES
-- =====================================================
-- Everyone can read products
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

-- Admin and staff can manage products
CREATE POLICY "Admin and staff can manage products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND (role = 'admin' OR role = 'staff')
        )
    );

-- =====================================================
-- ORDERS POLICIES
-- =====================================================
-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (
        user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND (role = 'admin' OR role = 'staff')
        )
    );

-- Users can create orders
CREATE POLICY "Users can create orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Admin and staff can manage all orders
CREATE POLICY "Admin and staff can manage orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND (role = 'admin' OR role = 'staff')
        )
    );

-- =====================================================
-- ORDER ITEMS POLICIES
-- =====================================================
-- Users can view items from their orders
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id::text = auth.uid()::text
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND (role = 'admin' OR role = 'staff')
        )
    );

-- Allow order item creation
CREATE POLICY "Allow order item creation" ON order_items
    FOR INSERT WITH CHECK (true);

-- Admin can manage all order items
CREATE POLICY "Admin can manage order items" ON order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- =====================================================
-- PROMO CODES POLICIES
-- =====================================================
-- Everyone can read active promo codes
CREATE POLICY "Active promo codes are viewable" ON promo_codes
    FOR SELECT USING (is_active = true OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Only admin can manage promo codes
CREATE POLICY "Admin can manage promo codes" ON promo_codes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- =====================================================
-- SETTINGS POLICIES
-- =====================================================
-- Everyone can read settings
CREATE POLICY "Settings are viewable by everyone" ON settings
    FOR SELECT USING (true);

-- Only admin can modify settings
CREATE POLICY "Admin can manage settings" ON settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- =====================================================
-- CART ITEMS POLICIES
-- =====================================================
-- Users can manage their own cart
CREATE POLICY "Users can manage own cart" ON cart_items
    FOR ALL USING (user_id::text = auth.uid()::text);

-- =====================================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- =====================================================

-- Function to increment product views
CREATE OR REPLACE FUNCTION increment_product_views(product_id BIGINT)
RETURNS void AS $$
BEGIN
    UPDATE products 
    SET views = views + 1 
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to validate promo code
CREATE OR REPLACE FUNCTION validate_promo_code(code_input VARCHAR)
RETURNS TABLE(is_valid BOOLEAN, discount DECIMAL, message TEXT) AS $$
DECLARE
    promo RECORD;
BEGIN
    SELECT * INTO promo FROM promo_codes WHERE code = UPPER(code_input);
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Promo code not found'::TEXT;
        RETURN;
    END IF;
    
    IF NOT promo.is_active THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Promo code is inactive'::TEXT;
        RETURN;
    END IF;
    
    IF promo.expires_at IS NOT NULL AND promo.expires_at < NOW() THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Promo code has expired'::TEXT;
        RETURN;
    END IF;
    
    IF promo.max_usage IS NOT NULL AND promo.usage_count >= promo.max_usage THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Promo code usage limit reached'::TEXT;
        RETURN;
    END IF;
    
    RETURN QUERY SELECT true, promo.discount, 'Valid promo code'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to increment promo code usage
CREATE OR REPLACE FUNCTION increment_promo_usage(code_input VARCHAR)
RETURNS void AS $$
BEGIN
    UPDATE promo_codes 
    SET usage_count = usage_count + 1 
    WHERE code = UPPER(code_input);
END;
$$ LANGUAGE plpgsql;

-- Function to decrement product stock
CREATE OR REPLACE FUNCTION decrement_stock(product_id BIGINT, quantity INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE products 
    SET stock = GREATEST(0, stock - quantity)
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert default categories
INSERT INTO categories (name) VALUES
    ('Men'),
    ('Accessories'),
    ('Other')
ON CONFLICT (name) DO NOTHING;

-- Insert admin user (you should change this password!)
INSERT INTO users (id, name, email, password, role, permissions) VALUES
    (0, 'Admin', 'hmwhnfy3@gmail.com', '29112003', 'admin', 
     ARRAY['dashboard', 'orders', 'notifications', 'products', 'categories', 'users', 'staff'])
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================
COMMENT ON TABLE users IS 'Stores user accounts including customers, staff, and admins';
COMMENT ON TABLE categories IS 'Product categories for organizing the catalog';
COMMENT ON TABLE products IS 'Product catalog with pricing, stock, and images';
COMMENT ON TABLE orders IS 'Customer orders with shipping and payment details';
COMMENT ON TABLE order_items IS 'Individual items within each order';
COMMENT ON TABLE promo_codes IS 'Promotional discount codes';
COMMENT ON TABLE settings IS 'Application-wide settings and configuration';
COMMENT ON TABLE cart_items IS 'Persistent shopping cart items for logged-in users';

-- =====================================================
-- COMPLETED!
-- =====================================================
-- To use this schema:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire script
-- 4. Click "Run" to execute
-- 5. Verify all tables are created in the Table Editor
-- =====================================================
