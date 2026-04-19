-- Dr. Pay Professional Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Transactions - Professional logging
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_id TEXT UNIQUE NOT NULL, -- Logical ID (e.g., DP231223ABCD)
    bid TEXT, -- Provider reference (Bill ID)
    service_name TEXT NOT NULL,
    service_code TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    fee DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL, -- YES (Success), ERR (Error), PND (Pending)
    mobile TEXT, -- Target mobile or account number
    response_data JSONB, -- Full JSON response from e-misr
    merchant_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Balance History - Track every penny
CREATE TABLE IF NOT EXISTS balance_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL(10, 2) NOT NULL, -- Current balance
    change DECIMAL(10, 2), -- Difference from last update
    transaction_id UUID REFERENCES transactions(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Agent Configuration - Session management
CREATE TABLE IF NOT EXISTS agent_config (
    key TEXT PRIMARY KEY,
    value JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Merchant Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT,
    account_id TEXT, -- e-misr merchant code
    national_id TEXT, -- 14 digits
    phone TEXT,
    address TEXT, -- Detailed address
    id_front_url TEXT, -- ID image front
    id_back_url TEXT, -- ID image back
    status TEXT DEFAULT 'pending', -- pending, active, suspended, rejected
    rejection_reason TEXT, -- Reason if rejected
    is_admin BOOLEAN DEFAULT FALSE, -- Admin flag
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_config ENABLE ROW LEVEL SECURITY;

-- Governance Policies
CREATE POLICY "Users can only see their own transactions" 
ON transactions FOR SELECT USING (auth.uid() = merchant_id);

CREATE POLICY "Users can only see their own profile" 
ON profiles FOR SELECT USING (auth.uid() = id);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_transactions_api_id ON transactions(api_id);
CREATE INDEX IF NOT EXISTS idx_transactions_merchant ON transactions(merchant_id);
