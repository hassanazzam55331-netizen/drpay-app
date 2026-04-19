-- ==========================================
-- Dr. Pay Pro - Complete Database Schema
-- ==========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & TYPES
DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended', 'rejected');
    CREATE TYPE tx_status AS ENUM ('YES', 'ERR', 'PND', 'INF');
    CREATE TYPE dep_status AS ENUM ('pending', 'confirmed', 'rejected');
    CREATE TYPE ticket_status AS ENUM ('open', 'replied', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. MERCHANT PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    store_name TEXT,
    account_id TEXT UNIQUE, -- Merchant Code (e.g. 1001)
    national_id TEXT,
    phone TEXT UNIQUE,
    phone_2 TEXT,
    address TEXT,
    governorate TEXT,
    latitude FLOAT,
    longitude FLOAT,
    device_info JSONB,
    balance DECIMAL(12, 2) DEFAULT 0.00,
    bonus_balance DECIMAL(12, 2) DEFAULT 0.00,
    status user_status DEFAULT 'pending',
    is_admin BOOLEAN DEFAULT FALSE,
    id_front_url TEXT,
    id_back_url TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_id TEXT UNIQUE NOT NULL, -- Logical ID (DP-...)
    bid TEXT, -- External Bill ID
    merchant_id UUID REFERENCES profiles(id),
    service_name TEXT NOT NULL,
    service_code TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    fee DECIMAL(12, 2) DEFAULT 0.00,
    total_amount DECIMAL(12, 2) NOT NULL,
    status tx_status DEFAULT 'PND',
    mobile TEXT, -- Target number
    provider_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. DEPOSITS & FUNDING
CREATE TABLE IF NOT EXISTS deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES profiles(id),
    amount DECIMAL(12, 2) NOT NULL,
    payment_method TEXT NOT NULL, -- Vodafone Cash, Bank, etc
    proof_url TEXT, -- Proof image
    status dep_status DEFAULT 'pending',
    admin_note TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. OFFICIAL RECEIVING ACCOUNTS (Configured by Admin)
CREATE TABLE IF NOT EXISTS official_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- Bank, Wallet
    number TEXT NOT NULL,
    instructions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES profiles(id),
    subject TEXT NOT NULL,
    priority TEXT DEFAULT 'normal',
    status ticket_status DEFAULT 'open',
    last_reply_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES tickets(id),
    sender_id UUID REFERENCES profiles(id),
    message TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. SERVICE OVERRIDES (Admin Control)
CREATE TABLE IF NOT EXISTS service_overrides (
    service_code TEXT PRIMARY KEY,
    custom_fee DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. POLICIES & SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Simplified for prototype)
CREATE POLICY "Public profile access" ON profiles FOR SELECT USING (true);
CREATE POLICY "Merchant transaction access" ON transactions FOR SELECT USING (auth.uid() = merchant_id OR (SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- 11. INITIAL SEEDING
INSERT INTO system_settings (key, value) 
VALUES ('PAYMENT_MODE', '{"mode": "FULL_SYNC"}')
ON CONFLICT (key) DO NOTHING;

-- 12. RPC FUNCTIONS
CREATE OR REPLACE FUNCTION deduct_balance(m_id UUID, amount DECIMAL)
RETURNS void AS $$
BEGIN
    UPDATE profiles
    SET balance = balance - amount
    WHERE id = m_id;
END;
$$ LANGUAGE plpgsql;

-- 13. BOOTSTRAP ADMINISTRATOR
-- Replace UUID with actual Auth ID after first registration
-- INSERT INTO profiles (id, full_name, account_id, is_admin, status)
-- VALUES ('YOUR_AUTH_ID', 'مدير النظام', 'ADMIN-1', true, 'active');


CREATE OR REPLACE FUNCTION add_balance(m_id UUID, amount DECIMAL)
RETURNS void AS $$
BEGIN
    UPDATE profiles
    SET balance = balance + amount
    WHERE id = m_id;
END;
$$ LANGUAGE plpgsql;

