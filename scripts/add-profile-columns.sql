-- Migration: Add missing columns to profiles table
-- Run this if you've already executed setup-database.sql

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS privacy_agreed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS privacy_agreed_at TIMESTAMP WITH TIME ZONE;
