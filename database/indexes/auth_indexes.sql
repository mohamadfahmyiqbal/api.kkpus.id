-- Database optimization indexes for authentication system
-- Run these queries to improve login performance

-- Composite index for email/phone lookup in login
CREATE INDEX IF NOT EXISTS idx_members_email_phone ON members(email, phone_number);

-- Individual indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_phone_number ON members(phone_number);

-- Index for member status filtering
CREATE INDEX IF NOT EXISTS idx_members_status_id ON members(status_id);

-- Index for member_no lookup
CREATE INDEX IF NOT EXISTS idx_members_member_no ON members(member_no);

-- Unique constraint for email (if not already exists)
ALTER TABLE members ADD CONSTRAINT uc_members_email UNIQUE (email) IF NOT EXISTS;

-- Unique constraint for phone_number (optional, depending on business requirements)
-- ALTER TABLE members ADD CONSTRAINT uc_members_phone UNIQUE (phone_number) IF NOT EXISTS;

-- Index for NIK KTP (if frequently searched)
CREATE INDEX IF NOT EXISTS idx_members_nik_ktp ON members(nik_ktp);

-- Partial index for active members only (better performance)
CREATE INDEX IF NOT EXISTS idx_members_active ON members(email, member_no) WHERE status_id = 1;

-- Index for join_date (if frequently used in reporting)
CREATE INDEX IF NOT EXISTS idx_members_join_date ON members(join_date);

-- Analyze tables to update query planner statistics
ANALYZE members;

-- Query to check index usage after implementation
-- SELECT 
--     schemaname,
--     tablename,
--     indexname,
--     idx_scan,
--     idx_tup_read,
--     idx_tup_fetch
-- FROM pg_stat_user_indexes 
-- WHERE tablename = 'members' 
-- ORDER BY idx_scan DESC;
