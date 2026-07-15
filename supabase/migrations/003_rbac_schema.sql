-- ==============================================================================
-- XORVIN — Enterprise RBAC Schema (Part 1: Enums)
-- Run this script first, BEFORE Part 2.
-- PostgreSQL requires new enum values to be committed before they can be used.
-- ==============================================================================

-- Add new roles to the existing user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'event_manager';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'content_manager';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'interviewer';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'judge';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'mentor';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'guest';

-- End of Part 1. Run this now, then proceed to run Part 2.
