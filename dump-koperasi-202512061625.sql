-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 202.52.147.193    Database: koperasi
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `account_id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `account_type` varchar(50) DEFAULT NULL,
  `account_no` varchar(50) DEFAULT NULL,
  `open_date` date DEFAULT NULL,
  `akad_type` varchar(50) DEFAULT NULL,
  `current_balance` decimal(18,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `account_no` (`account_no`),
  KEY `fk_account_member` (`member_id`),
  CONSTRAINT `fk_account_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `activity_id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `activity_type` varchar(100) DEFAULT NULL,
  `activity_datetime` datetime DEFAULT NULL,
  `detail` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`activity_id`),
  KEY `fk_activity_member` (`member_id`),
  CONSTRAINT `fk_activity_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approval_flows`
--

DROP TABLE IF EXISTS `approval_flows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_flows` (
  `approval_flow_id` bigint NOT NULL AUTO_INCREMENT,
  `flow_name` varchar(255) DEFAULT NULL,
  `entity_ref` varchar(100) DEFAULT NULL,
  `entity_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`approval_flow_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_flows`
--

LOCK TABLES `approval_flows` WRITE;
/*!40000 ALTER TABLE `approval_flows` DISABLE KEYS */;
/*!40000 ALTER TABLE `approval_flows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approval_steps`
--

DROP TABLE IF EXISTS `approval_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_steps` (
  `approval_step_id` bigint NOT NULL AUTO_INCREMENT,
  `approval_flow_id` bigint NOT NULL,
  `step_order` int DEFAULT NULL,
  `role_id` bigint DEFAULT NULL,
  `step_name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`approval_step_id`),
  KEY `fk_step_flow` (`approval_flow_id`),
  KEY `fk_step_role` (`role_id`),
  CONSTRAINT `fk_step_flow` FOREIGN KEY (`approval_flow_id`) REFERENCES `approval_flows` (`approval_flow_id`),
  CONSTRAINT `fk_step_role` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_steps`
--

LOCK TABLES `approval_steps` WRITE;
/*!40000 ALTER TABLE `approval_steps` DISABLE KEYS */;
/*!40000 ALTER TABLE `approval_steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approvals`
--

DROP TABLE IF EXISTS `approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approvals` (
  `approval_id` bigint NOT NULL AUTO_INCREMENT,
  `approval_step_id` bigint NOT NULL,
  `approver_member_id` bigint NOT NULL,
  `decision` varchar(50) DEFAULT NULL,
  `decision_datetime` datetime DEFAULT NULL,
  `note` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`approval_id`),
  KEY `fk_approval_step` (`approval_step_id`),
  KEY `fk_approval_member` (`approver_member_id`),
  CONSTRAINT `fk_approval_member` FOREIGN KEY (`approver_member_id`) REFERENCES `members` (`member_id`),
  CONSTRAINT `fk_approval_step` FOREIGN KEY (`approval_step_id`) REFERENCES `approval_steps` (`approval_step_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approvals`
--

LOCK TABLES `approvals` WRITE;
/*!40000 ALTER TABLE `approvals` DISABLE KEYS */;
/*!40000 ALTER TABLE `approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arisan_batches`
--

DROP TABLE IF EXISTS `arisan_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arisan_batches` (
  `arisan_batch_id` bigint NOT NULL AUTO_INCREMENT,
  `arisan_program_id` bigint NOT NULL,
  `batch_name` varchar(255) DEFAULT NULL,
  `period_start_month` int DEFAULT NULL,
  `period_start_year` int DEFAULT NULL,
  `participants_quota` int DEFAULT NULL,
  `max_departure_people` int DEFAULT NULL,
  `travel_cost_per_person` decimal(18,2) DEFAULT NULL,
  `per_person_installment` decimal(18,2) DEFAULT NULL,
  `monthly_installment` decimal(18,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`arisan_batch_id`),
  KEY `fk_arisan_batch_program` (`arisan_program_id`),
  CONSTRAINT `fk_arisan_batch_program` FOREIGN KEY (`arisan_program_id`) REFERENCES `arisan_programs` (`arisan_program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arisan_batches`
--

LOCK TABLES `arisan_batches` WRITE;
/*!40000 ALTER TABLE `arisan_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `arisan_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arisan_bills`
--

DROP TABLE IF EXISTS `arisan_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arisan_bills` (
  `arisan_bill_id` bigint NOT NULL AUTO_INCREMENT,
  `arisan_participant_id` bigint NOT NULL,
  `installment_no` int DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `due_datetime` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`arisan_bill_id`),
  KEY `fk_arisan_bill_participant` (`arisan_participant_id`),
  CONSTRAINT `fk_arisan_bill_participant` FOREIGN KEY (`arisan_participant_id`) REFERENCES `arisan_participants` (`arisan_participant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arisan_bills`
--

LOCK TABLES `arisan_bills` WRITE;
/*!40000 ALTER TABLE `arisan_bills` DISABLE KEYS */;
/*!40000 ALTER TABLE `arisan_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arisan_participants`
--

DROP TABLE IF EXISTS `arisan_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arisan_participants` (
  `arisan_participant_id` bigint NOT NULL AUTO_INCREMENT,
  `arisan_batch_id` bigint NOT NULL,
  `member_id` bigint NOT NULL,
  `participant_no` int DEFAULT NULL,
  `saldo_putang` decimal(18,2) DEFAULT NULL,
  `cicilan_target` decimal(18,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`arisan_participant_id`),
  KEY `fk_arisan_participant_batch` (`arisan_batch_id`),
  KEY `fk_arisan_participant_member` (`member_id`),
  CONSTRAINT `fk_arisan_participant_batch` FOREIGN KEY (`arisan_batch_id`) REFERENCES `arisan_batches` (`arisan_batch_id`),
  CONSTRAINT `fk_arisan_participant_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arisan_participants`
--

LOCK TABLES `arisan_participants` WRITE;
/*!40000 ALTER TABLE `arisan_participants` DISABLE KEYS */;
/*!40000 ALTER TABLE `arisan_participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arisan_payments`
--

DROP TABLE IF EXISTS `arisan_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arisan_payments` (
  `arisan_payment_id` bigint NOT NULL AUTO_INCREMENT,
  `arisan_bill_id` bigint NOT NULL,
  `paid_datetime` datetime DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`arisan_payment_id`),
  KEY `fk_arisan_payment_bill` (`arisan_bill_id`),
  CONSTRAINT `fk_arisan_payment_bill` FOREIGN KEY (`arisan_bill_id`) REFERENCES `arisan_bills` (`arisan_bill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arisan_payments`
--

LOCK TABLES `arisan_payments` WRITE;
/*!40000 ALTER TABLE `arisan_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `arisan_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arisan_programs`
--

DROP TABLE IF EXISTS `arisan_programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arisan_programs` (
  `arisan_program_id` bigint NOT NULL AUTO_INCREMENT,
  `program_name` varchar(255) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `target_amount` decimal(18,2) DEFAULT NULL,
  `term_months` int DEFAULT NULL,
  `monthly_contribution` decimal(18,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`arisan_program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arisan_programs`
--

LOCK TABLES `arisan_programs` WRITE;
/*!40000 ALTER TABLE `arisan_programs` DISABLE KEYS */;
/*!40000 ALTER TABLE `arisan_programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `article_id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `image_url` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`article_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES (1,'Pinjaman Lunak','Solusi pembiayaan dengan bunga rendah untuk mendukung usaha Anda. Ini adalah deskripsi lengkap. Di frontend, deskripsi ini akan dipotong menjadi ringkasan (text).','https://placehold.co/382x315/007bff/fff?text=Loan','2025-12-05 08:16:55','2025-12-05 08:16:55','PUBLISHED'),(2,'Pelatihan Usaha','Ikuti pelatihan bisnis untuk meningkatkan keterampilan dan jaringan. Detail program pelatihan kami sangat komprehensif dan praktis.','https://placehold.co/382x315/28a745/fff?text=Training','2025-12-05 08:16:55','2025-12-05 08:16:55','PUBLISHED'),(3,'Kemitraan Produk','Bergabung dalam kemitraan distribusi produk lokal unggulan. Kami menyediakan dukungan penuh untuk pemasaran dan operasional.','https://placehold.co/382x315/ffc107/000?text=Partnership','2025-12-05 08:16:55','2025-12-05 08:16:55','PUBLISHED'),(4,'Pendampingan Bisnis','Dapatkan bimbingan langsung dari mentor berpengalaman. Program pendampingan ini dirancang untuk memastikan pertumbuhan usaha yang berkelanjutan.','https://placehold.co/382x315/dc3545/fff?text=Mentoring','2025-12-05 08:16:55','2025-12-05 08:16:55','PUBLISHED');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_profiles`
--

DROP TABLE IF EXISTS `business_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_profiles` (
  `business_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `annual_turnover` decimal(18,2) DEFAULT NULL,
  `address` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_profiles`
--

LOCK TABLES `business_profiles` WRITE;
/*!40000 ALTER TABLE `business_profiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collateral_assets`
--

DROP TABLE IF EXISTS `collateral_assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collateral_assets` (
  `collateral_id` bigint NOT NULL AUTO_INCREMENT,
  `business_id` bigint NOT NULL,
  `asset_type` varchar(100) DEFAULT NULL,
  `ownership_proof_url` text,
  `collateral_proof_url` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`collateral_id`),
  KEY `fk_collateral_business` (`business_id`),
  CONSTRAINT `fk_collateral_business` FOREIGN KEY (`business_id`) REFERENCES `business_profiles` (`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collateral_assets`
--

LOCK TABLES `collateral_assets` WRITE;
/*!40000 ALTER TABLE `collateral_assets` DISABLE KEYS */;
/*!40000 ALTER TABLE `collateral_assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `csr_transactions`
--

DROP TABLE IF EXISTS `csr_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `csr_transactions` (
  `csr_tx_id` bigint NOT NULL AUTO_INCREMENT,
  `tx_date` date DEFAULT NULL,
  `month_label` varchar(50) DEFAULT NULL,
  `doc_no` varchar(50) DEFAULT NULL,
  `pic_member_id` bigint DEFAULT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `debit_amount` decimal(18,2) DEFAULT NULL,
  `credit_amount` decimal(18,2) DEFAULT NULL,
  `balance` decimal(18,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`csr_tx_id`),
  KEY `fk_csr_pic_member` (`pic_member_id`),
  CONSTRAINT `fk_csr_pic_member` FOREIGN KEY (`pic_member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `csr_transactions`
--

LOCK TABLES `csr_transactions` WRITE;
/*!40000 ALTER TABLE `csr_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `csr_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curriculum_tracks`
--

DROP TABLE IF EXISTS `curriculum_tracks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curriculum_tracks` (
  `track_id` bigint NOT NULL AUTO_INCREMENT,
  `track_type` varchar(100) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`track_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curriculum_tracks`
--

LOCK TABLES `curriculum_tracks` WRITE;
/*!40000 ALTER TABLE `curriculum_tracks` DISABLE KEYS */;
/*!40000 ALTER TABLE `curriculum_tracks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exit_refunds`
--

DROP TABLE IF EXISTS `exit_refunds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exit_refunds` (
  `exit_refund_id` bigint NOT NULL AUTO_INCREMENT,
  `exit_request_id` bigint NOT NULL,
  `savings_haji_amount` decimal(18,2) DEFAULT NULL,
  `savings_umrah_amount` decimal(18,2) DEFAULT NULL,
  `savings_sukarela_amount` decimal(18,2) DEFAULT NULL,
  `total_amount` decimal(18,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`exit_refund_id`),
  KEY `fk_exit_refund_request` (`exit_request_id`),
  CONSTRAINT `fk_exit_refund_request` FOREIGN KEY (`exit_request_id`) REFERENCES `membership_exit_requests` (`exit_request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exit_refunds`
--

LOCK TABLES `exit_refunds` WRITE;
/*!40000 ALTER TABLE `exit_refunds` DISABLE KEYS */;
/*!40000 ALTER TABLE `exit_refunds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exit_settlements`
--

DROP TABLE IF EXISTS `exit_settlements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exit_settlements` (
  `exit_settlement_id` bigint NOT NULL AUTO_INCREMENT,
  `exit_request_id` bigint NOT NULL,
  `obligation_name` varchar(255) DEFAULT NULL,
  `total_bill` decimal(18,2) DEFAULT NULL,
  `total_paid` decimal(18,2) DEFAULT NULL,
  `remaining_amount` decimal(18,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`exit_settlement_id`),
  KEY `fk_exit_settlement_request` (`exit_request_id`),
  CONSTRAINT `fk_exit_settlement_request` FOREIGN KEY (`exit_request_id`) REFERENCES `membership_exit_requests` (`exit_request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exit_settlements`
--

LOCK TABLES `exit_settlements` WRITE;
/*!40000 ALTER TABLE `exit_settlements` DISABLE KEYS */;
/*!40000 ALTER TABLE `exit_settlements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financing_applications`
--

DROP TABLE IF EXISTS `financing_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financing_applications` (
  `financing_id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `business_id` bigint NOT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `required_amount` decimal(18,2) DEFAULT NULL,
  `cooperation_months` int DEFAULT NULL,
  `monthly_installment` decimal(18,2) DEFAULT NULL,
  `collateral_type` varchar(100) DEFAULT NULL,
  `akad_type` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`financing_id`),
  KEY `fk_financing_member` (`member_id`),
  KEY `fk_financing_business` (`business_id`),
  CONSTRAINT `fk_financing_business` FOREIGN KEY (`business_id`) REFERENCES `business_profiles` (`business_id`),
  CONSTRAINT `fk_financing_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financing_applications`
--

LOCK TABLES `financing_applications` WRITE;
/*!40000 ALTER TABLE `financing_applications` DISABLE KEYS */;
/*!40000 ALTER TABLE `financing_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financing_bills`
--

DROP TABLE IF EXISTS `financing_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financing_bills` (
  `financing_bill_id` bigint NOT NULL AUTO_INCREMENT,
  `financing_id` bigint NOT NULL,
  `installment_no` int DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `due_datetime` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`financing_bill_id`),
  KEY `fk_financing_bill_app` (`financing_id`),
  CONSTRAINT `fk_financing_bill_app` FOREIGN KEY (`financing_id`) REFERENCES `financing_applications` (`financing_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financing_bills`
--

LOCK TABLES `financing_bills` WRITE;
/*!40000 ALTER TABLE `financing_bills` DISABLE KEYS */;
/*!40000 ALTER TABLE `financing_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financing_disbursements`
--

DROP TABLE IF EXISTS `financing_disbursements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financing_disbursements` (
  `financing_disbursement_id` bigint NOT NULL AUTO_INCREMENT,
  `financing_id` bigint NOT NULL,
  `disbursement_datetime` datetime DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`financing_disbursement_id`),
  KEY `fk_financing_disbursement_app` (`financing_id`),
  CONSTRAINT `fk_financing_disbursement_app` FOREIGN KEY (`financing_id`) REFERENCES `financing_applications` (`financing_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financing_disbursements`
--

LOCK TABLES `financing_disbursements` WRITE;
/*!40000 ALTER TABLE `financing_disbursements` DISABLE KEYS */;
/*!40000 ALTER TABLE `financing_disbursements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financing_payments`
--

DROP TABLE IF EXISTS `financing_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financing_payments` (
  `financing_payment_id` bigint NOT NULL AUTO_INCREMENT,
  `financing_bill_id` bigint NOT NULL,
  `paid_datetime` datetime DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`financing_payment_id`),
  KEY `fk_financing_payment_bill` (`financing_bill_id`),
  CONSTRAINT `fk_financing_payment_bill` FOREIGN KEY (`financing_bill_id`) REFERENCES `financing_bills` (`financing_bill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financing_payments`
--

LOCK TABLES `financing_payments` WRITE;
/*!40000 ALTER TABLE `financing_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `financing_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gl_accounts`
--

DROP TABLE IF EXISTS `gl_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gl_accounts` (
  `gl_account_id` bigint NOT NULL AUTO_INCREMENT,
  `account_code` varchar(50) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `account_type` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`gl_account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gl_accounts`
--

LOCK TABLES `gl_accounts` WRITE;
/*!40000 ALTER TABLE `gl_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `gl_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gl_journal_entries`
--

DROP TABLE IF EXISTS `gl_journal_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gl_journal_entries` (
  `gl_journal_id` bigint NOT NULL AUTO_INCREMENT,
  `journal_date` date DEFAULT NULL,
  `doc_no` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `pic_member_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`gl_journal_id`),
  KEY `fk_journal_pic_member` (`pic_member_id`),
  CONSTRAINT `fk_journal_pic_member` FOREIGN KEY (`pic_member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gl_journal_entries`
--

LOCK TABLES `gl_journal_entries` WRITE;
/*!40000 ALTER TABLE `gl_journal_entries` DISABLE KEYS */;
/*!40000 ALTER TABLE `gl_journal_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gl_journal_lines`
--

DROP TABLE IF EXISTS `gl_journal_lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gl_journal_lines` (
  `gl_line_id` bigint NOT NULL AUTO_INCREMENT,
  `gl_journal_id` bigint NOT NULL,
  `gl_account_id` bigint NOT NULL,
  `debit_amount` decimal(18,2) DEFAULT NULL,
  `credit_amount` decimal(18,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`gl_line_id`),
  KEY `fk_journal_line_entry` (`gl_journal_id`),
  KEY `fk_journal_line_account` (`gl_account_id`),
  CONSTRAINT `fk_journal_line_account` FOREIGN KEY (`gl_account_id`) REFERENCES `gl_accounts` (`gl_account_id`),
  CONSTRAINT `fk_journal_line_entry` FOREIGN KEY (`gl_journal_id`) REFERENCES `gl_journal_entries` (`gl_journal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gl_journal_lines`
--

LOCK TABLES `gl_journal_lines` WRITE;
/*!40000 ALTER TABLE `gl_journal_lines` DISABLE KEYS */;
/*!40000 ALTER TABLE `gl_journal_lines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grades` (
  `grade_id` bigint NOT NULL AUTO_INCREMENT,
  `track_id` bigint NOT NULL,
  `member_id` bigint NOT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `grade_label` varchar(50) DEFAULT NULL,
  `certificate_code` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`grade_id`),
  KEY `fk_grade_track` (`track_id`),
  KEY `fk_grade_member` (`member_id`),
  CONSTRAINT `fk_grade_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`),
  CONSTRAINT `fk_grade_track` FOREIGN KEY (`track_id`) REFERENCES `curriculum_tracks` (`track_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grades`
--

LOCK TABLES `grades` WRITE;
/*!40000 ALTER TABLE `grades` DISABLE KEYS */;
/*!40000 ALTER TABLE `grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `installment_bills`
--

DROP TABLE IF EXISTS `installment_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `installment_bills` (
  `installment_bill_id` bigint NOT NULL AUTO_INCREMENT,
  `purchase_id` bigint NOT NULL,
  `installment_no` int DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `due_datetime` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`installment_bill_id`),
  KEY `fk_installment_bill_purchase` (`purchase_id`),
  CONSTRAINT `fk_installment_bill_purchase` FOREIGN KEY (`purchase_id`) REFERENCES `installment_purchases` (`purchase_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `installment_bills`
--

LOCK TABLES `installment_bills` WRITE;
/*!40000 ALTER TABLE `installment_bills` DISABLE KEYS */;
/*!40000 ALTER TABLE `installment_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `installment_down_payments`
--

DROP TABLE IF EXISTS `installment_down_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `installment_down_payments` (
  `dp_id` bigint NOT NULL AUTO_INCREMENT,
  `purchase_id` bigint NOT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `dp_datetime` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`dp_id`),
  KEY `fk_dp_purchase` (`purchase_id`),
  CONSTRAINT `fk_dp_purchase` FOREIGN KEY (`purchase_id`) REFERENCES `installment_purchases` (`purchase_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `installment_down_payments`
--

LOCK TABLES `installment_down_payments` WRITE;
/*!40000 ALTER TABLE `installment_down_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `installment_down_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `installment_payments`
--

DROP TABLE IF EXISTS `installment_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `installment_payments` (
  `installment_payment_id` bigint NOT NULL AUTO_INCREMENT,
  `installment_bill_id` bigint NOT NULL,
  `paid_datetime` datetime DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`installment_payment_id`),
  KEY `fk_installment_payment_bill` (`installment_bill_id`),
  CONSTRAINT `fk_installment_payment_bill` FOREIGN KEY (`installment_bill_id`) REFERENCES `installment_bills` (`installment_bill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `installment_payments`
--

LOCK TABLES `installment_payments` WRITE;
/*!40000 ALTER TABLE `installment_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `installment_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `installment_purchases`
--

DROP TABLE IF EXISTS `installment_purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `installment_purchases` (
  `purchase_id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `item_category` varchar(50) DEFAULT NULL,
  `price` decimal(18,2) DEFAULT NULL,
  `dp_amount` decimal(18,2) DEFAULT NULL,
  `margin` decimal(18,2) DEFAULT NULL,
  `selling_price` decimal(18,2) DEFAULT NULL,
  `term_count` int DEFAULT NULL,
  `installment_amount` decimal(18,2) DEFAULT NULL,
  `akad_type` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`purchase_id`),
  KEY `fk_purchase_member` (`member_id`),
  CONSTRAINT `fk_purchase_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `installment_purchases`
--

LOCK TABLES `installment_purchases` WRITE;
/*!40000 ALTER TABLE `installment_purchases` DISABLE KEYS */;
/*!40000 ALTER TABLE `installment_purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_items`
--

DROP TABLE IF EXISTS `invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_items` (
  `invoice_item_id` bigint NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`invoice_item_id`),
  KEY `fk_invoice_item_invoice` (`invoice_id`),
  CONSTRAINT `fk_invoice_item_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_items`
--

LOCK TABLES `invoice_items` WRITE;
/*!40000 ALTER TABLE `invoice_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `invoice_id` bigint NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(50) DEFAULT NULL,
  `member_id` bigint NOT NULL,
  `invoice_datetime` datetime DEFAULT NULL,
  `expired_datetime` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `virtual_account_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`invoice_id`),
  UNIQUE KEY `invoice_number` (`invoice_number`),
  KEY `fk_invoice_member` (`member_id`),
  KEY `fk_invoice_va` (`virtual_account_id`),
  CONSTRAINT `fk_invoice_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`),
  CONSTRAINT `fk_invoice_va` FOREIGN KEY (`virtual_account_id`) REFERENCES `virtual_accounts` (`virtual_account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loan_bills`
--

DROP TABLE IF EXISTS `loan_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loan_bills` (
  `loan_bill_id` bigint NOT NULL AUTO_INCREMENT,
  `loan_id` bigint NOT NULL,
  `installment_no` int DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `due_datetime` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`loan_bill_id`),
  KEY `fk_loan_bill_loan` (`loan_id`),
  CONSTRAINT `fk_loan_bill_loan` FOREIGN KEY (`loan_id`) REFERENCES `member_loans` (`loan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loan_bills`
--

LOCK TABLES `loan_bills` WRITE;
/*!40000 ALTER TABLE `loan_bills` DISABLE KEYS */;
/*!40000 ALTER TABLE `loan_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loan_disbursements`
--

DROP TABLE IF EXISTS `loan_disbursements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loan_disbursements` (
  `loan_disbursement_id` bigint NOT NULL AUTO_INCREMENT,
  `loan_id` bigint NOT NULL,
  `disbursement_datetime` datetime DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`loan_disbursement_id`),
  KEY `fk_loan_disbursement_loan` (`loan_id`),
  CONSTRAINT `fk_loan_disbursement_loan` FOREIGN KEY (`loan_id`) REFERENCES `member_loans` (`loan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loan_disbursements`
--

LOCK TABLES `loan_disbursements` WRITE;
/*!40000 ALTER TABLE `loan_disbursements` DISABLE KEYS */;
/*!40000 ALTER TABLE `loan_disbursements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loan_payments`
--

DROP TABLE IF EXISTS `loan_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loan_payments` (
  `loan_payment_id` bigint NOT NULL AUTO_INCREMENT,
  `loan_bill_id` bigint NOT NULL,
  `paid_datetime` datetime DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`loan_payment_id`),
  KEY `fk_loan_payment_bill` (`loan_bill_id`),
  CONSTRAINT `fk_loan_payment_bill` FOREIGN KEY (`loan_bill_id`) REFERENCES `loan_bills` (`loan_bill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loan_payments`
--

LOCK TABLES `loan_payments` WRITE;
/*!40000 ALTER TABLE `loan_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `loan_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loan_products`
--

DROP TABLE IF EXISTS `loan_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loan_products` (
  `loan_product_id` bigint NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) DEFAULT NULL,
  `loan_type` varchar(50) DEFAULT NULL,
  `akad_type` varchar(50) DEFAULT NULL,
  `default_term` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`loan_product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loan_products`
--

LOCK TABLES `loan_products` WRITE;
/*!40000 ALTER TABLE `loan_products` DISABLE KEYS */;
/*!40000 ALTER TABLE `loan_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `material_id` bigint NOT NULL AUTO_INCREMENT,
  `track_id` bigint NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content_url` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`material_id`),
  KEY `fk_material_track` (`track_id`),
  CONSTRAINT `fk_material_track` FOREIGN KEY (`track_id`) REFERENCES `curriculum_tracks` (`track_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_bank_accounts`
--

DROP TABLE IF EXISTS `member_bank_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_bank_accounts` (
  `member_bank_id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account_no` varchar(50) DEFAULT NULL,
  `account_holder` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`member_bank_id`),
  KEY `fk_bank_member` (`member_id`),
  CONSTRAINT `fk_bank_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_bank_accounts`
--

LOCK TABLES `member_bank_accounts` WRITE;
/*!40000 ALTER TABLE `member_bank_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_bank_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_emergency_contacts`
--

DROP TABLE IF EXISTS `member_emergency_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_emergency_contacts` (
  `emergency_contact_id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `relation` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`emergency_contact_id`),
  KEY `fk_emergency_member` (`member_id`),
  CONSTRAINT `fk_emergency_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_emergency_contacts`
--

LOCK TABLES `member_emergency_contacts` WRITE;
/*!40000 ALTER TABLE `member_emergency_contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_emergency_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_employments`
--

DROP TABLE IF EXISTS `member_employments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_employments` (
  `employment_id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `employer_name` varchar(255) DEFAULT NULL,
  `employer_address` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`employment_id`),
  KEY `fk_employment_member` (`member_id`),
  CONSTRAINT `fk_employment_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_employments`
--

LOCK TABLES `member_employments` WRITE;
/*!40000 ALTER TABLE `member_employments` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_employments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_loans`
--

DROP TABLE IF EXISTS `member_loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_loans` (
  `loan_id` bigint NOT NULL AUTO_INCREMENT,
  `loan_product_id` bigint NOT NULL,
  `member_id` bigint NOT NULL,
  `nominal_principal` decimal(18,2) DEFAULT NULL,
  `term_count` int DEFAULT NULL,
  `installment_amount` decimal(18,2) DEFAULT NULL,
  `disbursement_method` varchar(50) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account_no` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`loan_id`),
  KEY `fk_loan_product` (`loan_product_id`),
  KEY `fk_loan_member` (`member_id`),
  CONSTRAINT `fk_loan_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`),
  CONSTRAINT `fk_loan_product` FOREIGN KEY (`loan_product_id`) REFERENCES `loan_products` (`loan_product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_loans`
--

LOCK TABLES `member_loans` WRITE;
/*!40000 ALTER TABLE `member_loans` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_loans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_registrations`
--

DROP TABLE IF EXISTS `member_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_registrations` (
  `registration_id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `registered_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `registration_status` enum('verifikasi_dokumen','verifikasi_pendaftaran','aktif') DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`registration_id`),
  KEY `fk_registration_member` (`member_id`),
  CONSTRAINT `fk_registration_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_registrations`
--

LOCK TABLES `member_registrations` WRITE;
/*!40000 ALTER TABLE `member_registrations` DISABLE KEYS */;
INSERT INTO `member_registrations` VALUES (2,2,'2025-12-05 17:17:25','aktif','081234567890','Fahmy','mohamadfahmyiqbal@gmail.com','$2b$10$YivhSSNNk0oUdhxGHjaaIuiKLATrjy8SIua7ece.aGNSVDzqqPbF.','2025-12-05 17:17:25','2025-12-05 17:17:25');
/*!40000 ALTER TABLE `member_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_role_assignments`
--

DROP TABLE IF EXISTS `member_role_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_role_assignments` (
  `member_role_id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`member_role_id`),
  KEY `fk_mra_member` (`member_id`),
  KEY `fk_mra_role` (`role_id`),
  CONSTRAINT `fk_mra_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`),
  CONSTRAINT `fk_mra_role` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_role_assignments`
--

LOCK TABLES `member_role_assignments` WRITE;
/*!40000 ALTER TABLE `member_role_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_role_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_saving_targets`
--

DROP TABLE IF EXISTS `member_saving_targets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_saving_targets` (
  `member_saving_target_id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `saving_target_id` bigint NOT NULL,
  `start_period_month` int DEFAULT NULL,
  `start_period_year` int DEFAULT NULL,
  `current_balance` decimal(18,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`member_saving_target_id`),
  KEY `fk_mst_member` (`member_id`),
  KEY `fk_mst_target` (`saving_target_id`),
  CONSTRAINT `fk_mst_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`),
  CONSTRAINT `fk_mst_target` FOREIGN KEY (`saving_target_id`) REFERENCES `saving_targets` (`saving_target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_saving_targets`
--

LOCK TABLES `member_saving_targets` WRITE;
/*!40000 ALTER TABLE `member_saving_targets` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_saving_targets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_savings_accounts`
--

DROP TABLE IF EXISTS `member_savings_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_savings_accounts` (
  `savings_account_id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `savings_product_id` bigint NOT NULL,
  `account_no` varchar(50) DEFAULT NULL,
  `account_type` varchar(50) DEFAULT NULL,
  `open_date` date DEFAULT NULL,
  `nominal` decimal(18,2) DEFAULT NULL,
  `current_balance` decimal(18,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`savings_account_id`),
  UNIQUE KEY `account_no` (`account_no`),
  KEY `fk_msa_member` (`member_id`),
  KEY `fk_msa_product` (`savings_product_id`),
  CONSTRAINT `fk_msa_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`),
  CONSTRAINT `fk_msa_product` FOREIGN KEY (`savings_product_id`) REFERENCES `savings_products` (`savings_product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_savings_accounts`
--

LOCK TABLES `member_savings_accounts` WRITE;
/*!40000 ALTER TABLE `member_savings_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_savings_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_status`
--

DROP TABLE IF EXISTS `member_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_status` (
  `status_id` bigint NOT NULL AUTO_INCREMENT,
  `status_name` varchar(100) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_status`
--

LOCK TABLES `member_status` WRITE;
/*!40000 ALTER TABLE `member_status` DISABLE KEYS */;
INSERT INTO `member_status` VALUES (1,'Calon Anggota','2025-12-05 10:16:20','2025-12-05 10:16:20'),(2,'Anggota Reguler','2025-12-05 10:16:20','2025-12-05 10:16:20'),(3,'Anggota Luar Biasa','2025-12-05 10:16:20','2025-12-05 10:16:20'),(4,'Pengurus','2025-12-05 10:16:20','2025-12-05 10:16:20');
/*!40000 ALTER TABLE `member_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `member_id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `member_no` varchar(50) NOT NULL,
  `member_type` varchar(20) DEFAULT NULL,
  `nik_ktp` varchar(50) DEFAULT NULL,
  `address` text,
  `status_id` bigint DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `member_no` (`member_no`),
  KEY `fk_members_status` (`status_id`),
  CONSTRAINT `fk_members_status` FOREIGN KEY (`status_id`) REFERENCES `member_status` (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (2,'Fahmy','mohamadfahmyiqbal@gmail.com','081234567890',NULL,'2025-12-05','000512251717','reguler',NULL,NULL,1,'2025-12-05 17:17:25','2025-12-05 17:17:25');
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membership_exit_requests`
--

DROP TABLE IF EXISTS `membership_exit_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membership_exit_requests` (
  `exit_request_id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `reason` text,
  `payment_method` varchar(50) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account_no` varchar(50) DEFAULT NULL,
  `office_location` varchar(255) DEFAULT NULL,
  `schedule_datetime` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`exit_request_id`),
  KEY `fk_exit_member` (`member_id`),
  CONSTRAINT `fk_exit_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membership_exit_requests`
--

LOCK TABLES `membership_exit_requests` WRITE;
/*!40000 ALTER TABLE `membership_exit_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `membership_exit_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notes` (
  `note_id` bigint NOT NULL AUTO_INCREMENT,
  `material_id` bigint NOT NULL,
  `member_id` bigint NOT NULL,
  `note_text` text,
  `created_datetime` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`note_id`),
  KEY `fk_note_material` (`material_id`),
  KEY `fk_note_member` (`member_id`),
  CONSTRAINT `fk_note_material` FOREIGN KEY (`material_id`) REFERENCES `materials` (`material_id`),
  CONSTRAINT `fk_note_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `sent_datetime` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `fk_notification_member` (`member_id`),
  CONSTRAINT `fk_notification_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` bigint NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint NOT NULL,
  `paid_datetime` datetime DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `method` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `fk_payment_invoice` (`invoice_id`),
  CONSTRAINT `fk_payment_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_attempts`
--

DROP TABLE IF EXISTS `quiz_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_attempts` (
  `attempt_id` bigint NOT NULL AUTO_INCREMENT,
  `quiz_id` bigint NOT NULL,
  `member_id` bigint NOT NULL,
  `started_datetime` datetime DEFAULT NULL,
  `finished_datetime` datetime DEFAULT NULL,
  `answered_count` int DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`attempt_id`),
  KEY `fk_quiz_attempt_quiz` (`quiz_id`),
  KEY `fk_quiz_attempt_member` (`member_id`),
  CONSTRAINT `fk_quiz_attempt_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`),
  CONSTRAINT `fk_quiz_attempt_quiz` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`quiz_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_attempts`
--

LOCK TABLES `quiz_attempts` WRITE;
/*!40000 ALTER TABLE `quiz_attempts` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quizzes` (
  `quiz_id` bigint NOT NULL AUTO_INCREMENT,
  `track_id` bigint NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `question_count` int DEFAULT NULL,
  `duration_minutes` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`quiz_id`),
  KEY `fk_quiz_track` (`track_id`),
  CONSTRAINT `fk_quiz_track` FOREIGN KEY (`track_id`) REFERENCES `curriculum_tracks` (`track_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rankings`
--

DROP TABLE IF EXISTS `rankings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rankings` (
  `ranking_id` bigint NOT NULL AUTO_INCREMENT,
  `track_id` bigint NOT NULL,
  `member_id` bigint NOT NULL,
  `rank_no` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ranking_id`),
  KEY `fk_ranking_track` (`track_id`),
  KEY `fk_ranking_member` (`member_id`),
  CONSTRAINT `fk_ranking_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`),
  CONSTRAINT `fk_ranking_track` FOREIGN KEY (`track_id`) REFERENCES `curriculum_tracks` (`track_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rankings`
--

LOCK TABLES `rankings` WRITE;
/*!40000 ALTER TABLE `rankings` DISABLE KEYS */;
/*!40000 ALTER TABLE `rankings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipts`
--

DROP TABLE IF EXISTS `receipts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receipts` (
  `receipt_id` bigint NOT NULL AUTO_INCREMENT,
  `payment_id` bigint NOT NULL,
  `receipt_number` varchar(50) DEFAULT NULL,
  `issued_datetime` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`receipt_id`),
  UNIQUE KEY `receipt_number` (`receipt_number`),
  KEY `fk_receipt_payment` (`payment_id`),
  CONSTRAINT `fk_receipt_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipts`
--

LOCK TABLES `receipts` WRITE;
/*!40000 ALTER TABLE `receipts` DISABLE KEYS */;
/*!40000 ALTER TABLE `receipts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saving_target_bills`
--

DROP TABLE IF EXISTS `saving_target_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saving_target_bills` (
  `target_bill_id` bigint NOT NULL AUTO_INCREMENT,
  `member_saving_target_id` bigint NOT NULL,
  `installment_no` int DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `due_datetime` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`target_bill_id`),
  KEY `fk_stb_member_target` (`member_saving_target_id`),
  CONSTRAINT `fk_stb_member_target` FOREIGN KEY (`member_saving_target_id`) REFERENCES `member_saving_targets` (`member_saving_target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saving_target_bills`
--

LOCK TABLES `saving_target_bills` WRITE;
/*!40000 ALTER TABLE `saving_target_bills` DISABLE KEYS */;
/*!40000 ALTER TABLE `saving_target_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saving_target_payments`
--

DROP TABLE IF EXISTS `saving_target_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saving_target_payments` (
  `target_payment_id` bigint NOT NULL AUTO_INCREMENT,
  `target_bill_id` bigint NOT NULL,
  `paid_datetime` datetime DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`target_payment_id`),
  KEY `fk_stp_bill` (`target_bill_id`),
  CONSTRAINT `fk_stp_bill` FOREIGN KEY (`target_bill_id`) REFERENCES `saving_target_bills` (`target_bill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saving_target_payments`
--

LOCK TABLES `saving_target_payments` WRITE;
/*!40000 ALTER TABLE `saving_target_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `saving_target_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saving_targets`
--

DROP TABLE IF EXISTS `saving_targets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saving_targets` (
  `saving_target_id` bigint NOT NULL AUTO_INCREMENT,
  `target_name` varchar(255) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `target_amount` decimal(18,2) DEFAULT NULL,
  `term_months` int DEFAULT NULL,
  `min_monthly_deposit` decimal(18,2) DEFAULT NULL,
  `akad_type` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`saving_target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saving_targets`
--

LOCK TABLES `saving_targets` WRITE;
/*!40000 ALTER TABLE `saving_targets` DISABLE KEYS */;
/*!40000 ALTER TABLE `saving_targets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings_bills`
--

DROP TABLE IF EXISTS `savings_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings_bills` (
  `savings_bill_id` bigint NOT NULL AUTO_INCREMENT,
  `savings_account_id` bigint NOT NULL,
  `period_month` int DEFAULT NULL,
  `period_year` int DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `due_datetime` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`savings_bill_id`),
  KEY `fk_sb_account` (`savings_account_id`),
  CONSTRAINT `fk_sb_account` FOREIGN KEY (`savings_account_id`) REFERENCES `member_savings_accounts` (`savings_account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings_bills`
--

LOCK TABLES `savings_bills` WRITE;
/*!40000 ALTER TABLE `savings_bills` DISABLE KEYS */;
/*!40000 ALTER TABLE `savings_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings_products`
--

DROP TABLE IF EXISTS `savings_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings_products` (
  `savings_product_id` bigint NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `akad_type` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`savings_product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings_products`
--

LOCK TABLES `savings_products` WRITE;
/*!40000 ALTER TABLE `savings_products` DISABLE KEYS */;
/*!40000 ALTER TABLE `savings_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings_transactions`
--

DROP TABLE IF EXISTS `savings_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings_transactions` (
  `savings_tx_id` bigint NOT NULL AUTO_INCREMENT,
  `savings_account_id` bigint NOT NULL,
  `tx_type` varchar(50) DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `tx_datetime` datetime DEFAULT NULL,
  `method` varchar(50) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account_no` varchar(50) DEFAULT NULL,
  `approved_status` varchar(50) DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`savings_tx_id`),
  KEY `fk_st_account` (`savings_account_id`),
  CONSTRAINT `fk_st_account` FOREIGN KEY (`savings_account_id`) REFERENCES `member_savings_accounts` (`savings_account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings_transactions`
--

LOCK TABLES `savings_transactions` WRITE;
/*!40000 ALTER TABLE `savings_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `savings_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings_withdrawals`
--

DROP TABLE IF EXISTS `savings_withdrawals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings_withdrawals` (
  `withdrawal_id` bigint NOT NULL AUTO_INCREMENT,
  `savings_account_id` bigint NOT NULL,
  `member_id` bigint NOT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `method` varchar(50) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account_no` varchar(50) DEFAULT NULL,
  `request_datetime` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `approval_flow_id` bigint DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`withdrawal_id`),
  KEY `fk_sw_account` (`savings_account_id`),
  KEY `fk_sw_member` (`member_id`),
  CONSTRAINT `fk_sw_account` FOREIGN KEY (`savings_account_id`) REFERENCES `member_savings_accounts` (`savings_account_id`),
  CONSTRAINT `fk_sw_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings_withdrawals`
--

LOCK TABLES `savings_withdrawals` WRITE;
/*!40000 ALTER TABLE `savings_withdrawals` DISABLE KEYS */;
/*!40000 ALTER TABLE `savings_withdrawals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sukuk_issues`
--

DROP TABLE IF EXISTS `sukuk_issues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sukuk_issues` (
  `sukuk_issue_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `issuer` varchar(255) DEFAULT NULL,
  `object_description` text,
  `category` varchar(50) DEFAULT NULL,
  `funding_amount` decimal(18,2) DEFAULT NULL,
  `target_amount` decimal(18,2) DEFAULT NULL,
  `tenor_years` int DEFAULT NULL,
  `nisbah_investor_pct` decimal(5,2) DEFAULT NULL,
  `nisbah_issuer_pct` decimal(5,2) DEFAULT NULL,
  `projected_return` decimal(18,2) DEFAULT NULL,
  `min_investment` decimal(18,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sukuk_issue_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sukuk_issues`
--

LOCK TABLES `sukuk_issues` WRITE;
/*!40000 ALTER TABLE `sukuk_issues` DISABLE KEYS */;
/*!40000 ALTER TABLE `sukuk_issues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sukuk_orders`
--

DROP TABLE IF EXISTS `sukuk_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sukuk_orders` (
  `sukuk_order_id` bigint NOT NULL AUTO_INCREMENT,
  `sukuk_issue_id` bigint NOT NULL,
  `member_id` bigint NOT NULL,
  `units` int DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `order_datetime` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sukuk_order_id`),
  KEY `fk_sukuk_order_issue` (`sukuk_issue_id`),
  KEY `fk_sukuk_order_member` (`member_id`),
  CONSTRAINT `fk_sukuk_order_issue` FOREIGN KEY (`sukuk_issue_id`) REFERENCES `sukuk_issues` (`sukuk_issue_id`),
  CONSTRAINT `fk_sukuk_order_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sukuk_orders`
--

LOCK TABLES `sukuk_orders` WRITE;
/*!40000 ALTER TABLE `sukuk_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `sukuk_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sukuk_payout_schedules`
--

DROP TABLE IF EXISTS `sukuk_payout_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sukuk_payout_schedules` (
  `sukuk_payout_id` bigint NOT NULL AUTO_INCREMENT,
  `sukuk_issue_id` bigint NOT NULL,
  `payout_type` varchar(50) DEFAULT NULL,
  `payout_month` int DEFAULT NULL,
  `payout_year` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sukuk_payout_id`),
  KEY `fk_sukuk_schedule_issue` (`sukuk_issue_id`),
  CONSTRAINT `fk_sukuk_schedule_issue` FOREIGN KEY (`sukuk_issue_id`) REFERENCES `sukuk_issues` (`sukuk_issue_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sukuk_payout_schedules`
--

LOCK TABLES `sukuk_payout_schedules` WRITE;
/*!40000 ALTER TABLE `sukuk_payout_schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `sukuk_payout_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sukuk_payouts`
--

DROP TABLE IF EXISTS `sukuk_payouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sukuk_payouts` (
  `sukuk_payout_tx_id` bigint NOT NULL AUTO_INCREMENT,
  `sukuk_order_id` bigint NOT NULL,
  `payout_type` varchar(50) DEFAULT NULL,
  `payout_no` int DEFAULT NULL,
  `payout_month` int DEFAULT NULL,
  `payout_year` int DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sukuk_payout_tx_id`),
  KEY `fk_sukuk_payout_order` (`sukuk_order_id`),
  CONSTRAINT `fk_sukuk_payout_order` FOREIGN KEY (`sukuk_order_id`) REFERENCES `sukuk_orders` (`sukuk_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sukuk_payouts`
--

LOCK TABLES `sukuk_payouts` WRITE;
/*!40000 ALTER TABLE `sukuk_payouts` DISABLE KEYS */;
/*!40000 ALTER TABLE `sukuk_payouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabungan_withdrawals`
--

DROP TABLE IF EXISTS `tabungan_withdrawals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabungan_withdrawals` (
  `tabungan_withdrawal_id` bigint NOT NULL AUTO_INCREMENT,
  `member_saving_target_id` bigint NOT NULL,
  `member_id` bigint NOT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `method` varchar(50) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account_no` varchar(50) DEFAULT NULL,
  `reason` text,
  `request_datetime` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `approval_flow_id` bigint DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tabungan_withdrawal_id`),
  KEY `fk_tw_member_target` (`member_saving_target_id`),
  KEY `fk_tw_member` (`member_id`),
  CONSTRAINT `fk_tw_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`),
  CONSTRAINT `fk_tw_member_target` FOREIGN KEY (`member_saving_target_id`) REFERENCES `member_saving_targets` (`member_saving_target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabungan_withdrawals`
--

LOCK TABLES `tabungan_withdrawals` WRITE;
/*!40000 ALTER TABLE `tabungan_withdrawals` DISABLE KEYS */;
/*!40000 ALTER TABLE `tabungan_withdrawals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `role_id` bigint NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `virtual_accounts`
--

DROP TABLE IF EXISTS `virtual_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `virtual_accounts` (
  `virtual_account_id` bigint NOT NULL AUTO_INCREMENT,
  `va_number` varchar(50) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`virtual_account_id`),
  UNIQUE KEY `va_number` (`va_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `virtual_accounts`
--

LOCK TABLES `virtual_accounts` WRITE;
/*!40000 ALTER TABLE `virtual_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `virtual_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'koperasi'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-06 16:26:21
