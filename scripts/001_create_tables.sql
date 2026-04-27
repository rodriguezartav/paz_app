-- Paz Operations Database Schema
-- This creates all tables for the retreat management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- RESIDENTS / GUESTS
-- ============================================
CREATE TABLE IF NOT EXISTS residents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  emergency_contact TEXT,
  nationality TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  age INTEGER,
  diet TEXT CHECK (diet IN ('eats_all', 'vegetarian', 'vegan')) DEFAULT 'eats_all',
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  status TEXT CHECK (status IN ('upcoming', 'checked_in', 'staying', 'checking_out_today', 'checked_out', 'cancelled')) DEFAULT 'upcoming',
  room TEXT,
  bed TEXT,
  check_in_completed BOOLEAN DEFAULT FALSE,
  release_accepted BOOLEAN DEFAULT FALSE,
  health_insurance_confirmed BOOLEAN DEFAULT FALSE,
  media_release_accepted BOOLEAN DEFAULT FALSE,
  orientation_completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INGREDIENTS
-- ============================================
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('produce', 'protein', 'dairy', 'grains', 'pantry', 'spices', 'other')) DEFAULT 'other',
  unit TEXT NOT NULL,
  current_stock NUMERIC DEFAULT 0,
  par_level NUMERIC DEFAULT 0,
  supplier TEXT,
  local_source BOOLEAN DEFAULT FALSE,
  is_allergen BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RECIPES
-- ============================================
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage')) DEFAULT 'lunch',
  servings INTEGER DEFAULT 1,
  prep_time INTEGER, -- minutes
  cook_time INTEGER, -- minutes
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  instructions TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recipe Ingredients (junction table)
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT,
  UNIQUE(recipe_id, ingredient_id)
);

-- ============================================
-- MEAL PLANNER
-- ============================================
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  custom_meal_name TEXT, -- for non-recipe meals
  servings INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, meal_type)
);

-- Meal Templates
CREATE TABLE IF NOT EXISTS meal_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meal_template_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID NOT NULL REFERENCES meal_templates(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  custom_meal_name TEXT
);

-- ============================================
-- INVENTORY / WASTE
-- ============================================
CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity_change NUMERIC NOT NULL, -- positive for additions, negative for removals
  log_type TEXT CHECK (log_type IN ('purchase', 'usage', 'waste', 'adjustment')) NOT NULL,
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  logged_by UUID -- reference to team member
);

CREATE TABLE IF NOT EXISTS waste_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity NUMERIC NOT NULL,
  reason TEXT CHECK (reason IN ('expired', 'spoiled', 'overproduction', 'other')) DEFAULT 'other',
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  logged_by UUID
);

-- ============================================
-- SHOPPING
-- ============================================
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  is_local BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shopping_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status TEXT CHECK (status IN ('draft', 'pending', 'ordered', 'received')) DEFAULT 'draft',
  for_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shopping_list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopping_list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE SET NULL,
  custom_item_name TEXT,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  is_checked BOOLEAN DEFAULT FALSE,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  shopping_list_id UUID REFERENCES shopping_lists(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'shipped', 'received', 'cancelled')) DEFAULT 'pending',
  order_date TIMESTAMPTZ DEFAULT NOW(),
  expected_date DATE,
  received_date TIMESTAMPTZ,
  total_amount NUMERIC,
  currency TEXT DEFAULT 'CRC',
  notes TEXT
);

-- ============================================
-- TEAM
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID, -- reference to auth.users if they have login access
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('admin', 'chef', 'kitchen_staff', 'host', 'maintenance', 'volunteer')) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  start_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  shift_type TEXT CHECK (shift_type IN ('morning', 'afternoon', 'evening', 'full_day', 'off')) NOT NULL,
  start_time TIME,
  end_time TIME,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('kitchen', 'housekeeping', 'maintenance', 'admin', 'other')) DEFAULT 'other',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('todo', 'in_progress', 'done', 'cancelled')) DEFAULT 'todo',
  assigned_to UUID REFERENCES team_members(id) ON DELETE SET NULL,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('retreat_info', '{"name": "Paz Corcovado", "location": "Corcovado, Costa Rica", "capacity": 12, "timezone": "America/Costa_Rica"}'),
  ('meal_times', '{"breakfast": "07:30", "lunch": "12:30", "dinner": "18:30"}'),
  ('notifications', '{"low_stock_alerts": true, "check_in_reminders": true, "task_reminders": true}')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
-- Enable RLS on all tables
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_template_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies (allow authenticated users to access all data)
-- In a real app, you'd have more granular policies based on roles

CREATE POLICY "Allow authenticated read" ON residents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON residents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON residents FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON residents FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON ingredients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON ingredients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON ingredients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON ingredients FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON recipes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON recipes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON recipes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON recipes FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON recipe_ingredients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON recipe_ingredients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON recipe_ingredients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON recipe_ingredients FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON meal_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON meal_plans FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON meal_plans FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON meal_plans FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON meal_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON meal_templates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON meal_templates FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON meal_templates FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON meal_template_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON meal_template_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON meal_template_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON meal_template_items FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON inventory_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON inventory_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON inventory_logs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON inventory_logs FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON waste_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON waste_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON waste_logs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON waste_logs FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON suppliers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON suppliers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON suppliers FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON shopping_lists FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON shopping_lists FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON shopping_lists FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON shopping_lists FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON shopping_list_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON shopping_list_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON shopping_list_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON shopping_list_items FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON purchase_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON purchase_orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON purchase_orders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON purchase_orders FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON team_members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON team_members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON team_members FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON team_schedule FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON team_schedule FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON team_schedule FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON team_schedule FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON tasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON tasks FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON settings FOR DELETE TO authenticated USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_residents_status ON residents(status);
CREATE INDEX IF NOT EXISTS idx_residents_dates ON residents(arrival_date, departure_date);
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_meal_plans_date ON meal_plans(date);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_team_schedule_date ON team_schedule(date);
