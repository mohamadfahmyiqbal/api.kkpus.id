-- Table untuk tracking login attempts
CREATE TABLE IF NOT EXISTS login_attempts (
    attempt_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email_or_phone VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    success BOOLEAN NOT NULL DEFAULT FALSE,
    member_id VARCHAR(36) NULL,
    failure_reason VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email_phone (email_or_phone),
    INDEX idx_ip_address (ip_address),
    INDEX idx_created_at (created_at),
    INDEX idx_success (success),
    INDEX idx_member_id (member_id)
);

-- Table untuk account lockouts (optional, untuk implementasi yang lebih advanced)
CREATE TABLE IF NOT EXISTS account_lockouts (
    lockout_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email_or_phone VARCHAR(255) NOT NULL UNIQUE,
    lockout_reason VARCHAR(255) NOT NULL,
    lockout_start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lockout_end TIMESTAMP NOT NULL,
    failed_attempts INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email_lockout (email_or_phone),
    INDEX idx_lockout_end (lockout_end),
    INDEX idx_is_active (is_active)
);

-- View untuk monitoring login attempts
CREATE OR REPLACE VIEW login_attempts_summary AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_attempts,
    SUM(CASE WHEN success = TRUE THEN 1 ELSE 0 END) as successful_logins,
    SUM(CASE WHEN success = FALSE THEN 1 ELSE 0 END) as failed_logins,
    COUNT(DISTINCT email_or_phone) as unique_users,
    COUNT(DISTINCT ip_address) as unique_ips
FROM login_attempts 
WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- View untuk suspicious activities
CREATE OR REPLACE VIEW suspicious_activities AS
SELECT 
    email_or_phone,
    COUNT(*) as failed_attempts,
    COUNT(DISTINCT ip_address) as unique_ips,
    MAX(created_at) as last_attempt
FROM login_attempts 
WHERE success = FALSE 
    AND created_at >= NOW() - INTERVAL '24 hours'
GROUP BY email_or_phone
HAVING failed_attempts >= 5 OR unique_ips >= 3
ORDER BY failed_attempts DESC, last_attempt DESC;
