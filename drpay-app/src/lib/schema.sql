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

-- System Deposit Accounts (Bank/Wallets for merchants to pay to)
CREATE TABLE IF NOT EXISTS system_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- bank, wallet
    number TEXT NOT NULL,
    instructions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
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
    status dep_status DEFAULT 'pending',
    notes TEXT,
    proof_url TEXT, -- Proof image
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES profiles(id),
    subject TEXT NOT NULL,
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

-- 7. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. FUNCTIONS (RPC)
CREATE OR REPLACE FUNCTION deduct_balance(p_merchant_id UUID, p_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles
    SET balance = balance - p_amount
    WHERE id = p_merchant_id AND balance >= p_amount;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Insufficient balance or merchant not found';
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_balance(p_merchant_id UUID, p_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles
    SET balance = balance + p_amount
    WHERE id = p_merchant_id;
END;
$$ LANGUAGE plpgsql;

-- 9. INITIAL DATA
INSERT INTO system_settings (key, value) VALUES 
('maintenance_mode', 'false'),
('global_notice', '"Welcome to Dr. Pay Professional Platform"')
ON CONFLICT (key) DO NOTHING;
