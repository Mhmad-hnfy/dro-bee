-- =====================================================
-- Fix Infinite Recursion in RLS Policies
-- =====================================================

-- 1. Create a secure function to check if the current user is an admin
-- This function runs with SECURITY DEFINER, meaning it bypasses RLS
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM users
    WHERE id::text = auth.uid()::text
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the problematic policies that caused recursion
DROP POLICY IF EXISTS "Admin full access to users" ON users;
DROP POLICY IF EXISTS "Admin can manage categories" ON categories;
DROP POLICY IF EXISTS "Admin and staff can manage products" ON products;
DROP POLICY IF EXISTS "Admin and staff can manage orders" ON orders;
DROP POLICY IF EXISTS "Admin can manage order items" ON order_items;
DROP POLICY IF EXISTS "Admin can manage promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Admin can manage settings" ON settings;

-- 3. Recreate policies using the new is_admin() function to avoid recursion

-- Users Table
CREATE POLICY "Admin full access to users" ON users
    FOR ALL USING (is_admin());

-- Categories Table
CREATE POLICY "Admin can manage categories" ON categories
    FOR ALL USING (is_admin());

-- Products Table
-- Note: We simplify this to admin only for now to fix recursion, 
-- or we can create is_staff() similarly if needed. 
-- Assuming admin/staff are similar for this fix:
CREATE POLICY "Admin and staff can manage products" ON products
    FOR ALL USING (is_admin() OR EXISTS (
        SELECT 1 FROM users 
        WHERE id::text = auth.uid()::text 
        AND role = 'staff'
    )); 
-- The above still has recursion for staff if not careful, let's make a safe function for staff too if needed.
-- But for now, let's just fix the reported admin recursion.

-- Better approach: Create a generic get_my_role() function

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM users
  WHERE id::text = auth.uid()::text;
  RETURN v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now recreate policies using get_my_role()

-- Products
DROP POLICY IF EXISTS "Admin and staff can manage products" ON products;
CREATE POLICY "Admin and staff can manage products" ON products
    FOR ALL USING (
        get_my_role() IN ('admin', 'staff')
    );

-- Orders
DROP POLICY IF EXISTS "Admin and staff can manage orders" ON orders;
CREATE POLICY "Admin and staff can manage orders" ON orders
    FOR ALL USING (
        get_my_role() IN ('admin', 'staff')
    );
    
-- Update "Users can view own orders" to use get_my_role
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (
        user_id::text = auth.uid()::text OR
        get_my_role() IN ('admin', 'staff')
    );

-- Order Items
DROP POLICY IF EXISTS "Admin can manage order items" ON order_items;
CREATE POLICY "Admin can manage order items" ON order_items
    FOR ALL USING (
        get_my_role() = 'admin'
    );
    
-- Update "Users can view own order items"
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id::text = auth.uid()::text
        ) OR
        get_my_role() IN ('admin', 'staff')
    );

-- Promo Codes
DROP POLICY IF EXISTS "Admin can manage promo codes" ON promo_codes;
CREATE POLICY "Admin can manage promo codes" ON promo_codes
    FOR ALL USING (
        get_my_role() = 'admin'
    );
    
-- Update "Active promo codes are viewable"
DROP POLICY IF EXISTS "Active promo codes are viewable" ON promo_codes;
CREATE POLICY "Active promo codes are viewable" ON promo_codes
    FOR SELECT USING (
        is_active = true OR
        get_my_role() = 'admin'
    );

-- Settings
DROP POLICY IF EXISTS "Admin can manage settings" ON settings;
CREATE POLICY "Admin can manage settings" ON settings
    FOR ALL USING (
        get_my_role() = 'admin'
    );
