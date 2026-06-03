# Database Migration Checklist

## Overview
This document lists all tables that need to be created in the database based on the models defined in the codebase.

---

## ✅ Training Tables (NEW)
**Migration File:** `migrations/create_training_tables.sql`

| Table Name | Purpose | Status |
|------------|---------|--------|
| `curriculums` | Store training curriculum data (WAJIB/REGULER) | ⏳ Pending |
| `materials` | Store training materials (AUDIO/VIDEO/DOCUMENT) | ⏳ Pending |
| `evaluations` | Store member evaluation results and scores | ⏳ Pending |
| `material_notes` | Store member notes for each material | ⏳ Pending |
| `rankings` | Store member rankings in training system | ⏳ Pending |

---

## ✅ Landing Page Tables (NEW)
**Migration File:** `migrations/create_landing_tables.sql`

| Table Name | Purpose | Status |
|------------|---------|--------|
| `landing_services` | Store landing page services data | ⏳ Pending |
| `landing_stats` | Store landing page statistics | ⏳ Pending |
| `landing_about` | Store about us information (vision, mission) | ⏳ Pending |
| `landing_contact` | Store contact information | ⏳ Pending |
| `contact_forms` | Store contact form submissions | ⏳ Pending |

---

## ✅ Membership Termination Table (NEW)
**Migration File:** Need to create

| Table Name | Purpose | Status |
|------------|---------|--------|
| `membership_terminations` | Store membership termination requests | ⏳ Pending |

---

## 📋 Existing Tables (Should Already Exist)
These tables should already exist in the database based on existing models:

### Core Tables
- `member_status`
- `members`
- `user_roles`
- `member_role_assignments`
- `member_employments`
- `member_emergency_contacts`
- `member_bank_accounts`
- `member_registrations`
- `accounts`

### Billing Tables
- `bills`
- `bill_items`
- `bill_type`
- `transactions`

### Savings Tables
- `savings`
- `savings_products`
- `member_savings_accounts`
- `savings_transactions`
- `savings_withdrawals`
- `midtrans_disbursements`

### Financing Tables
- `business_profiles`
- `financing_applications`
- `financing_categories`
- `financing_terms`
- `sukuk_issues`
- `sukuk_orders`

### Loan Tables
- `loan_products`
- `member_loans`

### Program Tables
- `program_options`
- `arisan_programs`
- `arisan_batches`
- `arisan_participants`

### Content Tables
- `articles`
- `notifications`
- `activity_logs`
- `push_subscriptions`
- `forgot_password_sessions`
- `password_reset_tokens`

### Approval Tables
- `approval_flows`
- `approval_steps`
- `approval_statuses`
- `approvals`
- `entity_step_approvals`

### Transaction Tables
- `general_transactions`

---

## 🚨 Migration Files to Execute

### Priority 1: Training System
```bash
mysql -u username -p database_name < migrations/create_training_tables.sql
```

### Priority 2: Landing Page
```bash
mysql -u username -p database_name < migrations/create_landing_tables.sql
```

### Priority 3: Membership Termination
```sql
-- Need to create this migration file
CREATE TABLE IF NOT EXISTS membership_terminations (
    termination_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(36) NOT NULL,
    reason TEXT NOT NULL,
    supporting_document_path TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') DEFAULT 'PENDING',
    approval_flow_id BIGINT,
    current_step_id BIGINT,
    receipt_id VARCHAR(100),
    payment_status ENUM('PENDING', 'PAID', 'FAILED'),
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE,
    INDEX idx_member_id (member_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 📝 Notes

1. **Foreign Keys**: All tables with foreign keys reference existing tables. Ensure parent tables exist before running migrations.

2. **Character Set**: All tables use `utf8mb4` with `utf8mb4_unicode_ci` collation for full Unicode support.

3. **Indexes**: Appropriate indexes have been added for performance optimization.

4. **Timestamps**: All tables use `created_at` and `updated_at` with automatic timestamp management.

5. **Soft Deletes**: No soft delete implementation currently. Consider adding `deleted_at` columns if needed.

---

## ✅ Verification Steps

After running migrations, verify with:

```sql
-- Check training tables
SHOW TABLES LIKE 'curriculums';
SHOW TABLES LIKE 'materials';
SHOW TABLES LIKE 'evaluations';
SHOW TABLES LIKE 'material_notes';
SHOW TABLES LIKE 'rankings';

-- Check landing tables
SHOW TABLES LIKE 'landing_services';
SHOW TABLES LIKE 'landing_stats';
SHOW TABLES LIKE 'landing_about';
SHOW TABLES LIKE 'landing_contact';
SHOW TABLES LIKE 'contact_forms';

-- Check membership termination table
SHOW TABLES LIKE 'membership_terminations';
```

---

## 🔄 Rollback Plan

If rollback is needed:

```sql
DROP TABLE IF EXISTS rankings;
DROP TABLE IF EXISTS material_notes;
DROP TABLE IF EXISTS evaluations;
DROP TABLE IF EXISTS materials;
DROP TABLE IF EXISTS curriculums;

DROP TABLE IF EXISTS contact_forms;
DROP TABLE IF EXISTS landing_contact;
DROP TABLE IF EXISTS landing_about;
DROP TABLE IF EXISTS landing_stats;
DROP TABLE IF EXISTS landing_services;

DROP TABLE IF EXISTS membership_terminations;
```
