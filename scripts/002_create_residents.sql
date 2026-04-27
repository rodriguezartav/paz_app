-- Residents table
CREATE TABLE IF NOT EXISTS residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Enable RLS
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated read" ON residents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON residents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON residents FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON residents FOR DELETE TO authenticated USING (true);

-- Create index
CREATE INDEX IF NOT EXISTS idx_residents_status ON residents(status);
CREATE INDEX IF NOT EXISTS idx_residents_dates ON residents(arrival_date, departure_date);
