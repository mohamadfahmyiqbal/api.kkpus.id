-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: 202.52.147.193    Database: koperasi
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.22.04.3

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
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20240614000000-add-quiz-questions-to-materials.cjs'),('20260226021733-alter-members-member-id-to-uuid.cjs'),('20260616000000-create-jual-beli-reports.cjs'),('20260616000001-create-member-financial-summaries.cjs');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `account_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `account_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `open_date` date DEFAULT NULL,
  `akad_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_balance` decimal(18,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`account_id`),
  KEY `member_id` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES ('07654b16-9b0d-4269-b85e-726a5a480769','0a7fd51a-6494-4202-89b6-94641b105fbb','TRANSACTION_DOWN_PAYMENT','ACC-TRANSACTION_DOWN_PAYMENT-0a7fd51a','2026-07-22',NULL,1500000.00,'2026-07-22 11:39:33','2026-07-22 11:39:33'),('44d75382-3993-43b7-a00a-96ddd45f0f5f','0a7fd51a-6494-4202-89b6-94641b105fbb','SS_SUKARELA','ACC-SS_SUKARELA-0a7fd51a','2026-07-22',NULL,900000.00,'2026-07-22 06:16:34','2026-07-22 10:58:41'),('5814cace-6590-45d6-8d68-76bff3ec46ee','0a7fd51a-6494-4202-89b6-94641b105fbb','TRANSACTION_INSTALLMENT','ACC-TRANSACTION_INSTALLMENT-0a7fd51a','2026-07-22',NULL,61736004.00,'2026-07-22 13:13:38','2026-07-22 13:50:50'),('a9cd7d0a-e699-4d42-9513-fc28ca6fc6ad','0a7fd51a-6494-4202-89b6-94641b105fbb','SAVINGS','ACC-TOTAL-0a7fd51a','2026-07-21',NULL,67276004.00,'2026-07-22 06:05:10','2026-07-22 13:50:50'),('b9c09a7d-0d03-4406-b6eb-6777b96d7b3b','0a7fd51a-6494-4202-89b6-94641b105fbb','SW_POKOK','ACC-SW_POKOK-0a7fd51a','2026-07-21',NULL,500000.00,'2026-07-22 06:05:10','2026-07-22 06:05:10'),('ebb8b9da-516c-46c1-b3f7-e1009367c5fc','0a7fd51a-6494-4202-89b6-94641b105fbb','SW_WAJIB','ACC-SW_WAJIB-0a7fd51a','2026-07-21',NULL,2640000.00,'2026-07-22 06:05:10','2026-07-22 13:50:50');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `activity_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `activity_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detail` text COLLATE utf8mb4_unicode_ci,
  `activity_datetime` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`activity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES ('0157ec5d-b577-4fa1-9095-9f7cddafb46b','b0024d1f-0605-47fe-891e-156ca72ddefc','FINAL_APPROVAL','Persetujuan pendaftaran Member ID: d7570642-5cd5-4403-8085-66bb3927b76b. Menunggu pembayaran untuk aktivasi.','2026-06-28 09:58:36','2026-06-28 09:58:36','2026-06-28 09:58:36'),('11371333-e06a-4ebc-a773-efbbaca04402','b0024d1f-0605-47fe-891e-156ca72ddefc','FINAL_APPROVAL','Persetujuan pendaftaran Member ID: 693e2950-6039-45d3-b8f6-6ed5b2983814. Menunggu pembayaran untuk aktivasi.','2026-07-21 15:19:44','2026-07-21 15:19:44','2026-07-21 15:19:44'),('248321bb-b00f-4807-b26b-ae194a4f5fad','b0024d1f-0605-47fe-891e-156ca72ddefc','FINAL_APPROVAL','Persetujuan pendaftaran Member ID: 8c6f7722-c817-40c7-ba80-982b224f08c2. Menunggu pembayaran untuk aktivasi.','2026-06-28 10:07:51','2026-06-28 10:07:51','2026-06-28 10:07:51'),('25298ed5-91a9-4abc-be74-2ec57e17f7cc','b0024d1f-0605-47fe-891e-156ca72ddefc','FINAL_APPROVAL','Persetujuan pendaftaran Member ID: 8bd8e1a5-ec5b-4963-922c-9a5c724fb906. Menunggu pembayaran untuk aktivasi.','2026-06-28 09:54:46','2026-06-28 09:54:46','2026-06-28 09:54:46'),('253b8a24-4b59-43fe-a688-b9ffe1089e18','b0024d1f-0605-47fe-891e-156ca72ddefc','FINAL_APPROVAL','Persetujuan pendaftaran Member ID: 6c16df4e-6d44-45c4-b02b-05f022fdf1df. Menunggu pembayaran untuk aktivasi.','2026-06-27 15:45:09','2026-06-27 15:45:09','2026-06-27 15:45:09'),('46972e80-e97f-4f3c-bb36-7e38a229f512','b0024d1f-0605-47fe-891e-156ca72ddefc','FINAL_APPROVAL','Persetujuan pendaftaran Member ID: f98594e5-d43c-4acb-8052-b108c36c79cc. Menunggu pembayaran untuk aktivasi.','2026-06-18 21:36:09','2026-06-18 21:36:09','2026-06-18 21:36:09'),('4ac861c9-3bac-4003-b353-b539f1d8cc41','b0024d1f-0605-47fe-891e-156ca72ddefc','FINAL_APPROVAL','Persetujuan pendaftaran Member ID: 8c00e514-663c-4f3d-97ff-8520273d923e. Menunggu pembayaran untuk aktivasi.','2026-07-19 08:15:46','2026-07-19 08:15:46','2026-07-19 08:15:46'),('574bd187-466e-4537-a016-6e7f4bc76533','b0024d1f-0605-47fe-891e-156ca72ddefc','FINAL_APPROVAL','Persetujuan pendaftaran Member ID: 5bc1b027-b861-44ab-b46c-0de120bf46ac. Menunggu pembayaran untuk aktivasi.','2026-06-28 09:59:14','2026-06-28 09:59:14','2026-06-28 09:59:14'),('830d8c7b-c370-4b4e-844a-17d160b65ea4','b0024d1f-0605-47fe-891e-156ca72ddefc','FINAL_APPROVAL','Persetujuan pendaftaran Member ID: 5880c3cd-d403-40dd-997b-319629799cab. Menunggu pembayaran untuk aktivasi.','2026-06-20 00:25:52','2026-06-20 00:25:52','2026-06-20 00:25:52'),('925bba3e-d77d-4ea7-b8b0-190b87bc47fe','b0024d1f-0605-47fe-891e-156ca72ddefc','FINAL_APPROVAL','Persetujuan pendaftaran Member ID: df603033-5528-4dde-885f-407c1015e488. Menunggu pembayaran untuk aktivasi.','2026-07-25 01:28:18','2026-07-25 01:28:18','2026-07-25 01:28:18'),('9d423448-6704-4abc-ad63-a063bb7b49b3','b0024d1f-0605-47fe-891e-156ca72ddefc','FINAL_APPROVAL','Persetujuan pendaftaran Member ID: 43643359-0f59-4ea4-bb6d-e93505733d4a. Menunggu pembayaran untuk aktivasi.','2026-07-25 01:13:25','2026-07-25 01:13:25','2026-07-25 01:13:25'),('ef82fb37-1282-43d4-a87a-66479a178ee8','b0024d1f-0605-47fe-891e-156ca72ddefc','FINAL_APPROVAL','Persetujuan pendaftaran Member ID: e2e9a4aa-d37b-444b-8b42-8da3159e986b. Menunggu pembayaran untuk aktivasi.','2026-07-12 22:54:36','2026-07-12 22:54:36','2026-07-12 22:54:36'),('f29765b1-30a8-4d00-9813-6653f191ebcb','b0024d1f-0605-47fe-891e-156ca72ddefc','FINAL_APPROVAL','Persetujuan pendaftaran Member ID: 5e714c26-43e6-44a0-8a1e-def3f3290190. Menunggu pembayaran untuk aktivasi.','2026-07-25 01:13:18','2026-07-25 01:13:18','2026-07-25 01:13:18'),('f3c193bf-88a8-4454-9f83-30e8809ea7b3','b0024d1f-0605-47fe-891e-156ca72ddefc','FINAL_APPROVAL','Persetujuan pendaftaran Member ID: 0a7fd51a-6494-4202-89b6-94641b105fbb. Menunggu pembayaran untuk aktivasi.','2026-07-22 06:04:35','2026-07-22 06:04:35','2026-07-22 06:04:35'),('fdfa3249-76c1-412d-9070-8baa52a9fc36','b0024d1f-0605-47fe-891e-156ca72ddefc','FINAL_APPROVAL','Persetujuan pendaftaran Member ID: d33889c0-4bf9-4745-909b-a9a726181785. Menunggu pembayaran untuk aktivasi.','2026-07-04 15:11:58','2026-07-04 15:11:58','2026-07-04 15:11:58');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approval_flows`
--

DROP TABLE IF EXISTS `approval_flows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_flows` (
  `approval_flow_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `flow_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_ref` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`approval_flow_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_flows`
--

LOCK TABLES `approval_flows` WRITE;
/*!40000 ALTER TABLE `approval_flows` DISABLE KEYS */;
INSERT INTO `approval_flows` VALUES ('0c04764a-8c4c-4f79-afca-25c8530cd065','Berhenti Keanggotaan','exit_requests','719f7a16-f854-462e-a3e6-60c14e9e1993','2026-07-23 09:00:33','2026-07-23 09:00:33'),('14b1b5ca-a82e-4dd8-a62c-55688eba7927','Penarikan Simpanan','savings_withdrawals','719f7a16-f854-462e-a3e6-60c14e9e1993','2026-06-11 05:20:37','2026-06-11 05:20:37'),('355eca4c-d6f6-4b7a-8448-4d9b99ae578d','Simpanan','savings','a92ff396-53e2-4b33-93e0-0119e692fcd8','2026-06-11 05:20:37','2026-06-11 05:20:37'),('5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','Pendaftaran Anggota','member_registrations','c71b6a6a-d748-4064-9750-22e8de8acc8b','2026-06-11 05:20:36','2026-06-11 05:20:36'),('bf046302-6819-41a4-b375-3340fb201bda','Pembiayaan','financing_applications','0f6e4646-67c0-40a7-86d1-617a992cfab8','2026-06-11 05:20:37','2026-06-11 05:20:37'),('c5c293f1-3615-4ed6-931d-e84c8de08b57','Penarikan Tabungan','tabungan_withdrawals','19b51728-06ec-4778-9889-f9c88b32b2e0','2026-07-11 10:33:57','2026-07-11 10:33:57'),('dae7fd28-a911-47f4-8aeb-d3f14a5b551d','Pendaftaran Anggota','member_registrations','a433f236-0d87-4384-af47-5ce26cfe4178','2026-06-11 05:20:17','2026-06-11 05:20:17'),('f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','FLOW_TABUNGAN','member_saving_targets','tabungan-flow','2026-06-12 17:16:26','2026-06-12 17:16:26');
/*!40000 ALTER TABLE `approval_flows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approval_statuses`
--

DROP TABLE IF EXISTS `approval_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_statuses` (
  `approval_status_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `approval_flow_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `status_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`approval_status_id`),
  KEY `approval_flow_id` (`approval_flow_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_statuses`
--

LOCK TABLES `approval_statuses` WRITE;
/*!40000 ALTER TABLE `approval_statuses` DISABLE KEYS */;
INSERT INTO `approval_statuses` VALUES ('2d94b1ea-5e4c-417a-be2d-5893b870a392','dae7fd28-a911-47f4-8aeb-d3f14a5b551d','REJECTED','Ditolak',1,'2026-06-11 05:24:54','2026-06-11 05:24:54'),('3035ac57-2024-4258-b4c8-c530818f86ce','bf046302-6819-41a4-b375-3340fb201bda','APPROVED','Disetujui',1,'2026-06-11 05:24:54','2026-06-11 05:24:54'),('3d2956f3-3de4-417d-bcda-b76965985a48','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','WAITING_APPROVAL','Menunggu Persetujuan',1,'2026-06-11 05:24:54','2026-06-11 05:24:54'),('451078d9-ab0c-4895-b19a-c13775cfc2eb','355eca4c-d6f6-4b7a-8448-4d9b99ae578d','APPROVED','Disetujui',1,'2026-06-11 05:24:54','2026-06-11 05:24:54'),('669f272b-bbe3-44df-869a-b8022d8d087c','14b1b5ca-a82e-4dd8-a62c-55688eba7927','APPROVED','Disetujui',1,'2026-06-11 05:24:54','2026-06-11 05:24:54'),('70101f6b-9b86-4105-8bf6-bee98e2574ff','bf046302-6819-41a4-b375-3340fb201bda','REJECTED','Ditolak',1,'2026-06-11 05:24:54','2026-06-11 05:24:54'),('782d9394-bd20-4182-ba21-e1a46843b01e','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','REJECTED','Ditolak',1,'2026-06-11 05:24:54','2026-06-11 05:24:54'),('975409d7-4861-454e-9ed9-369b417a3674','355eca4c-d6f6-4b7a-8448-4d9b99ae578d','REJECTED','Ditolak',1,'2026-06-11 05:24:54','2026-06-11 05:24:54'),('a3389cc3-99e8-4665-861c-e3ea7136b10c','dae7fd28-a911-47f4-8aeb-d3f14a5b551d','WAITING_APPROVAL','Menunggu Persetujuan',1,'2026-06-11 05:24:54','2026-06-11 05:24:54'),('a49eeae3-e49a-47c1-bd34-ab3b728927ca','355eca4c-d6f6-4b7a-8448-4d9b99ae578d','WAITING_APPROVAL','Menunggu Persetujuan',1,'2026-06-11 05:24:54','2026-06-11 05:24:54'),('b09ef142-b678-476b-bf72-b93d71cdcc15','14b1b5ca-a82e-4dd8-a62c-55688eba7927','REJECTED','Ditolak',1,'2026-06-11 05:24:54','2026-06-11 05:24:54'),('c174ca50-a4d9-42b8-a7cb-75517762fc7f','bf046302-6819-41a4-b375-3340fb201bda','WAITING_APPROVAL','Menunggu Persetujuan',1,'2026-06-11 05:24:54','2026-06-11 05:24:54'),('d897db55-92a9-4bee-965d-78a72ab8543c','dae7fd28-a911-47f4-8aeb-d3f14a5b551d','APPROVED','Disetujui',1,'2026-06-11 05:24:54','2026-06-11 05:24:54'),('f0a59ecc-651b-41eb-b003-08f7910851e7','14b1b5ca-a82e-4dd8-a62c-55688eba7927','WAITING_APPROVAL','Menunggu Persetujuan',1,'2026-06-11 05:24:54','2026-06-11 05:24:54'),('f9c3d8b8-a8ca-436d-87f4-6ae467d8beba','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','APPROVED','Disetujui',1,'2026-06-11 05:24:54','2026-06-11 05:24:54');
/*!40000 ALTER TABLE `approval_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approval_steps`
--

DROP TABLE IF EXISTS `approval_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_steps` (
  `approval_step_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `approval_flow_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `step_order` int NOT NULL,
  `role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `step_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`approval_step_id`),
  UNIQUE KEY `approval_steps_approval_flow_id_step_order` (`approval_flow_id`,`step_order`),
  KEY `role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_steps`
--

LOCK TABLES `approval_steps` WRITE;
/*!40000 ALTER TABLE `approval_steps` DISABLE KEYS */;
INSERT INTO `approval_steps` VALUES ('09202b1c-ef05-497c-8b8e-3cb2ed2f7e31','c5c293f1-3615-4ed6-931d-e84c8de08b57',1,'2','Verifikasi','2026-07-11 10:33:57','2026-07-11 10:33:57'),('0b4e744d-cfcd-41bc-b123-2d01979f4e6a','355eca4c-d6f6-4b7a-8448-4d9b99ae578d',1,'2','Review Pengawas','2026-06-11 05:20:37','2026-06-11 05:20:37'),('1d546dbd-e7b1-4ae9-bcc1-54ac916d9499','14b1b5ca-a82e-4dd8-a62c-55688eba7927',3,'4','Pencairan Bendahara','2026-06-11 05:20:38','2026-06-11 05:20:38'),('2f3a49ff-c243-4c48-be76-864d919a1d9f','355eca4c-d6f6-4b7a-8448-4d9b99ae578d',2,'3','Approval Ketua','2026-06-11 05:20:37','2026-06-11 05:20:37'),('4e7a7f27-c78e-4b21-aca1-fa7e0f66953f','0c04764a-8c4c-4f79-afca-25c8530cd065',1,'2','Verifikasi Pengawas','2026-07-23 09:00:34','2026-07-23 09:00:34'),('52d1bef5-cb8e-4919-a88f-20b41b4c2edb','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01',2,'3','Approval Ketua','2026-06-11 05:20:37','2026-06-11 05:20:37'),('5451bd25-0db9-44fa-86d7-e38be5ee5374','bf046302-6819-41a4-b375-3340fb201bda',1,'2','Review Pengawas','2026-06-11 05:20:37','2026-06-11 05:20:37'),('741f63b9-2b69-4405-8e4d-a88741d33f3f','0c04764a-8c4c-4f79-afca-25c8530cd065',3,'4','Pencairan Bendahara','2026-07-23 09:34:25','2026-07-23 09:34:25'),('921b4cfd-da44-4507-9fa1-781128515015','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01',1,'2','Review Pengawas','2026-06-11 05:20:37','2026-06-11 05:20:37'),('aa78034f-529e-4bff-a620-16324a7e758b','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5',1,'2','Review Pengawas','2026-06-12 17:16:26','2026-06-12 17:16:26'),('accd3b83-97ec-4486-b9ee-9b12afad7775','bf046302-6819-41a4-b375-3340fb201bda',2,'3','Approval Ketua','2026-06-11 05:20:37','2026-06-11 05:20:37'),('ae3d446a-ba2a-43fd-969e-ea066fa84c3f','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5',3,'4','Pencairan Bendahara','2026-06-12 17:16:27','2026-06-12 17:16:27'),('bd75b0f1-63b9-420d-9d8c-16698a8763b4','c5c293f1-3615-4ed6-931d-e84c8de08b57',3,'4','Pencairan','2026-07-11 10:33:57','2026-07-11 10:33:57'),('c553f08f-eed7-4fcd-aa47-4762514e54b0','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5',2,'3','Approval Ketua','2026-06-12 17:16:27','2026-06-12 17:16:27'),('c764fb77-3deb-4080-9164-533cc3a6ebdc','bf046302-6819-41a4-b375-3340fb201bda',3,'4','Pencairan Bendahara','2026-06-11 05:20:37','2026-06-11 05:20:37'),('c7a56350-8064-49bc-8b9d-d9bb20261f2d','14b1b5ca-a82e-4dd8-a62c-55688eba7927',1,'2','Review Pengawas','2026-06-11 05:20:38','2026-06-11 05:20:38'),('cc92ea12-afb5-4924-aef0-a8d564e7bc52','c5c293f1-3615-4ed6-931d-e84c8de08b57',2,'3','Persetujuan','2026-07-11 10:33:57','2026-07-11 10:33:57'),('f09e8ead-d6ba-4064-9e01-5b980d2a1310','0c04764a-8c4c-4f79-afca-25c8530cd065',2,'3','Persetujuan Ketua','2026-07-23 09:00:34','2026-07-23 09:00:34'),('fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4','14b1b5ca-a82e-4dd8-a62c-55688eba7927',2,'3','Approval Ketua','2026-06-11 05:20:38','2026-06-11 05:20:38');
/*!40000 ALTER TABLE `approval_steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approvals`
--

DROP TABLE IF EXISTS `approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approvals` (
  `approval_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `approval_flow_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `approval_step_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `approver_member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `decision` enum('PENDING','APPROVED','REJECTED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `decision_datetime` datetime DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `entity_ref` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`approval_id`),
  KEY `approval_step_id` (`approval_step_id`),
  KEY `approver_member_id` (`approver_member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approvals`
--

LOCK TABLES `approvals` WRITE;
/*!40000 ALTER TABLE `approvals` DISABLE KEYS */;
INSERT INTO `approvals` VALUES ('00747410-be3f-4fee-9013-cd8ed7debe8b','14b1b5ca-a82e-4dd8-a62c-55688eba7927','c7a56350-8064-49bc-8b9d-d9bb20261f2d','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-04 17:54:35','Disetujui','savings_withdrawal','70d70f10-6424-408c-8fd6-c61994548439','2026-07-04 17:54:35','2026-07-04 17:54:35'),('0075e5a1-32d0-4f67-a3ff-5b1d39021445','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 11:25:18','lanjut kasih diskon 7jt','financing_applications','0f052691-fc1b-4865-bc0f-9a64555bac2e','2026-06-28 11:25:18','2026-06-28 11:25:18'),('0158f611-eb13-49fb-818b-3adae7e4df28','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-10 05:37:03','kasih diskon 700.000','financing_applications','5869361c-afcd-4fc2-8941-87aa81cba3a2','2026-07-10 05:37:03','2026-07-10 05:37:03'),('050bb0eb-db8e-4ae0-b002-cc92d23b79bd','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 11:35:12','approve','financing_applications','9d8c679f-02b0-4ef9-87fb-d2102e5db784','2026-06-28 11:35:12','2026-06-28 11:35:12'),('062fd503-a241-4691-a229-96660469812b','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 14:03:00','Disetujui','financing_applications','3282af71-207b-4fda-9d92-4892cb2c168f','2026-06-28 14:03:00','2026-06-28 14:03:00'),('09c683df-51c3-4460-bf57-035d60e0d563','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 11:02:48','Disetujui','financing_applications','ef991d7f-5d8f-475e-bc0a-228191029154','2026-06-28 11:02:48','2026-06-28 11:02:48'),('0ace442d-8ba1-4fd6-b19c-b96e04350994','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-13 07:53:31','Disetujui','financing_applications','ed8399fb-41c9-40cb-ab72-f2254964658d','2026-07-13 07:53:31','2026-07-13 07:53:31'),('0b4fd2b4-ef37-4e0f-9290-5f0f1e17f6cc','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-12 23:29:25','asdasd','financing_applications','ca4f7ad6-3d0e-428a-ba7f-9712863c00c5','2026-07-12 23:29:25','2026-07-12 23:29:25'),('0ce64e67-c1df-4db8-9731-16c3ae90fed0','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-20 10:48:07','Oke lanjut','financing_applications','197fac2c-1b2c-4b8b-b5bf-07ed64861a2d','2026-07-20 10:48:07','2026-07-20 10:48:07'),('0cfb551f-b8b1-4482-908e-c0c552cdfe45','14b1b5ca-a82e-4dd8-a62c-55688eba7927','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-27 21:04:38','Disetujui','savings_withdrawal','e3b3589d-7e16-4ba0-a923-c9346115d50a','2026-06-27 21:04:38','2026-06-27 21:04:38'),('0dc40806-8ba8-4e05-bd49-387030f98d81','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-21 15:58:05','Hhhhh','financing_applications','ae792540-ce34-4ebf-bec2-0bceac2e9120','2026-07-21 15:58:05','2026-07-21 15:58:05'),('0ec7a883-6271-49b7-b61d-15bcaf91ff2e','14b1b5ca-a82e-4dd8-a62c-55688eba7927','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-22 10:42:28','Disetujui','savings_withdrawal','06e7d5c1-65f2-47fd-9a41-f8f293a5774c','2026-07-22 10:42:28','2026-07-22 10:42:28'),('107de3a3-f33c-4c80-8129-4621dd13f542','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','52d1bef5-cb8e-4919-a88f-20b41b4c2edb','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 10:07:50','sudah ok','members','aa4c38c1-f577-48af-bf4a-3f7ab2089fea','2026-06-28 10:07:50','2026-06-28 10:07:50'),('11a70129-96f4-4eb4-812b-d507981156f3','c5c293f1-3615-4ed6-931d-e84c8de08b57','09202b1c-ef05-497c-8b8e-3cb2ed2f7e31','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-11 13:08:56','Disetujui','tabungan_withdrawals','52b039b4-71b8-4ea5-b238-9143625efe92','2026-07-11 13:08:56','2026-07-11 13:08:56'),('13e5c2fd-c281-4be4-b047-f309a62d504b','14b1b5ca-a82e-4dd8-a62c-55688eba7927','c7a56350-8064-49bc-8b9d-d9bb20261f2d','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-10 05:24:14','oke lanjut','savings_withdrawal','73b777cd-015f-4de8-a643-3edd0f4225c5','2026-07-10 05:24:14','2026-07-10 05:24:14'),('14188022-f429-4d2b-8f03-071308261e6d','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','ae3d446a-ba2a-43fd-969e-ea066fa84c3f','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-27 23:38:37','Disetujui','member_saving_targets','bd717ff2-a73c-4e08-a0b1-59c33b918c87','2026-06-27 23:38:37','2026-06-27 23:38:37'),('141afd60-a983-452d-a586-8462dac58841','14b1b5ca-a82e-4dd8-a62c-55688eba7927','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-22 06:24:57','asdasd','savings_withdrawal','c1fb93f6-b0a3-461c-bdc2-c592588c848f','2026-07-22 06:24:57','2026-07-22 06:24:57'),('156409a2-4a89-4cce-8f84-fd4fabe42465','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','52d1bef5-cb8e-4919-a88f-20b41b4c2edb','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-25 01:13:24','Disetujui','members','cbdc3ae9-2432-4e1f-ade9-6a39a9986445','2026-07-25 01:13:24','2026-07-25 01:13:24'),('17ef97d9-d00a-4fe9-ab46-b7f144342973','14b1b5ca-a82e-4dd8-a62c-55688eba7927','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-28 10:51:26','Disetujui','savings_withdrawal','dc873961-e0ee-45ce-afca-e456a133e971','2026-06-28 10:51:26','2026-06-28 10:51:26'),('1821a7d5-0200-4144-a87b-5f9761454f34','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 11:26:54','Disetujui','financing_applications','0f052691-fc1b-4865-bc0f-9a64555bac2e','2026-06-28 11:26:54','2026-06-28 11:26:54'),('1c313028-c260-4dd8-a552-b840f4f555ad','0c04764a-8c4c-4f79-afca-25c8530cd065','4e7a7f27-c78e-4b21-aca1-fa7e0f66953f','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-23 09:38:17','ok','exit_requests','71485dac-543a-4a74-9468-decc51b5d1d8','2026-07-23 09:38:17','2026-07-23 09:38:17'),('1d121fc5-ce5f-4f87-a145-16755337cf02','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','ae3d446a-ba2a-43fd-969e-ea066fa84c3f','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-27 23:38:47','Disetujui','member_saving_targets','a3e91f8d-d023-4d40-9f78-bf2cce1305bd','2026-06-27 23:38:47','2026-06-27 23:38:47'),('1e8bb989-456e-44d5-960d-c7cd8ce7aa13','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-12 23:31:25','fdfsdfs','financing_applications','ca4f7ad6-3d0e-428a-ba7f-9712863c00c5','2026-07-12 23:31:25','2026-07-12 23:31:25'),('2042f81b-8ec8-4da4-b5f4-122cbe0b2fe8','c5c293f1-3615-4ed6-931d-e84c8de08b57','cc92ea12-afb5-4924-aef0-a8d564e7bc52','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-11 11:34:28','lanjut','tabungan_withdrawals','7da294b0-ffcb-479f-bdd1-535ad155aa4f','2026-07-11 11:34:28','2026-07-11 11:34:28'),('221299e2-7386-4e0e-87c4-85bb6fbdf45f','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 14:06:34','Disetujui','financing_applications','51f924fd-e02d-45f9-95df-fbecead37f89','2026-06-28 14:06:34','2026-06-28 14:06:34'),('240e032c-9ab1-45b9-8f61-45d3be4e5923','14b1b5ca-a82e-4dd8-a62c-55688eba7927','c7a56350-8064-49bc-8b9d-d9bb20261f2d','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-22 10:46:59','Disetujui','savings_withdrawal','cb6cb9c5-ae22-420b-b1ac-aa53d6852ab7','2026-07-22 10:46:59','2026-07-22 10:46:59'),('243d4584-40af-4660-934a-2b7150757098','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','921b4cfd-da44-4507-9fa1-781128515015','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-21 15:11:55','Okeh','members','4bd09b20-7c9e-4c5b-83d3-2dcb3426bf4c','2026-07-21 15:11:55','2026-07-21 15:11:55'),('26b349db-429e-45e4-ba36-f1ef091468b8','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','921b4cfd-da44-4507-9fa1-781128515015','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-25 01:12:50','Disetujui','members','cbdc3ae9-2432-4e1f-ade9-6a39a9986445','2026-07-25 01:12:50','2026-07-25 01:12:50'),('272d170f-ea89-464a-881c-f43be04cfb07','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-10 05:43:42','Disetujui','financing_applications','0a2eaf33-5931-40a1-8032-4cf23e91dd95','2026-07-10 05:43:42','2026-07-10 05:43:42'),('29a388a6-8c5d-4000-a6da-ddbd6d41d472','14b1b5ca-a82e-4dd8-a62c-55688eba7927','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-27 20:59:51','Disetujui','savings_withdrawal','d8c58f53-5e76-440f-a7ee-fff7ef4a6730','2026-06-27 20:59:51','2026-06-27 20:59:51'),('29fa04d7-ec37-4cfb-8452-9e7b800b80bf','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-28 11:07:58','ada diskon \n','financing_applications','d1231c9b-c32b-4560-8e7b-a6420dfdf5db','2026-06-28 11:07:58','2026-06-28 11:07:58'),('2a970c4d-3347-4c3a-b780-ba89bc53914a','14b1b5ca-a82e-4dd8-a62c-55688eba7927','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-21 15:35:38','lanjut','savings_withdrawal','b8d0aa4b-c83a-400a-96ec-33b2f9a8657c','2026-07-21 15:35:38','2026-07-21 15:35:38'),('2b66cd0f-04a6-48f0-aa2f-7213f20bd57f','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-10 05:28:07','lanjut','financing_applications','5ab78b36-2690-417c-b048-c9ca435082e0','2026-07-10 05:28:07','2026-07-10 05:28:07'),('2cf64658-3f6e-45fe-a305-23ec457e7494','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-20 16:15:25','Disetujui','financing_applications','162072e2-bea3-4d9f-b92e-1afe855156ab','2026-07-20 16:15:25','2026-07-20 16:15:25'),('2d7c152d-d623-4511-bad8-00062980fc3d','14b1b5ca-a82e-4dd8-a62c-55688eba7927','c7a56350-8064-49bc-8b9d-d9bb20261f2d','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-19 08:44:59','Oke lanjut','savings_withdrawal','72bc481a-5702-4354-b0fe-1251d4c42e58','2026-07-19 08:44:59','2026-07-19 08:44:59'),('2e093838-bbec-4784-a39d-d0f3bed3d2db','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 11:19:15','oke setuju kasih diskon','financing_applications','490b7bf2-0360-4dba-b5f2-dd1eb010efeb','2026-06-28 11:19:15','2026-06-28 11:19:15'),('2eaf2c15-7ea9-4f5d-86bd-7eac9df8fc97','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 14:43:50','Disetujui','financing_applications','d7f3d05a-8728-4ba6-879e-6d8e6860a27f','2026-06-28 14:43:50','2026-06-28 14:43:50'),('2ee70d6e-5536-498c-a716-78694f8af511','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','52d1bef5-cb8e-4919-a88f-20b41b4c2edb','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-27 15:45:07','Disetujui','members','993c8641-791e-49f4-b69e-070f771bbc16','2026-06-27 15:45:07','2026-06-27 15:45:07'),('2fc2b368-c145-4e29-b8c7-3af682b8ee77','14b1b5ca-a82e-4dd8-a62c-55688eba7927','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-16 14:06:11','Disetujui','savings_withdrawal','8c74ca8d-66bc-40e4-84ce-3dac6dd21303','2026-06-16 14:06:11','2026-06-16 14:06:11'),('318e7286-fa1e-4d2b-b12e-91fb57dc900b','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-20 10:43:48','Lanjut','financing_applications','ebf9cfd6-e69e-4a69-aef1-7467102a7a9e','2026-07-20 10:43:48','2026-07-20 10:43:48'),('32c1e5f9-8457-4deb-b95d-bfb3294e9591','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','921b4cfd-da44-4507-9fa1-781128515015','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-20 00:25:39','Disetujui','members','845aa028-2452-4368-ae37-f22f61d1fe55','2026-06-20 00:25:39','2026-06-20 00:25:39'),('35457c43-b3ba-4e4d-86a1-c5c2f14f8f39','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','aa78034f-529e-4bff-a620-16324a7e758b','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-27 23:37:06','Disetujui','member_saving_targets','8eac3e7c-6dd3-47e1-84ee-2228df92ca92','2026-06-27 23:37:06','2026-06-27 23:37:06'),('359c45cf-81e1-4b5f-8369-e76d20e25efa','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-22 13:24:02','Disetujui','financing_applications','71ca8581-40ca-4cae-a0c0-bcb08c8fc502','2026-07-22 13:24:02','2026-07-22 13:24:02'),('360462f9-1fdb-42ed-b15f-228da259c275','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-22 13:24:41','Disetujui','financing_applications','71ca8581-40ca-4cae-a0c0-bcb08c8fc502','2026-07-22 13:24:41','2026-07-22 13:24:41'),('3671fd78-ad99-4ed7-b238-afb89e89bd73','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-20 10:48:42','Diskon pelunasan','financing_applications','197fac2c-1b2c-4b8b-b5bf-07ed64861a2d','2026-07-20 10:48:42','2026-07-20 10:48:42'),('3828bbdd-bbe5-4c9b-920a-a05f3b1e5b57','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 14:03:16','Disetujui','financing_applications','aa7b5b48-d165-480b-b9b2-89f775588f75','2026-06-28 14:03:16','2026-06-28 14:03:16'),('383c33e4-f572-4e90-8b6d-cfd982876d47','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 14:01:08','Disetujui','financing_applications','aa7b5b48-d165-480b-b9b2-89f775588f75','2026-06-28 14:01:08','2026-06-28 14:01:08'),('38d239d8-4c01-4626-994d-cb97284060b8','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','52d1bef5-cb8e-4919-a88f-20b41b4c2edb','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-25 01:13:18','Disetujui','members','05cb7dc0-14f2-4726-9118-9d50822301e8','2026-07-25 01:13:18','2026-07-25 01:13:18'),('3abe877e-39b7-4653-93e8-d05ad8313472','14b1b5ca-a82e-4dd8-a62c-55688eba7927','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-27 21:28:36','Disetujui','savings_withdrawal','52ac4636-453d-469f-9311-e187e069982a','2026-06-27 21:28:36','2026-06-27 21:28:36'),('3b178bdd-b652-47da-ac3c-c013e103b5d4','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 11:01:43','oke','financing_applications','d1231c9b-c32b-4560-8e7b-a6420dfdf5db','2026-06-28 11:01:43','2026-06-28 11:01:43'),('3cbbea64-aa7f-4d7a-be02-8a4e48b3f398','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','aa78034f-529e-4bff-a620-16324a7e758b','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-27 23:39:17','Disetujui','member_saving_targets','d920f317-809a-4841-ac15-bb11b80106c6','2026-06-27 23:39:17','2026-06-27 23:39:17'),('3cf41eca-2196-4b65-96d7-36f8a3823c39','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 11:34:50','approve','financing_applications','2cbef909-93b9-4521-a12b-97470159bffb','2026-06-28 11:34:50','2026-06-28 11:34:50'),('3d221d22-e412-4679-8a93-9a8c30e9bb49','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','921b4cfd-da44-4507-9fa1-781128515015','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-25 01:27:16','Disetujui','members','96a41a6b-081e-488e-b339-a6de32311267','2026-07-25 01:27:16','2026-07-25 01:27:16'),('41bc9dae-57bb-4213-9eff-509d824cd514','14b1b5ca-a82e-4dd8-a62c-55688eba7927','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 10:30:50','Disetujui','savings_withdrawal','5f6c157a-9569-4205-829f-84103313f7c6','2026-06-28 10:30:50','2026-06-28 10:30:50'),('4367feda-2225-4bec-a341-5e069d76ca28','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','52d1bef5-cb8e-4919-a88f-20b41b4c2edb','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-22 06:04:32','Disetujui','members','9cdaeba3-619d-4ce4-83db-6e32c236aabb','2026-07-22 06:04:32','2026-07-22 06:04:32'),('43fbff71-5832-4e28-897b-afeaaf57b70d','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-20 10:47:31','Oke lanjut','financing_applications','197fac2c-1b2c-4b8b-b5bf-07ed64861a2d','2026-07-20 10:47:31','2026-07-20 10:47:31'),('4a45d7e9-dfe2-4b76-847b-dd6ab22714ce','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-20 10:41:26','Lanjutkan','financing_applications','26c1b1aa-fbbe-42ef-a9a2-fc823f646597','2026-07-20 10:41:26','2026-07-20 10:41:26'),('4b282780-0ad2-4447-a6d6-78531dd23003','14b1b5ca-a82e-4dd8-a62c-55688eba7927','c7a56350-8064-49bc-8b9d-d9bb20261f2d','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-22 07:44:24','Disetujui','savings_withdrawal','06e7d5c1-65f2-47fd-9a41-f8f293a5774c','2026-07-22 07:44:24','2026-07-22 07:44:24'),('4b68e868-f113-4fd5-bc97-d6f44fc49ace','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-10 05:37:35','oke sudah','financing_applications','5869361c-afcd-4fc2-8941-87aa81cba3a2','2026-07-10 05:37:35','2026-07-10 05:37:35'),('4ca075f1-b5a3-4d6e-94d7-d0a7af5b0632','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-19 09:00:54','Disetujui','financing_applications','26c1b1aa-fbbe-42ef-a9a2-fc823f646597','2026-07-19 09:00:54','2026-07-19 09:00:54'),('4dc52c7f-d715-400b-b8ba-4d77117fe2be','14b1b5ca-a82e-4dd8-a62c-55688eba7927','c7a56350-8064-49bc-8b9d-d9bb20261f2d','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-27 21:04:22','Disetujui','savings_withdrawal','e3b3589d-7e16-4ba0-a923-c9346115d50a','2026-06-27 21:04:22','2026-06-27 21:04:22'),('52918a7a-e50c-402b-b93d-32297f6c7cda','14b1b5ca-a82e-4dd8-a62c-55688eba7927','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-16 14:07:39','Disetujui','savings_withdrawal','8c74ca8d-66bc-40e4-84ce-3dac6dd21303','2026-06-16 14:07:39','2026-06-16 14:07:39'),('542f7034-28a4-4c30-a785-7a3709dbda01','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-10 06:00:17','Disetujui','financing_applications','982c5915-a8e9-44da-bc27-15b6a6a226c3','2026-07-10 06:00:17','2026-07-10 06:00:17'),('55934c00-5265-4ff3-a309-e639d2f98d0b','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 01:26:05','test','financing_applications','d36aa642-0645-4572-bdd9-3a9c3ae82f8d','2026-06-28 01:26:05','2026-06-28 01:26:05'),('56d3e8b2-2162-4350-a48f-8dfd6b11710a','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-10 05:53:09','lanjut','financing_applications','84390efa-7232-4522-ad99-59ea03abbc3c','2026-07-10 05:53:09','2026-07-10 05:53:09'),('57118232-b635-4e15-829b-3bc4c4ddb7fe','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','921b4cfd-da44-4507-9fa1-781128515015','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 10:03:09','Disetujui','members','aa4c38c1-f577-48af-bf4a-3f7ab2089fea','2026-06-28 10:03:09','2026-06-28 10:03:09'),('57791eff-835f-49d9-a8a9-232270604723','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-20 16:16:33','Disetujui','financing_applications','162072e2-bea3-4d9f-b92e-1afe855156ab','2026-07-20 16:16:33','2026-07-20 16:16:33'),('58728228-d737-40f3-a78b-417d35ae6013','14b1b5ca-a82e-4dd8-a62c-55688eba7927','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-27 21:05:20','Disetujui','savings_withdrawal','d8c58f53-5e76-440f-a7ee-fff7ef4a6730','2026-06-27 21:05:20','2026-06-27 21:05:20'),('5a4669aa-f222-4aac-939c-b1992539dd4d','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-10 05:52:03','oke','financing_applications','84390efa-7232-4522-ad99-59ea03abbc3c','2026-07-10 05:52:03','2026-07-10 05:52:03'),('5a9b766c-c98d-478a-a6f3-9e28596de1b3','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-28 14:49:52','Disetujui','financing_applications','d7f3d05a-8728-4ba6-879e-6d8e6860a27f','2026-06-28 14:49:52','2026-06-28 14:49:52'),('5b26d144-d31f-4511-bccf-32c96cb8d4f2','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','ae3d446a-ba2a-43fd-969e-ea066fa84c3f','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-11 13:03:09','Disetujui','member_saving_targets','9bd1c1c1-ab12-4d95-a6bb-80867eff5ad0','2026-07-11 13:03:09','2026-07-11 13:03:09'),('5d8da9a8-17ec-411c-9bf0-aa93b705289d','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-28 14:04:08','Disetujui','financing_applications','3282af71-207b-4fda-9d92-4892cb2c168f','2026-06-28 14:04:08','2026-06-28 14:04:08'),('5ddd65f9-7c33-4dd8-bd48-e01fa74c1e1a','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','52d1bef5-cb8e-4919-a88f-20b41b4c2edb','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-04 15:11:57','Disetujui','members','b08024e6-a58b-4ef0-8807-b2fe11a49d55','2026-07-04 15:11:57','2026-07-04 15:11:57'),('60b182e7-b838-407d-897c-dfaa11341f74','14b1b5ca-a82e-4dd8-a62c-55688eba7927','c7a56350-8064-49bc-8b9d-d9bb20261f2d','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-27 20:59:37','Disetujui','savings_withdrawal','d8c58f53-5e76-440f-a7ee-fff7ef4a6730','2026-06-27 20:59:37','2026-06-27 20:59:37'),('617b7660-c48a-41cd-a844-b8a570aa5a09','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-12 23:49:26','dsfsdf','financing_applications','0c2a6dd8-c22e-4fd4-9783-a3c5709ecd94','2026-07-12 23:49:26','2026-07-12 23:49:26'),('626d37b1-d83f-410f-88ec-7d55c798ea37','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 11:02:08','lanjut','financing_applications','ef991d7f-5d8f-475e-bc0a-228191029154','2026-06-28 11:02:08','2026-06-28 11:02:08'),('667ce4c7-677c-4984-b408-d5657bc18b01','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-12 23:34:53','test','financing_applications','c7fabe18-2733-419c-b646-5bd1676eca6c','2026-07-12 23:34:53','2026-07-12 23:34:53'),('66ee070a-dd35-41c4-a62d-1c9f376e88c0','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','ae3d446a-ba2a-43fd-969e-ea066fa84c3f','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-27 06:39:23','Disetujui','member_saving_targets','36ac5941-b95c-4c04-9ea3-2f285d81f27c','2026-06-27 06:39:23','2026-06-27 06:39:23'),('68a99994-f32c-4416-92bf-73879dd9a276','14b1b5ca-a82e-4dd8-a62c-55688eba7927','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-22 10:56:28','Disetujui','savings_withdrawal','cb6cb9c5-ae22-420b-b1ac-aa53d6852ab7','2026-07-22 10:56:28','2026-07-22 10:56:28'),('69a71416-f9e9-4b4e-9c39-3077808b4b1d','14b1b5ca-a82e-4dd8-a62c-55688eba7927','c7a56350-8064-49bc-8b9d-d9bb20261f2d','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-27 21:27:26','Disetujui','savings_withdrawal','52ac4636-453d-469f-9311-e187e069982a','2026-06-27 21:27:26','2026-06-27 21:27:26'),('6a36f020-fa93-45eb-a6b1-ea66c7801691','14b1b5ca-a82e-4dd8-a62c-55688eba7927','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-21 15:37:16','lanjutkan','savings_withdrawal','b8d0aa4b-c83a-400a-96ec-33b2f9a8657c','2026-07-21 15:37:16','2026-07-21 15:37:16'),('6b2649e0-be9b-44d7-94d3-00475bb48463','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','921b4cfd-da44-4507-9fa1-781128515015','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-04 15:09:35','Disetujui','members','b08024e6-a58b-4ef0-8807-b2fe11a49d55','2026-07-04 15:09:35','2026-07-04 15:09:35'),('6bc2e8f9-0190-430d-92ab-aa29f9138c70','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','c553f08f-eed7-4fcd-aa47-4762514e54b0','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-27 06:39:14','Disetujui','member_saving_targets','36ac5941-b95c-4c04-9ea3-2f285d81f27c','2026-06-27 06:39:14','2026-06-27 06:39:14'),('6ec507c1-6849-415e-bbca-10447203ce45','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-20 10:51:07','Kasih. Aja','financing_applications','f0b03fda-448e-42ef-813b-b422e6d16c7c','2026-07-20 10:51:07','2026-07-20 10:51:07'),('6f1bca60-1723-456a-8bdd-273366ae0a57','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','aa78034f-529e-4bff-a620-16324a7e758b','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-27 06:38:58','Disetujui','member_saving_targets','36ac5941-b95c-4c04-9ea3-2f285d81f27c','2026-06-27 06:38:58','2026-06-27 06:38:58'),('6f1c2835-a385-410a-80de-91d0d0dc37bc','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-22 13:25:44','ggggggg','financing_applications','71ca8581-40ca-4cae-a0c0-bcb08c8fc502','2026-07-22 13:25:44','2026-07-22 13:25:44'),('70308830-6100-4c29-8dcb-422d4e96450b','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 14:00:52','Disetujui','financing_applications','3282af71-207b-4fda-9d92-4892cb2c168f','2026-06-28 14:00:52','2026-06-28 14:00:52'),('717c6e98-ed4d-47f3-8a5c-b79745a83333','14b1b5ca-a82e-4dd8-a62c-55688eba7927','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-10 05:25:08','lanjut','savings_withdrawal','73b777cd-015f-4de8-a643-3edd0f4225c5','2026-07-10 05:25:08','2026-07-10 05:25:08'),('7242710c-20d4-4d73-abfe-9be21f29cb3c','14b1b5ca-a82e-4dd8-a62c-55688eba7927','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-20 00:29:37','Disetujui','savings_withdrawal','9d14a828-231e-42e0-adc8-f51a75c324f7','2026-06-20 00:29:37','2026-06-20 00:29:37'),('73a4d3ea-3130-473a-a54f-460a537f46b0','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-28 14:03:49','Disetujui','financing_applications','aa7b5b48-d165-480b-b9b2-89f775588f75','2026-06-28 14:03:49','2026-06-28 14:03:49'),('756d7a7c-f5ae-427d-a39e-715ddf0011f5','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-20 10:44:25','Lanjutkan','financing_applications','ebf9cfd6-e69e-4a69-aef1-7467102a7a9e','2026-07-20 10:44:25','2026-07-20 10:44:25'),('75f79cf5-02ba-4a7d-aaea-528be4c75584','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-20 11:11:02','oke','financing_applications','dba222dd-1042-4bb0-ac4f-24ad93afbe7e','2026-07-20 11:11:02','2026-07-20 11:11:02'),('75fc102e-b390-4785-92e8-203392140cbe','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','52d1bef5-cb8e-4919-a88f-20b41b4c2edb','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 09:54:46','Disetujui','members','28d1fa84-65ab-48d1-9543-0982afdae987','2026-06-28 09:54:46','2026-06-28 09:54:46'),('78407f08-6784-4c31-948e-08fabab1f6ab','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-10 05:36:31','ok ','financing_applications','5869361c-afcd-4fc2-8941-87aa81cba3a2','2026-07-10 05:36:31','2026-07-10 05:36:31'),('7aa1df59-5882-4f63-b9c9-df7cbd844e83','14b1b5ca-a82e-4dd8-a62c-55688eba7927','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-10 05:24:41','lanjut','savings_withdrawal','73b777cd-015f-4de8-a643-3edd0f4225c5','2026-07-10 05:24:41','2026-07-10 05:24:41'),('7c203168-6bd4-4e61-9f6c-654fa6e6ce2c','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','aa78034f-529e-4bff-a620-16324a7e758b','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-11 09:06:43','Disetujui','member_saving_targets','258a5048-61af-4cee-ae65-50fa43096df1','2026-07-11 09:06:43','2026-07-11 09:06:43'),('7e99807a-dd1d-478b-ae6f-48a31aeda28c','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','52d1bef5-cb8e-4919-a88f-20b41b4c2edb','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-21 15:19:43','lanjutkan ','members','4bd09b20-7c9e-4c5b-83d3-2dcb3426bf4c','2026-07-21 15:19:43','2026-07-21 15:19:43'),('7f9a1b54-b880-47a0-9d69-4c653d8ec619','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','921b4cfd-da44-4507-9fa1-781128515015','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-22 06:03:56','oke lanjut','members','9cdaeba3-619d-4ce4-83db-6e32c236aabb','2026-07-22 06:03:56','2026-07-22 06:03:56'),('81e3e743-02d5-4f06-922b-e14c228633b9','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-28 11:05:40','transport dan legal','financing_applications','ef991d7f-5d8f-475e-bc0a-228191029154','2026-06-28 11:05:40','2026-06-28 11:05:40'),('8834651c-feea-4719-a85e-ee60a8ba28c5','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-21 15:57:00','Ok lanjut ','financing_applications','ae792540-ce34-4ebf-bec2-0bceac2e9120','2026-07-21 15:57:00','2026-07-21 15:57:00'),('89b03423-34f1-4895-b32b-bf86bb052cbe','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-12 23:46:16','asdasd','financing_applications','047a1b81-ea9c-4586-bb4d-f10c3b5885a1','2026-07-12 23:46:16','2026-07-12 23:46:16'),('8e0ee0dc-8a55-4c19-af64-1881def8737e','14b1b5ca-a82e-4dd8-a62c-55688eba7927','c7a56350-8064-49bc-8b9d-d9bb20261f2d','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 10:46:32','oke lanjut','savings_withdrawal','dc873961-e0ee-45ce-afca-e456a133e971','2026-06-28 10:46:32','2026-06-28 10:46:32'),('8e3ab31d-16c0-498b-bfeb-ba5bca7deac1','14b1b5ca-a82e-4dd8-a62c-55688eba7927','c7a56350-8064-49bc-8b9d-d9bb20261f2d','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-04 18:23:36','Oke','savings_withdrawal','70715c92-8e76-45f4-8efa-4f455c2caf1f','2026-07-04 18:23:36','2026-07-04 18:23:36'),('8ec43f28-8361-42d9-b2ef-2f89bd9ba1b8','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','921b4cfd-da44-4507-9fa1-781128515015','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-18 21:35:47','Disetujui oleh Pengawas','members','c124f2c8-558b-454d-8ec7-614d118c4cef','2026-06-18 21:35:47','2026-06-18 21:35:47'),('8ed0558b-f089-48e4-8d39-52328c6dbd9b','14b1b5ca-a82e-4dd8-a62c-55688eba7927','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-12 23:01:53','Disetujui','savings_withdrawal','1891a509-17ba-4632-b996-b6f20b934d77','2026-07-12 23:01:53','2026-07-12 23:01:53'),('8f7d1d53-3e03-4e99-8513-4a1449e480a4','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','52d1bef5-cb8e-4919-a88f-20b41b4c2edb','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-20 00:25:51','Disetujui','members','845aa028-2452-4368-ae37-f22f61d1fe55','2026-06-20 00:25:51','2026-06-20 00:25:51'),('90cf3658-3485-43ef-be41-c10ecb5cf07f','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','52d1bef5-cb8e-4919-a88f-20b41b4c2edb','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 09:58:35','Disetujui','members','ce0c9410-71b8-411d-a13e-174902d3503c','2026-06-28 09:58:35','2026-06-28 09:58:35'),('94066d92-1eba-42a7-b506-ab4a224608ca','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','aa78034f-529e-4bff-a620-16324a7e758b','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-27 18:06:37','Disetujui','member_saving_targets','7c69914d-42ce-4e53-91b1-09f7556ec73a','2026-06-27 18:06:37','2026-06-27 18:06:37'),('95a8b36a-1513-4f6e-891d-76e2d43615f9','14b1b5ca-a82e-4dd8-a62c-55688eba7927','c7a56350-8064-49bc-8b9d-d9bb20261f2d','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-22 06:21:41','Disetujui','savings_withdrawal','c1fb93f6-b0a3-461c-bdc2-c592588c848f','2026-07-22 06:21:41','2026-07-22 06:21:41'),('9829ca18-1bba-4c37-b750-1cdb949a9ae2','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-22 11:38:06','Disetujui','financing_applications','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','2026-07-22 11:38:06','2026-07-22 11:38:06'),('9ab5c312-9928-41b9-9cc9-573e144f4021','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 14:43:25','Disetujui','financing_applications','d7f3d05a-8728-4ba6-879e-6d8e6860a27f','2026-06-28 14:43:25','2026-06-28 14:43:25'),('9c080011-e10c-4ad4-bae0-cd16c792c927','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-22 11:31:59','Disetujui','financing_applications','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','2026-07-22 11:31:59','2026-07-22 11:31:59'),('9e1a0412-0063-4a78-8009-93c7054d7e64','14b1b5ca-a82e-4dd8-a62c-55688eba7927','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-19 08:45:36','Lanjut','savings_withdrawal','72bc481a-5702-4354-b0fe-1251d4c42e58','2026-07-19 08:45:36','2026-07-19 08:45:36'),('a0a9815b-9f61-4044-acd4-e3ee1d30b58b','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','c553f08f-eed7-4fcd-aa47-4762514e54b0','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-27 18:06:50','Disetujui','member_saving_targets','7c69914d-42ce-4e53-91b1-09f7556ec73a','2026-06-27 18:06:50','2026-06-27 18:06:50'),('a1665dd7-99c5-4db0-9506-a254ddea5819','14b1b5ca-a82e-4dd8-a62c-55688eba7927','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-12 23:01:26','Disetujui','savings_withdrawal','1891a509-17ba-4632-b996-b6f20b934d77','2026-07-12 23:01:26','2026-07-12 23:01:26'),('a16ab323-959c-4975-a2c1-a7674208961d','14b1b5ca-a82e-4dd8-a62c-55688eba7927','c7a56350-8064-49bc-8b9d-d9bb20261f2d','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-12 23:01:01','oke\n','savings_withdrawal','1891a509-17ba-4632-b996-b6f20b934d77','2026-07-12 23:01:01','2026-07-12 23:01:01'),('a1c78ef0-b311-493d-83ae-53b8032f935e','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','c553f08f-eed7-4fcd-aa47-4762514e54b0','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-13 07:48:02','Disetujui','member_saving_targets','39f07132-5fa6-487c-ad9d-53706cc49fc2','2026-07-13 07:48:02','2026-07-13 07:48:02'),('a3a2a863-6983-4406-b321-39a7bc327eb4','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-20 10:42:17','Biaya operasional ','financing_applications','26c1b1aa-fbbe-42ef-a9a2-fc823f646597','2026-07-20 10:42:17','2026-07-20 10:42:17'),('a447851e-0b96-4043-802b-f1031817b3cf','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','921b4cfd-da44-4507-9fa1-781128515015','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-19 08:14:28','Oke lanjut','members','254317fd-7bf7-4dfe-a573-198fa700d91a','2026-07-19 08:14:28','2026-07-19 08:14:28'),('a4c9991b-18cd-4d7d-ab3b-76500e5251f3','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-21 16:15:10','Disetujui','financing_applications','cd989fb3-4917-4edb-8c7f-b15e63bab308','2026-07-21 16:15:10','2026-07-21 16:15:10'),('a6add86b-53a6-4aa9-812b-5a70e60e4ff5','14b1b5ca-a82e-4dd8-a62c-55688eba7927','c7a56350-8064-49bc-8b9d-d9bb20261f2d','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-20 00:28:49','Disetujui','savings_withdrawal','9d14a828-231e-42e0-adc8-f51a75c324f7','2026-06-20 00:28:49','2026-06-20 00:28:49'),('a91b7b71-b206-4cc8-88f6-3aa2dbe79fcd','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-28 11:21:06','Disetujui','financing_applications','490b7bf2-0360-4dba-b5f2-dd1eb010efeb','2026-06-28 11:21:06','2026-06-28 11:21:06'),('a94df084-99c0-4219-a716-eae1ebc166f4','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-28 11:36:28','ok','financing_applications','9d8c679f-02b0-4ef9-87fb-d2102e5db784','2026-06-28 11:36:28','2026-06-28 11:36:28'),('aac8787f-1a70-4694-8ac7-467741afb65e','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-20 10:50:36','Oke','financing_applications','f0b03fda-448e-42ef-813b-b422e6d16c7c','2026-07-20 10:50:36','2026-07-20 10:50:36'),('abdea5fd-efae-4b95-8547-c6d2528b0c33','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-20 16:15:54','Disetujui','financing_applications','162072e2-bea3-4d9f-b92e-1afe855156ab','2026-07-20 16:15:54','2026-07-20 16:15:54'),('abe99be1-d695-4582-8fc7-f19168718de7','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','c553f08f-eed7-4fcd-aa47-4762514e54b0','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-11 13:02:48','Disetujui','member_saving_targets','9bd1c1c1-ab12-4d95-a6bb-80867eff5ad0','2026-07-11 13:02:48','2026-07-11 13:02:48'),('af56ba14-02a6-460a-a14a-7b2c855c8c65','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','921b4cfd-da44-4507-9fa1-781128515015','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 09:52:55','Disetujui','members','28d1fa84-65ab-48d1-9543-0982afdae987','2026-06-28 09:52:55','2026-06-28 09:52:55'),('afdb8296-d4ad-4de6-8955-125f2d28ccbc','c5c293f1-3615-4ed6-931d-e84c8de08b57','cc92ea12-afb5-4924-aef0-a8d564e7bc52','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-11 13:09:14','Disetujui','tabungan_withdrawals','52b039b4-71b8-4ea5-b238-9143625efe92','2026-07-11 13:09:14','2026-07-11 13:09:14'),('b4f7ba33-8023-44e4-862b-9d2141857d2f','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','52d1bef5-cb8e-4919-a88f-20b41b4c2edb','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-19 08:15:45','Siapp ketua','members','254317fd-7bf7-4dfe-a573-198fa700d91a','2026-07-19 08:15:45','2026-07-19 08:15:45'),('b529e1be-5acd-40dc-9eff-83a957a966fb','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-22 13:34:50','hhhhh','financing_applications','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','2026-07-22 13:34:50','2026-07-22 13:34:50'),('b80c987e-e81c-4995-abd3-72a84fb34d90','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-12 23:48:39','Disetujui','financing_applications','0c2a6dd8-c22e-4fd4-9783-a3c5709ecd94','2026-07-12 23:48:39','2026-07-12 23:48:39'),('bbe735b2-c8a9-458d-8229-805d6f2e6f82','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-20 10:55:33','Disetujui','financing_applications','dba222dd-1042-4bb0-ac4f-24ad93afbe7e','2026-07-20 10:55:33','2026-07-20 10:55:33'),('bda9cb83-1684-4e5c-adb1-72ced7d37a6b','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','aa78034f-529e-4bff-a620-16324a7e758b','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-27 23:37:24','Disetujui','member_saving_targets','bd717ff2-a73c-4e08-a0b1-59c33b918c87','2026-06-27 23:37:24','2026-06-27 23:37:24'),('be991b63-6a76-4797-9d60-32c2b80e25b7','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-12 23:31:48','Disetujui','financing_applications','ca4f7ad6-3d0e-428a-ba7f-9712863c00c5','2026-07-12 23:31:48','2026-07-12 23:31:48'),('bece6f2c-bd0c-45fb-9cbb-d95dc2b85a85','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','52d1bef5-cb8e-4919-a88f-20b41b4c2edb','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 09:59:14','Disetujui','members','8c17a15e-19e6-4698-91ee-668858f5c61e','2026-06-28 09:59:14','2026-06-28 09:59:14'),('c07a2d87-6509-4797-b8bd-cb519dfbc46d','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','921b4cfd-da44-4507-9fa1-781128515015','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-27 15:44:59','Disetujui','members','993c8641-791e-49f4-b69e-070f771bbc16','2026-06-27 15:44:59','2026-06-27 15:44:59'),('c1b6f8a4-d179-417a-b2fe-e0a385cee10b','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','ae3d446a-ba2a-43fd-969e-ea066fa84c3f','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-27 23:38:28','Disetujui','member_saving_targets','8eac3e7c-6dd3-47e1-84ee-2228df92ca92','2026-06-27 23:38:28','2026-06-27 23:38:28'),('c2d71381-d87d-4983-9fee-2573871ae230','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-28 11:28:50','Disetujui','financing_applications','0f052691-fc1b-4865-bc0f-9a64555bac2e','2026-06-28 11:28:50','2026-06-28 11:28:50'),('c400b557-85ef-4d9b-846d-476a517f2b50','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','921b4cfd-da44-4507-9fa1-781128515015','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 09:58:48','Disetujui','members','8c17a15e-19e6-4698-91ee-668858f5c61e','2026-06-28 09:58:48','2026-06-28 09:58:48'),('c42b506c-04d0-41b1-bc9d-2964e06254cc','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-12 23:44:51','oke\n','financing_applications','047a1b81-ea9c-4586-bb4d-f10c3b5885a1','2026-07-12 23:44:51','2026-07-12 23:44:51'),('c4bf0934-c9c6-498e-a36c-3ab4a229185c','14b1b5ca-a82e-4dd8-a62c-55688eba7927','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 10:48:17','Disetujui','savings_withdrawal','dc873961-e0ee-45ce-afca-e456a133e971','2026-06-28 10:48:17','2026-06-28 10:48:17'),('c526a0b6-2d2e-43dc-840f-1054ae181356','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 11:35:57','Disetujui','financing_applications','9d8c679f-02b0-4ef9-87fb-d2102e5db784','2026-06-28 11:35:57','2026-06-28 11:35:57'),('c608beee-7fd7-4520-b547-b1be7c982607','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','52d1bef5-cb8e-4919-a88f-20b41b4c2edb','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-12 22:54:33','Disetujui','members','5bf49f02-1ed4-4b24-aab0-10d045d86ea8','2026-07-12 22:54:33','2026-07-12 22:54:33'),('c6b68205-91bc-4304-bbcc-0c10e254b2c7','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','ae3d446a-ba2a-43fd-969e-ea066fa84c3f','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-11 09:15:42','siapp','member_saving_targets','258a5048-61af-4cee-ae65-50fa43096df1','2026-07-11 09:15:42','2026-07-11 09:15:42'),('c6f030e1-05ad-4538-a9d8-635879c64a7d','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','REJECTED','2026-06-28 14:05:41','karena batch sudah terisi penuh','financing_applications','73f440b1-1c88-4a6b-908b-f9667f7ece73','2026-06-28 14:05:41','2026-06-28 14:05:41'),('c77ff81f-abc6-47c2-9973-36f10bae9eb5','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','c553f08f-eed7-4fcd-aa47-4762514e54b0','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-27 23:38:07','Disetujui','member_saving_targets','bd717ff2-a73c-4e08-a0b1-59c33b918c87','2026-06-27 23:38:07','2026-06-27 23:38:07'),('c8df532e-d377-406b-bce6-59e5b1f80efa','14b1b5ca-a82e-4dd8-a62c-55688eba7927','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-20 00:29:00','Disetujui','savings_withdrawal','9d14a828-231e-42e0-adc8-f51a75c324f7','2026-06-20 00:29:00','2026-06-20 00:29:00'),('c90788bf-5fc6-494d-93c4-c9fa5de6c187','14b1b5ca-a82e-4dd8-a62c-55688eba7927','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-22 07:47:48','Disetujui','savings_withdrawal','06e7d5c1-65f2-47fd-9a41-f8f293a5774c','2026-07-22 07:47:48','2026-07-22 07:47:48'),('c93018e7-c337-4707-972a-d1078dbea037','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','c553f08f-eed7-4fcd-aa47-4762514e54b0','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-27 23:39:35','Disetujui','member_saving_targets','d920f317-809a-4841-ac15-bb11b80106c6','2026-06-27 23:39:35','2026-06-27 23:39:35'),('c995972a-6bf6-436d-8dd9-c291db76a11d','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 11:20:22','ok kasih diskon 600','financing_applications','490b7bf2-0360-4dba-b5f2-dd1eb010efeb','2026-06-28 11:20:22','2026-06-28 11:20:22'),('ca2001be-80ff-47b5-988e-7ea71de67a49','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-28 11:36:37','Disetujui','financing_applications','2cbef909-93b9-4521-a12b-97470159bffb','2026-06-28 11:36:37','2026-06-28 11:36:37'),('cb809837-9d0c-4b85-9129-8687a62e29a4','14b1b5ca-a82e-4dd8-a62c-55688eba7927','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-04 17:56:51','okeh','savings_withdrawal','70d70f10-6424-408c-8fd6-c61994548439','2026-07-04 17:56:51','2026-07-04 17:56:51'),('cb9cc023-6e38-4b26-940f-c927f549e1b9','14b1b5ca-a82e-4dd8-a62c-55688eba7927','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-22 06:22:55','oke','savings_withdrawal','c1fb93f6-b0a3-461c-bdc2-c592588c848f','2026-07-22 06:22:55','2026-07-22 06:22:55'),('cc2e7b9f-dbda-4073-a124-210cf61abac8','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','c553f08f-eed7-4fcd-aa47-4762514e54b0','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-11 09:09:39','oke lanjut','member_saving_targets','258a5048-61af-4cee-ae65-50fa43096df1','2026-07-11 09:09:39','2026-07-11 09:09:39'),('cd873fa3-70a9-4443-a4b1-f4ab6d334d44','c5c293f1-3615-4ed6-931d-e84c8de08b57','bd75b0f1-63b9-420d-9d8c-16698a8763b4','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-11 13:09:40','Disetujui','tabungan_withdrawals','52b039b4-71b8-4ea5-b238-9143625efe92','2026-07-11 13:09:40','2026-07-11 13:09:40'),('cea2d1c7-6130-4c7e-af52-dea5d882d44f','14b1b5ca-a82e-4dd8-a62c-55688eba7927','c7a56350-8064-49bc-8b9d-d9bb20261f2d','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 10:30:25','Disetujui','savings_withdrawal','5f6c157a-9569-4205-829f-84103313f7c6','2026-06-28 10:30:25','2026-06-28 10:30:25'),('cee6a744-da22-4ddb-9df5-4e2eac2c4ddb','c5c293f1-3615-4ed6-931d-e84c8de08b57','09202b1c-ef05-497c-8b8e-3cb2ed2f7e31','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-11 11:09:44','oke','tabungan_withdrawals','7da294b0-ffcb-479f-bdd1-535ad155aa4f','2026-07-11 11:09:44','2026-07-11 11:09:44'),('d0dfd6a6-2017-4640-a566-f43646089adb','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','ae3d446a-ba2a-43fd-969e-ea066fa84c3f','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-13 07:53:15','Disetujui','member_saving_targets','39f07132-5fa6-487c-ad9d-53706cc49fc2','2026-07-13 07:53:15','2026-07-13 07:53:15'),('d1eecd63-1dd4-4ee4-86ae-4ca73c00ce6f','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-10 05:43:23','Disetujui','financing_applications','0a2eaf33-5931-40a1-8032-4cf23e91dd95','2026-07-10 05:43:23','2026-07-10 05:43:23'),('d2071e1c-0ce4-4f16-aea0-19c52157539f','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-13 07:47:44','ok','financing_applications','ed8399fb-41c9-40cb-ab72-f2254964658d','2026-07-13 07:47:44','2026-07-13 07:47:44'),('d44aabaa-e574-4ad7-b414-f2d9654d2fee','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-10 05:29:08','ada biaya bensin ya pak','financing_applications','5ab78b36-2690-417c-b048-c9ca435082e0','2026-07-10 05:29:08','2026-07-10 05:29:08'),('d4d42cf8-4a28-4c61-bf29-5dfbd4d52827','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','aa78034f-529e-4bff-a620-16324a7e758b','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-27 23:37:16','Disetujui','member_saving_targets','a3e91f8d-d023-4d40-9f78-bf2cce1305bd','2026-06-27 23:37:16','2026-06-27 23:37:16'),('d58de73c-9ee0-4936-bb30-88bb063c03d7','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-12 23:45:46','lanjut','financing_applications','047a1b81-ea9c-4586-bb4d-f10c3b5885a1','2026-07-12 23:45:46','2026-07-12 23:45:46'),('d5a48aca-a340-4b6f-bc00-19c334d3123b','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-22 11:35:07','Disetujui','financing_applications','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','2026-07-22 11:35:07','2026-07-22 11:35:07'),('d5bb0fbf-565d-4ca0-b36a-82d3f6929d3a','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-10 05:44:20','Disetujui','financing_applications','0a2eaf33-5931-40a1-8032-4cf23e91dd95','2026-07-10 05:44:20','2026-07-10 05:44:20'),('d6ee2197-7467-4b1b-83fe-194f91601320','14b1b5ca-a82e-4dd8-a62c-55688eba7927','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-28 10:32:32','oke lanjut','savings_withdrawal','5f6c157a-9569-4205-829f-84103313f7c6','2026-06-28 10:32:32','2026-06-28 10:32:32'),('d724666e-9c16-4b3c-be5f-a777ed3822b3','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','c553f08f-eed7-4fcd-aa47-4762514e54b0','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-27 23:37:49','Disetujui','member_saving_targets','8eac3e7c-6dd3-47e1-84ee-2228df92ca92','2026-06-27 23:37:49','2026-06-27 23:37:49'),('d75d2148-3d38-48ff-9442-54b00df4525a','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-22 13:40:30','Disetujui','financing_applications','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','2026-07-22 13:40:30','2026-07-22 13:40:30'),('d78f5a74-23f0-428a-aee2-8d746cf2991b','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-21 15:57:25','Disetujui','financing_applications','ae792540-ce34-4ebf-bec2-0bceac2e9120','2026-07-21 15:57:25','2026-07-21 15:57:25'),('d81b6828-c056-4b40-87ed-ac4cd92b2c09','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','ae3d446a-ba2a-43fd-969e-ea066fa84c3f','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-27 18:07:01','Disetujui','member_saving_targets','7c69914d-42ce-4e53-91b1-09f7556ec73a','2026-06-27 18:07:01','2026-06-27 18:07:01'),('ddcdf95c-2b4c-49c0-8b90-47bb65f76952','14b1b5ca-a82e-4dd8-a62c-55688eba7927','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-04 18:22:15','test','savings_withdrawal','70d70f10-6424-408c-8fd6-c61994548439','2026-07-04 18:22:15','2026-07-04 18:22:15'),('de0d0b34-ddcb-487f-93cd-d0c6853f8e85','c5c293f1-3615-4ed6-931d-e84c8de08b57','bd75b0f1-63b9-420d-9d8c-16698a8763b4','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-11 11:41:10','Disetujui','tabungan_withdrawals','7da294b0-ffcb-479f-bdd1-535ad155aa4f','2026-07-11 11:41:10','2026-07-11 11:41:10'),('de0f3cdf-ba4f-4545-98dd-f5053614028f','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','52d1bef5-cb8e-4919-a88f-20b41b4c2edb','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-18 21:36:08','Disetujui oleh Pengawas','members','c124f2c8-558b-454d-8ec7-614d118c4cef','2026-06-18 21:36:08','2026-06-18 21:36:08'),('de64588e-e3b5-4579-86b0-e3f9420fa857','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','aa78034f-529e-4bff-a620-16324a7e758b','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-11 13:02:23','oke','member_saving_targets','9bd1c1c1-ab12-4d95-a6bb-80867eff5ad0','2026-07-11 13:02:23','2026-07-11 13:02:23'),('dfc99cc4-2cef-4d49-8540-a3a6b03e4a60','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-10 05:58:53','Disetujui','financing_applications','982c5915-a8e9-44da-bc27-15b6a6a226c3','2026-07-10 05:58:53','2026-07-10 05:58:53'),('e042e019-a2e0-4349-9c9c-ecb2ad322789','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-21 16:12:58','lanjut','financing_applications','cd989fb3-4917-4edb-8c7f-b15e63bab308','2026-07-21 16:12:58','2026-07-21 16:12:58'),('e1f6a42c-8719-4f09-a203-90cfc570e741','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','ae3d446a-ba2a-43fd-969e-ea066fa84c3f','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-27 23:39:50','Disetujui','member_saving_targets','d920f317-809a-4841-ac15-bb11b80106c6','2026-06-27 23:39:50','2026-06-27 23:39:50'),('e2a8fc46-0561-47fd-a376-7275096d9c45','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','c553f08f-eed7-4fcd-aa47-4762514e54b0','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-27 23:37:59','Disetujui','member_saving_targets','a3e91f8d-d023-4d40-9f78-bf2cce1305bd','2026-06-27 23:37:59','2026-06-27 23:37:59'),('e4f56323-08b6-489e-a622-6103dfff7848','14b1b5ca-a82e-4dd8-a62c-55688eba7927','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-19 10:17:15','Sudah ya','savings_withdrawal','72bc481a-5702-4354-b0fe-1251d4c42e58','2026-07-19 10:17:15','2026-07-19 10:17:15'),('e5168446-36bb-4a5f-91b4-3c5b818b8c43','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','52d1bef5-cb8e-4919-a88f-20b41b4c2edb','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-25 01:28:17','Disetujui','members','96a41a6b-081e-488e-b339-a6de32311267','2026-07-25 01:28:17','2026-07-25 01:28:17'),('e5f027a2-57ec-422a-abb5-f05eacefa9fe','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-12 23:49:03','asdasd','financing_applications','0c2a6dd8-c22e-4fd4-9783-a3c5709ecd94','2026-07-12 23:49:03','2026-07-12 23:49:03'),('e8d571b3-2000-490c-bfe9-72e1b2a2b06a','14b1b5ca-a82e-4dd8-a62c-55688eba7927','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-27 21:28:01','Disetujui','savings_withdrawal','52ac4636-453d-469f-9311-e187e069982a','2026-06-27 21:28:01','2026-06-27 21:28:01'),('ebe59722-1b22-4a73-abe8-ab04aaa987a8','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-13 07:44:18','gass','financing_applications','ed8399fb-41c9-40cb-ab72-f2254964658d','2026-07-13 07:44:18','2026-07-13 07:44:18'),('ecd80c93-c169-4bc6-becb-7d73b9750efe','14b1b5ca-a82e-4dd8-a62c-55688eba7927','c7a56350-8064-49bc-8b9d-d9bb20261f2d','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-16 14:05:46','Disetujui','savings_withdrawal','8c74ca8d-66bc-40e4-84ce-3dac6dd21303','2026-06-16 14:05:46','2026-06-16 14:05:46'),('efc24a2e-d71e-482a-ae09-99eb0aa50a93','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-28 01:57:50','Disetujui','financing_applications','d36aa642-0645-4572-bdd9-3a9c3ae82f8d','2026-06-28 01:57:50','2026-06-28 01:57:50'),('f0795dc2-a1b8-46a7-a1c6-addf534f9031','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-10 05:53:59','oke','financing_applications','84390efa-7232-4522-ad99-59ea03abbc3c','2026-07-10 05:53:59','2026-07-10 05:53:59'),('f0a26aa2-8c24-4952-a706-56153aac167f','14b1b5ca-a82e-4dd8-a62c-55688eba7927','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-22 10:58:41','Disetujui','savings_withdrawal','cb6cb9c5-ae22-420b-b1ac-aa53d6852ab7','2026-07-22 10:58:41','2026-07-22 10:58:41'),('f0cf16b0-f055-40c2-9306-282d0f74081d','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-10 05:58:26','Disetujui','financing_applications','982c5915-a8e9-44da-bc27-15b6a6a226c3','2026-07-10 05:58:26','2026-07-10 05:58:26'),('f101ab69-80a3-46b2-b725-f006f6dd74ef','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 14:00:32','Disetujui','financing_applications','51f924fd-e02d-45f9-95df-fbecead37f89','2026-06-28 14:00:32','2026-06-28 14:00:32'),('f31800ba-69d3-4484-b150-37b12a7da07e','14b1b5ca-a82e-4dd8-a62c-55688eba7927','c7a56350-8064-49bc-8b9d-d9bb20261f2d','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-21 15:24:17','Oke lanjut','savings_withdrawal','b8d0aa4b-c83a-400a-96ec-33b2f9a8657c','2026-07-21 15:24:17','2026-07-21 15:24:17'),('f40f3637-443b-4cbc-a16b-c967cd297f30','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 11:36:23','Disetujui','financing_applications','2cbef909-93b9-4521-a12b-97470159bffb','2026-06-28 11:36:23','2026-06-28 11:36:23'),('f5916d17-ccb9-4bb0-a287-501b3d1ec1a3','0c04764a-8c4c-4f79-afca-25c8530cd065','f09e8ead-d6ba-4064-9e01-5b980d2a1310','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-23 09:39:07','Disetujui','exit_requests','71485dac-543a-4a74-9468-decc51b5d1d8','2026-07-23 09:39:07','2026-07-23 09:39:07'),('f63befd5-53c5-4ee7-9b36-db67b1f59c03','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-22 13:45:41','Disetujui','financing_applications','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','2026-07-22 13:45:41','2026-07-22 13:45:41'),('f7a91944-297b-4e6b-a248-05480adf0fa1','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','921b4cfd-da44-4507-9fa1-781128515015','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 09:58:01','Disetujui','members','ce0c9410-71b8-411d-a13e-174902d3503c','2026-06-28 09:58:01','2026-06-28 09:58:01'),('f7c0aa71-dfda-4e93-ab48-88f6f2d7ddaf','14b1b5ca-a82e-4dd8-a62c-55688eba7927','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-06-27 21:05:35','Disetujui','savings_withdrawal','e3b3589d-7e16-4ba0-a923-c9346115d50a','2026-06-27 21:05:35','2026-06-27 21:05:35'),('f8a1013a-7bc5-4560-8257-fdd0e16b7848','bf046302-6819-41a4-b375-3340fb201bda','5451bd25-0db9-44fa-86d7-e38be5ee5374','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-06-28 01:16:32','test','financing_applications','d36aa642-0645-4572-bdd9-3a9c3ae82f8d','2026-06-28 01:16:32','2026-06-28 01:16:32'),('f9051692-a5e9-46c8-9a92-178af3e3f50e','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-21 16:13:47','Disetujui','financing_applications','cd989fb3-4917-4edb-8c7f-b15e63bab308','2026-07-21 16:13:47','2026-07-21 16:13:47'),('f9f54060-c617-4dec-8fb0-b7673dcd4f16','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','921b4cfd-da44-4507-9fa1-781128515015','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-12 22:54:14','Disetujui','members','5bf49f02-1ed4-4b24-aab0-10d045d86ea8','2026-07-12 22:54:14','2026-07-12 22:54:14'),('fa95bc94-340d-45b3-ade6-a49b5dc22838','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','REJECTED','2026-07-20 10:53:41','Oke di proses','financing_applications','f0b03fda-448e-42ef-813b-b422e6d16c7c','2026-07-20 10:53:41','2026-07-20 10:53:41'),('fa9fd76f-8230-42dd-b4be-c8db735cac53','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-06-28 11:03:25','Disetujui','financing_applications','d1231c9b-c32b-4560-8e7b-a6420dfdf5db','2026-06-28 11:03:25','2026-06-28 11:03:25'),('fab9c549-2773-466b-b570-060161b031e2','f3bdf8a0-f1b2-4113-a56c-4e627a11bed5','aa78034f-529e-4bff-a620-16324a7e758b','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-13 07:43:31','approve','member_saving_targets','39f07132-5fa6-487c-ad9d-53706cc49fc2','2026-07-13 07:43:31','2026-07-13 07:43:31'),('fb7533eb-b157-4145-a80a-d8823e08d889','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-20 10:55:55','Disetujui','financing_applications','dba222dd-1042-4bb0-ac4f-24ad93afbe7e','2026-07-20 10:55:55','2026-07-20 10:55:55'),('fca96ded-14f4-465d-adea-db2ef9093d19','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01','921b4cfd-da44-4507-9fa1-781128515015','84f975b8-ed21-4021-b1c6-4f16933c3373','APPROVED','2026-07-23 21:50:30','Disetujui','members','05cb7dc0-14f2-4726-9118-9d50822301e8','2026-07-23 21:50:30','2026-07-23 21:50:30'),('fd8c2ac9-15d8-4aa7-b7b9-0882e0e7c778','0c04764a-8c4c-4f79-afca-25c8530cd065','741f63b9-2b69-4405-8e4d-a88741d33f3f','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-23 09:42:51','Disetujui','exit_requests','71485dac-543a-4a74-9468-decc51b5d1d8','2026-07-23 09:42:51','2026-07-23 09:42:51'),('fdd3dc3c-6903-4383-a5b9-e9f86ecf8755','bf046302-6819-41a4-b375-3340fb201bda','accd3b83-97ec-4486-b9ee-9b12afad7775','b0024d1f-0605-47fe-891e-156ca72ddefc','APPROVED','2026-07-10 05:28:31','lanjut cek','financing_applications','5ab78b36-2690-417c-b048-c9ca435082e0','2026-07-10 05:28:31','2026-07-10 05:28:31'),('feb3ff1e-86f1-4174-a362-e4ad629f27a3','bf046302-6819-41a4-b375-3340fb201bda','c764fb77-3deb-4080-9164-533cc3a6ebdc','46b677e9-84bf-4bfa-b940-998d004882a1','APPROVED','2026-07-20 10:45:06','Oke lanjutkan ','financing_applications','ebf9cfd6-e69e-4a69-aef1-7467102a7a9e','2026-07-20 10:45:06','2026-07-20 10:45:06');
/*!40000 ALTER TABLE `approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arisan_batches`
--

DROP TABLE IF EXISTS `arisan_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arisan_batches` (
  `arisan_batch_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `arisan_program_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `batch_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `period_start_month` int DEFAULT NULL,
  `period_start_year` int DEFAULT NULL,
  `participants_quota` int DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `monthly_installment` decimal(18,2) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `jumlah_keberangkatan` int DEFAULT NULL,
  PRIMARY KEY (`arisan_batch_id`),
  KEY `arisan_program_id` (`arisan_program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arisan_batches`
--

LOCK TABLES `arisan_batches` WRITE;
/*!40000 ALTER TABLE `arisan_batches` DISABLE KEYS */;
INSERT INTO `arisan_batches` VALUES ('15aaa0f0-d806-423c-b4b4-66697c30ee43','6daf5f40-bb0f-402f-9767-d75c9c9acec5','batch 6',6,2026,3,'OPEN',4500000.00,'2026-06-28 13:29:17','2026-06-28 13:29:17',6),('46e2a167-e5b0-4a19-8ea6-3a74b7719fc1','5eb85d36-1ebe-4520-8c27-e28926cc7d8e','Batch 5',6,2026,3,'OPEN',1400000.00,'2026-06-27 23:10:56','2026-06-28 13:43:55',6),('992e3b26-3e9d-488f-96fe-2a9d1f2675b5','e71f6ac9-5d0a-4ae8-b66f-87d669e1a5cc','9',6,2026,2,'ACTIVE',2100000.00,'2026-06-25 05:26:32','2026-06-28 14:06:30',4),('b9dd0f47-d4c4-475a-b1db-24aec2639adf','a37aa7f2-10c8-4092-a0da-a9299ba6a8db','8',6,2026,4,'OPEN',1400000.00,'2026-06-28 13:16:39','2026-06-28 13:16:39',8),('fc7371bc-7a8c-48eb-b40a-0fd57139f7b4','17afce57-e398-4631-8f2a-28fd15d2be0f','7',6,2026,3,'OPEN',2100000.00,'2026-06-28 13:12:58','2026-06-28 13:12:58',6);
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
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`arisan_bill_id`),
  KEY `idx_arisan_bills_due` (`arisan_participant_id`,`due_datetime`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arisan_bills`
--

LOCK TABLES `arisan_bills` WRITE;
/*!40000 ALTER TABLE `arisan_bills` DISABLE KEYS */;
/*!40000 ALTER TABLE `arisan_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arisan_draws`
--

DROP TABLE IF EXISTS `arisan_draws`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arisan_draws` (
  `arisan_draw_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `arisan_batch_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `winner_member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `draw_month` int NOT NULL,
  `draw_date` datetime DEFAULT NULL,
  `disbursement_amount` decimal(18,2) NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `transfer_proof` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`arisan_draw_id`),
  KEY `arisan_batch_id` (`arisan_batch_id`),
  KEY `winner_member_id` (`winner_member_id`),
  CONSTRAINT `arisan_draws_ibfk_1` FOREIGN KEY (`arisan_batch_id`) REFERENCES `arisan_batches` (`arisan_batch_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `arisan_draws_ibfk_2` FOREIGN KEY (`winner_member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arisan_draws`
--

LOCK TABLES `arisan_draws` WRITE;
/*!40000 ALTER TABLE `arisan_draws` DISABLE KEYS */;
/*!40000 ALTER TABLE `arisan_draws` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arisan_participants`
--

DROP TABLE IF EXISTS `arisan_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arisan_participants` (
  `arisan_participant_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `arisan_batch_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `participant_no` int DEFAULT NULL,
  `saldo_putang` decimal(18,2) DEFAULT NULL,
  `cicilan_target` decimal(18,2) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (`arisan_participant_id`),
  KEY `arisan_batch_id` (`arisan_batch_id`),
  KEY `member_id` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arisan_participants`
--

LOCK TABLES `arisan_participants` WRITE;
/*!40000 ALTER TABLE `arisan_participants` DISABLE KEYS */;
INSERT INTO `arisan_participants` VALUES ('756d8ba4-26ba-4b98-8976-44e11980ff9d','15aaa0f0-d806-423c-b4b4-66697c30ee43','0a7fd51a-6494-4202-89b6-94641b105fbb',1,0.00,4500000.00,'2026-07-22 13:45:41','2026-07-22 13:45:41','APPROVED');
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
  `amount` decimal(18,2) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `arisan_batch_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `payment_month` int NOT NULL,
  `payment_date` datetime DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (`arisan_payment_id`),
  KEY `arisan_payments_arisan_batch_id_foreign_idx` (`arisan_batch_id`),
  KEY `arisan_payments_member_id_foreign_idx` (`member_id`),
  CONSTRAINT `arisan_payments_arisan_batch_id_foreign_idx` FOREIGN KEY (`arisan_batch_id`) REFERENCES `arisan_batches` (`arisan_batch_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `arisan_payments_member_id_foreign_idx` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `arisan_program_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `program_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_amount` decimal(18,2) DEFAULT NULL,
  `term_months` int DEFAULT NULL,
  `monthly_contribution` decimal(18,2) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`arisan_program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arisan_programs`
--

LOCK TABLES `arisan_programs` WRITE;
/*!40000 ALTER TABLE `arisan_programs` DISABLE KEYS */;
INSERT INTO `arisan_programs` VALUES ('17afce57-e398-4631-8f2a-28fd15d2be0f','Arisan Umrah','Arisan',50400000.00,24,2100000.00,'2026-06-28 13:12:58','2026-06-28 13:12:58'),('5eb85d36-1ebe-4520-8c27-e28926cc7d8e','Arisan Umrah','Arisan',50400000.00,36,1400000.00,'2026-06-27 23:10:56','2026-06-28 13:43:55'),('6daf5f40-bb0f-402f-9767-d75c9c9acec5','Arisan umrah ','Arisan',54000000.00,12,4500000.00,'2026-06-28 13:29:17','2026-06-28 13:29:17'),('84c4998d-a70f-4fe7-8a7a-fe2d9bedd1f4','Arisan Umrah ','Arisan',25000000.00,12,2083333.00,'2026-06-27 22:53:27','2026-06-27 22:53:27'),('a37aa7f2-10c8-4092-a0da-a9299ba6a8db','Arisan Umrah','Arisan',50400000.00,36,1400000.00,'2026-06-28 13:16:39','2026-06-28 13:16:39'),('e71f6ac9-5d0a-4ae8-b66f-87d669e1a5cc','Arisan Umrah 2','Arisan',50400000.00,24,2100000.00,'2026-06-20 23:36:17','2026-06-28 14:06:30'),('ead4be0f-6aa4-40e0-9dc2-747c64e9c26f','Arisan Haji/Umroh Skema 2','Arisan Haji/Umroh',50400000.00,24,2100000.00,'2026-06-12 16:22:03','2026-06-28 13:07:21');
/*!40000 ALTER TABLE `arisan_programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `article_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `image_url` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'DRAFT',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bill_items`
--

DROP TABLE IF EXISTS `bill_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bill_items` (
  `bill_item_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `bill_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `bill_type_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `financing_application_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `due_date` datetime NOT NULL,
  `status` enum('UNPAID','PAID','CANCELLED','OVERDUE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UNPAID',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`bill_item_id`),
  KEY `bill_id` (`bill_id`),
  KEY `member_id` (`member_id`),
  KEY `bill_type_id` (`bill_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill_items`
--

LOCK TABLES `bill_items` WRITE;
/*!40000 ALTER TABLE `bill_items` DISABLE KEYS */;
INSERT INTO `bill_items` VALUES ('01091769-dad5-4d0e-a987-726f668ee905','42d6c7c4-71ac-434d-a666-718d8b798216','0a7fd51a-6494-4202-89b6-94641b105fbb','8','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','TRANSACTION_INSTALLMENT','Cicilan Elektronik - Bulan 4',394667.00,'2026-11-30 23:59:59','PAID','2026-07-22 11:38:06','2026-07-22 13:13:38'),('02044e9d-b761-40a1-8d8e-8531450283e0','3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','8','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','TRANSACTION_INSTALLMENT','Setoran Arisan - Bulan 5',4500000.00,'2026-12-31 23:59:59','PAID','2026-07-22 13:45:41','2026-07-22 13:50:43'),('085488e9-d5c0-4016-9356-cd54c711cef1',NULL,'5e714c26-43e6-44a0-8a1e-def3f3290190','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - November 2026',220000.00,'2026-12-01 06:59:59','UNPAID','2026-07-25 01:13:18','2026-07-25 01:13:18'),('0ff2e4c3-f7ff-4e94-a188-107859c2bed1',NULL,'df603033-5528-4dde-885f-407c1015e488','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - March 2027',220000.00,'2027-04-01 06:59:59','UNPAID','2026-07-25 01:28:18','2026-07-25 01:28:18'),('130751f6-bb15-4151-a8db-832ffd7038eb','42d6c7c4-71ac-434d-a666-718d8b798216','0a7fd51a-6494-4202-89b6-94641b105fbb','8','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','TRANSACTION_INSTALLMENT','Cicilan Elektronik - Bulan 12',394667.00,'2027-07-31 23:59:59','PAID','2026-07-22 11:38:07','2026-07-22 13:13:38'),('137fdc8b-59f0-4d0f-97d9-a4d5d45d42d5','3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','8','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','TRANSACTION_INSTALLMENT','Setoran Arisan - Bulan 7',4500000.00,'2027-02-28 23:59:59','PAID','2026-07-22 13:45:42','2026-07-22 13:50:43'),('145c2232-b28d-46c7-9484-72f64b369b73','42d6c7c4-71ac-434d-a666-718d8b798216','0a7fd51a-6494-4202-89b6-94641b105fbb','8','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','TRANSACTION_INSTALLMENT','Cicilan Elektronik - Bulan 8',394667.00,'2027-03-31 23:59:59','PAID','2026-07-22 11:38:06','2026-07-22 13:13:38'),('1796852b-3be3-4505-8e0e-4a74a8c74e07',NULL,'43643359-0f59-4ea4-bb6d-e93505733d4a','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - August 2026',220000.00,'2026-09-01 06:59:59','UNPAID','2026-07-25 01:13:24','2026-07-25 01:13:24'),('1cda0f59-57c1-4705-b39b-c46e191985b0','3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','8','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','TRANSACTION_INSTALLMENT','Setoran Arisan - Bulan 10',4500000.00,'2027-05-31 23:59:59','PAID','2026-07-22 13:45:42','2026-07-22 13:50:43'),('1d5ab469-5294-41b0-b218-90290d4ec60a','42d6c7c4-71ac-434d-a666-718d8b798216','0a7fd51a-6494-4202-89b6-94641b105fbb','8','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','TRANSACTION_INSTALLMENT','Cicilan Elektronik - Bulan 11',394667.00,'2027-06-30 23:59:59','PAID','2026-07-22 11:38:07','2026-07-22 13:13:38'),('220a1cc0-7c78-4315-84af-e10dbee616b5',NULL,'43643359-0f59-4ea4-bb6d-e93505733d4a','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - February 2027',220000.00,'2027-03-01 06:59:59','UNPAID','2026-07-25 01:13:24','2026-07-25 01:13:24'),('227c7630-e0e0-4d70-b077-ca45cb4e6c73','3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - March 2027',220000.00,'2027-03-31 23:59:59','PAID','2026-07-22 06:04:35','2026-07-22 13:50:43'),('268bf22f-9619-4b71-a1cb-35873ea8da5c',NULL,'df603033-5528-4dde-885f-407c1015e488','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - January 2027',220000.00,'2027-02-01 06:59:59','UNPAID','2026-07-25 01:28:18','2026-07-25 01:28:18'),('26d449b9-7a0d-4e0a-b7eb-646a328c106a','3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','8','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','TRANSACTION_INSTALLMENT','Setoran Arisan - Bulan 6',4500000.00,'2027-01-31 23:59:59','PAID','2026-07-22 13:45:41','2026-07-22 13:50:43'),('280f9c4a-746e-4845-9064-47744c28d1b2',NULL,'5e714c26-43e6-44a0-8a1e-def3f3290190','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - December 2026',220000.00,'2027-01-01 06:59:59','UNPAID','2026-07-25 01:13:18','2026-07-25 01:13:18'),('2ab72b2c-ede8-495c-a51f-2c9be9ad73ef','3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','8','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','TRANSACTION_INSTALLMENT','Setoran Arisan - Bulan 8',4500000.00,'2027-03-31 23:59:59','PAID','2026-07-22 13:45:42','2026-07-22 13:50:43'),('2b0080fe-86a9-48ab-8a94-6a53d945d538','d14855d8-c991-41c2-97b6-66c6cbb4f1f1','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - August 2026',220000.00,'2026-08-31 23:59:59','PAID','2026-07-22 06:04:34','2026-07-22 06:07:12'),('2d5be3ab-32f5-4eae-9790-fa5aecc104e2','3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - April 2027',220000.00,'2027-04-30 23:59:59','PAID','2026-07-22 06:04:35','2026-07-22 13:50:43'),('2ed7e941-512d-4417-8c40-31b0c0da22d2',NULL,'5e714c26-43e6-44a0-8a1e-def3f3290190','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - May 2027',220000.00,'2027-06-01 06:59:59','UNPAID','2026-07-25 01:13:18','2026-07-25 01:13:18'),('2f47e7b5-8c03-4c99-8efe-415f201c4661','65056d7c-2caa-4726-821c-dabaa317a043','0a7fd51a-6494-4202-89b6-94641b105fbb','8ad49e3e-1e9b-4667-8c74-92e039e89013',NULL,'SS_SUKARELA','Setoran Simpanan Sukarela',500000.00,'2026-08-21 06:18:13','PAID','2026-07-22 06:18:13','2026-07-22 06:18:30'),('40b3a28e-2131-42b3-8dcd-b88290b80a4c','c4f4ffb3-67a2-4826-9a41-d9dbe498a221','0a7fd51a-6494-4202-89b6-94641b105fbb','8ad49e3e-1e9b-4667-8c74-92e039e89013',NULL,'SS_SUKARELA','Setoran Simpanan Sukarela',500000.00,'2026-08-21 06:20:31','PAID','2026-07-22 06:20:31','2026-07-22 06:20:57'),('43dd73a4-0070-492f-b713-675ff85086dc',NULL,'df603033-5528-4dde-885f-407c1015e488','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - July 2026',220000.00,'2026-08-01 06:59:59','UNPAID','2026-07-25 01:28:17','2026-07-25 01:28:17'),('460547ea-b868-4756-a851-e465df4cd76e',NULL,'43643359-0f59-4ea4-bb6d-e93505733d4a','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - December 2026',220000.00,'2027-01-01 06:59:59','UNPAID','2026-07-25 01:13:24','2026-07-25 01:13:24'),('47f6481c-be27-43d5-89ef-eeec1c1d706b','3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - June 2027',220000.00,'2027-06-30 23:59:59','PAID','2026-07-22 06:04:35','2026-07-22 13:50:43'),('4bf93b9c-0418-4fa3-8b88-10298ccadfc0',NULL,'5e714c26-43e6-44a0-8a1e-def3f3290190','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - September 2026',220000.00,'2026-10-01 06:59:59','UNPAID','2026-07-25 01:13:18','2026-07-25 01:13:18'),('4efec7d4-91b2-4e62-8015-30c761612b5b',NULL,'df603033-5528-4dde-885f-407c1015e488','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - April 2027',220000.00,'2027-05-01 06:59:59','UNPAID','2026-07-25 01:28:18','2026-07-25 01:28:18'),('4f2e4884-0eec-4d4f-9ed1-eda61989c566',NULL,'5e714c26-43e6-44a0-8a1e-def3f3290190','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - October 2026',220000.00,'2026-11-01 06:59:59','UNPAID','2026-07-25 01:13:18','2026-07-25 01:13:18'),('54207252-ccde-4200-bfb2-21f1ba92f369',NULL,'df603033-5528-4dde-885f-407c1015e488','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - December 2026',220000.00,'2027-01-01 06:59:59','UNPAID','2026-07-25 01:28:18','2026-07-25 01:28:18'),('55e4aefe-95ff-45bd-8dec-a009eef8bc37',NULL,'5e714c26-43e6-44a0-8a1e-def3f3290190','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - June 2027',220000.00,'2027-07-01 06:59:59','UNPAID','2026-07-25 01:13:18','2026-07-25 01:13:18'),('58e08f86-e325-42a6-ba7f-80242ee3c44d',NULL,'43643359-0f59-4ea4-bb6d-e93505733d4a','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - May 2027',220000.00,'2027-06-01 06:59:59','UNPAID','2026-07-25 01:13:24','2026-07-25 01:13:24'),('590998cf-c03f-4c75-89b8-bce156de7b5b','2bf35276-cd60-44c5-aa98-20799b8d8c88','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - December 2026',220000.00,'2026-12-31 23:59:59','PAID','2026-07-22 06:04:34','2026-07-22 06:09:44'),('5bbb626d-e61d-4ce3-a6ba-716b5cdd02f0',NULL,'df603033-5528-4dde-885f-407c1015e488','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - September 2026',220000.00,'2026-10-01 06:59:59','UNPAID','2026-07-25 01:28:17','2026-07-25 01:28:17'),('5c9176a7-d8cd-4acc-a86f-2b593c068e92','3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','8','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','TRANSACTION_INSTALLMENT','Setoran Arisan - Bulan 4',4500000.00,'2026-11-30 23:59:59','PAID','2026-07-22 13:45:41','2026-07-22 13:50:43'),('5d2c8c9f-0def-4d71-9cc4-e7cf2e03fa4c','311a306c-f56b-488a-9aa3-82c521bbfea8','43643359-0f59-4ea4-bb6d-e93505733d4a','38420d92-3000-47b5-a737-7850eaba0ed7',NULL,'SW_POKOK','Simpanan Pokok',500000.00,'2026-08-01 06:59:59','PAID','2026-07-25 01:13:24','2026-07-25 01:14:01'),('640993a0-13a0-4bec-80c9-1fad5d6367cd',NULL,'5e714c26-43e6-44a0-8a1e-def3f3290190','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - April 2027',220000.00,'2027-05-01 06:59:59','UNPAID','2026-07-25 01:13:18','2026-07-25 01:13:18'),('64faf9b3-5c0a-4abb-8ea2-f0ca93c95180','42d6c7c4-71ac-434d-a666-718d8b798216','0a7fd51a-6494-4202-89b6-94641b105fbb','8','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','TRANSACTION_INSTALLMENT','Cicilan Elektronik - Bulan 1',394667.00,'2026-08-31 23:59:59','PAID','2026-07-22 11:38:06','2026-07-22 13:13:38'),('66be3581-cf96-4460-93aa-71356dabdfda','3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','8','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','TRANSACTION_INSTALLMENT','Setoran Arisan - Bulan 12',4500000.00,'2027-07-31 23:59:59','PAID','2026-07-22 13:45:42','2026-07-22 13:50:43'),('69d7a7e7-a1d5-4887-94f8-31748999fc2b',NULL,'df603033-5528-4dde-885f-407c1015e488','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - November 2026',220000.00,'2026-12-01 06:59:59','UNPAID','2026-07-25 01:28:17','2026-07-25 01:28:17'),('6ab0ea02-b0ed-4757-af8a-21d22356931e','42d6c7c4-71ac-434d-a666-718d8b798216','0a7fd51a-6494-4202-89b6-94641b105fbb','8','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','TRANSACTION_INSTALLMENT','Cicilan Elektronik - Bulan 7',394667.00,'2027-02-28 23:59:59','PAID','2026-07-22 11:38:06','2026-07-22 13:13:38'),('6d88b90d-d120-4261-a4eb-7191fc23b056','42d6c7c4-71ac-434d-a666-718d8b798216','0a7fd51a-6494-4202-89b6-94641b105fbb','8','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','TRANSACTION_INSTALLMENT','Cicilan Elektronik - Bulan 3',394667.00,'2026-10-31 23:59:59','PAID','2026-07-22 11:38:06','2026-07-22 13:13:38'),('6e6c135c-b920-4c9a-af9c-deadc9229338','fffc762a-0113-431b-9d64-fadfc4b28155','0a7fd51a-6494-4202-89b6-94641b105fbb','8','71ca8581-40ca-4cae-a0c0-bcb08c8fc502','TRANSACTION_INSTALLMENT','Cicilan Darurat - Bulan 2',1000000.00,'2026-09-30 23:59:59','PAID','2026-07-22 13:25:44','2026-07-22 13:29:45'),('7083b881-c882-493b-b3a4-73d2fd3ea346',NULL,'43643359-0f59-4ea4-bb6d-e93505733d4a','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - September 2026',220000.00,'2026-10-01 06:59:59','UNPAID','2026-07-25 01:13:24','2026-07-25 01:13:24'),('70c816c5-bf21-4da9-9b1e-172860434384','34d6482a-d551-4861-80e0-6f63856fc661','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - February 2027',220000.00,'2027-02-28 23:59:59','PAID','2026-07-22 06:04:34','2026-07-22 06:14:17'),('7301ed27-1fd8-4827-b21a-aae6cc030353','3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','8','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','TRANSACTION_INSTALLMENT','Setoran Arisan - Bulan 3',4500000.00,'2026-10-31 23:59:59','PAID','2026-07-22 13:45:41','2026-07-22 13:50:43'),('755aa1c9-01f3-4c8e-be0f-23bd5bf6c8fd','2d412bed-d575-4dce-b480-02d30c1545ce','0a7fd51a-6494-4202-89b6-94641b105fbb','8ad49e3e-1e9b-4667-8c74-92e039e89013',NULL,'SS_SUKARELA','Setoran Simpanan Sukarela',50000.00,'2026-08-21 06:16:23','PAID','2026-07-22 06:16:23','2026-07-22 06:16:36'),('7699bda6-7333-4244-b461-f014ec08012a','3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','8','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','TRANSACTION_INSTALLMENT','Setoran Arisan - Bulan 1',4500000.00,'2026-08-31 23:59:59','PAID','2026-07-22 13:45:41','2026-07-22 13:50:43'),('775b8ad1-be41-44b8-b7e5-95295d3bf10f',NULL,'43643359-0f59-4ea4-bb6d-e93505733d4a','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - June 2027',220000.00,'2027-07-01 06:59:59','UNPAID','2026-07-25 01:13:25','2026-07-25 01:13:25'),('7769ffaa-5063-4db2-93a5-6d9b88d1e927','fffc762a-0113-431b-9d64-fadfc4b28155','0a7fd51a-6494-4202-89b6-94641b105fbb','8','71ca8581-40ca-4cae-a0c0-bcb08c8fc502','TRANSACTION_INSTALLMENT','Cicilan Darurat - Bulan 1',1000000.00,'2026-08-31 23:59:59','PAID','2026-07-22 13:25:44','2026-07-22 13:29:45'),('7b1fc10f-a50b-4a37-afd1-ad655f04bb8f',NULL,'43643359-0f59-4ea4-bb6d-e93505733d4a','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - November 2026',220000.00,'2026-12-01 06:59:59','UNPAID','2026-07-25 01:13:24','2026-07-25 01:13:24'),('7b8c0745-14ee-4afb-acc8-1513d6c9db8b','3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','8','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','TRANSACTION_INSTALLMENT','Setoran Arisan - Bulan 9',4500000.00,'2027-04-30 23:59:59','PAID','2026-07-22 13:45:42','2026-07-22 13:50:43'),('810e3f8d-00ff-4271-8fed-6281ab0401a1',NULL,'43643359-0f59-4ea4-bb6d-e93505733d4a','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - March 2027',220000.00,'2027-04-01 06:59:59','UNPAID','2026-07-25 01:13:24','2026-07-25 01:13:24'),('83d8a38b-6a08-4e0a-9e16-ab5e5c608666','3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','8','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','TRANSACTION_INSTALLMENT','Setoran Arisan - Bulan 11',4500000.00,'2027-06-30 23:59:59','PAID','2026-07-22 13:45:42','2026-07-22 13:50:43'),('8bad42e0-04c9-4705-b674-125f72161f7a',NULL,'df603033-5528-4dde-885f-407c1015e488','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - October 2026',220000.00,'2026-11-01 06:59:59','UNPAID','2026-07-25 01:28:17','2026-07-25 01:28:17'),('9103dfc3-9c42-4ce0-be67-d61d8f16bdda','42d6c7c4-71ac-434d-a666-718d8b798216','0a7fd51a-6494-4202-89b6-94641b105fbb','8','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','TRANSACTION_INSTALLMENT','Cicilan Elektronik - Bulan 6',394667.00,'2027-01-31 23:59:59','PAID','2026-07-22 11:38:06','2026-07-22 13:13:38'),('91348d7a-a699-4ecf-b4fb-ca5342109b5e',NULL,'5e714c26-43e6-44a0-8a1e-def3f3290190','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - February 2027',220000.00,'2027-03-01 06:59:59','UNPAID','2026-07-25 01:13:18','2026-07-25 01:13:18'),('94393268-ff39-443d-8214-3a26e289aba0',NULL,'df603033-5528-4dde-885f-407c1015e488','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - August 2026',220000.00,'2026-09-01 06:59:59','UNPAID','2026-07-25 01:28:17','2026-07-25 01:28:17'),('96424da5-9600-4a50-ac1b-fdfda2b17075','42d6c7c4-71ac-434d-a666-718d8b798216','0a7fd51a-6494-4202-89b6-94641b105fbb','8','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','TRANSACTION_INSTALLMENT','Cicilan Elektronik - Bulan 9',394667.00,'2027-04-30 23:59:59','PAID','2026-07-22 11:38:07','2026-07-22 13:13:38'),('9808af41-6d11-438e-9213-45d4248b5b32',NULL,'5e714c26-43e6-44a0-8a1e-def3f3290190','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - July 2026',220000.00,'2026-08-01 06:59:59','UNPAID','2026-07-25 01:13:18','2026-07-25 01:13:18'),('9bca2f64-34d9-4646-8369-c37605c04740',NULL,'df603033-5528-4dde-885f-407c1015e488','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - June 2027',220000.00,'2027-07-01 06:59:59','UNPAID','2026-07-25 01:28:18','2026-07-25 01:28:18'),('9bee4a44-0b26-41a2-807c-18ec7b9e735a','fffc762a-0113-431b-9d64-fadfc4b28155','0a7fd51a-6494-4202-89b6-94641b105fbb','8','71ca8581-40ca-4cae-a0c0-bcb08c8fc502','TRANSACTION_INSTALLMENT','Cicilan Darurat - Bulan 3',1000000.00,'2026-10-31 23:59:59','PAID','2026-07-22 13:25:44','2026-07-22 13:29:45'),('9cf84141-01bc-4df9-9d1f-02ec5caec670',NULL,'43643359-0f59-4ea4-bb6d-e93505733d4a','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - January 2027',220000.00,'2027-02-01 06:59:59','UNPAID','2026-07-25 01:13:24','2026-07-25 01:13:24'),('9d349e19-e632-4764-b0ba-64fb8094c2e9','664ef54f-8f94-44a8-8b1e-64adff736a98','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - September 2026',220000.00,'2026-09-30 23:59:59','PAID','2026-07-22 06:04:34','2026-07-22 06:07:40'),('9e9ffb4b-db6b-46da-8bd3-ab44cb74493c','3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','8','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','TRANSACTION_INSTALLMENT','Setoran Arisan - Bulan 2',4500000.00,'2026-09-30 23:59:59','PAID','2026-07-22 13:45:41','2026-07-22 13:50:43'),('aaacd43b-492a-4414-ac85-6c5ebba0b47b','748217ca-c0df-4f65-8d91-543f2f3bd3a6','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - January 2027',220000.00,'2027-01-31 23:59:59','PAID','2026-07-22 06:04:34','2026-07-22 06:12:44'),('acf98926-b29a-46f3-a8cf-eb4c24767714',NULL,'df603033-5528-4dde-885f-407c1015e488','38420d92-3000-47b5-a737-7850eaba0ed7',NULL,'SW_POKOK','Simpanan Pokok',500000.00,'2026-08-01 06:59:59','UNPAID','2026-07-25 01:28:17','2026-07-25 01:28:17'),('aed4245d-2855-4156-9faa-5f7b25620cf0',NULL,'df603033-5528-4dde-885f-407c1015e488','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - May 2027',220000.00,'2027-06-01 06:59:59','UNPAID','2026-07-25 01:28:18','2026-07-25 01:28:18'),('b2e3920c-206d-4290-a871-68f91d9e71eb','432431cd-14d3-4041-b655-6536902620fc','0a7fd51a-6494-4202-89b6-94641b105fbb','7','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','TRANSACTION_DOWN_PAYMENT','DP / Uang Muka Elektronik',1500000.00,'2026-07-22 11:38:06','PAID','2026-07-22 11:38:06','2026-07-22 11:39:29'),('bb142113-ae30-43f7-b0bc-2dd5e79d98d1',NULL,'5e714c26-43e6-44a0-8a1e-def3f3290190','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - March 2027',220000.00,'2027-04-01 06:59:59','UNPAID','2026-07-25 01:13:18','2026-07-25 01:13:18'),('c2de33a8-1c76-4b7a-a837-f8d8ade40289',NULL,'43643359-0f59-4ea4-bb6d-e93505733d4a','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - October 2026',220000.00,'2026-11-01 06:59:59','UNPAID','2026-07-25 01:13:24','2026-07-25 01:13:24'),('ce1ee9fa-c017-4f65-aae9-623b672c0716','d3f37ba3-6af4-427f-be17-90aabf850f94','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - July 2026',220000.00,'2026-07-31 23:59:59','PAID','2026-07-22 06:04:34','2026-07-22 06:05:11'),('d07bd93a-3984-4162-b5f3-7ac07c1aa71a','eef9d19f-ef8c-4426-956c-2bf9639a5245','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - October 2026',220000.00,'2026-10-31 23:59:59','PAID','2026-07-22 06:04:34','2026-07-22 06:08:32'),('d426ae6d-3b11-4ac4-820d-84d6f2df94de','3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - May 2027',220000.00,'2027-05-31 23:59:59','PAID','2026-07-22 06:04:35','2026-07-22 13:50:43'),('dec6f678-f5d1-4ef5-89ba-f75c7ad79931','d3f37ba3-6af4-427f-be17-90aabf850f94','0a7fd51a-6494-4202-89b6-94641b105fbb','38420d92-3000-47b5-a737-7850eaba0ed7',NULL,'SW_POKOK','Simpanan Pokok',500000.00,'2026-07-31 23:59:59','PAID','2026-07-22 06:04:34','2026-07-22 06:05:11'),('e3295454-78b7-40ed-a77a-36b4b33228d6',NULL,'43643359-0f59-4ea4-bb6d-e93505733d4a','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - April 2027',220000.00,'2027-05-01 06:59:59','UNPAID','2026-07-25 01:13:24','2026-07-25 01:13:24'),('e38a82af-3fde-45d7-a60a-12265aa1dfaf',NULL,'5e714c26-43e6-44a0-8a1e-def3f3290190','38420d92-3000-47b5-a737-7850eaba0ed7',NULL,'SW_POKOK','Simpanan Pokok',500000.00,'2026-08-01 06:59:59','UNPAID','2026-07-25 01:13:18','2026-07-25 01:13:18'),('e5f8bc86-dcca-4f64-93fd-30796d4267b8','bf8e0f0f-67ec-4e13-bf89-8d905349937e','43643359-0f59-4ea4-bb6d-e93505733d4a','8ad49e3e-1e9b-4667-8c74-92e039e89013',NULL,'SS_SUKARELA','Setoran Simpanan Sukarela',500000.00,'2026-08-24 01:14:34','PAID','2026-07-25 01:14:34','2026-07-25 01:14:50'),('e9c256ed-e67e-47e2-83cf-774d5a41b058',NULL,'5e714c26-43e6-44a0-8a1e-def3f3290190','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - August 2026',220000.00,'2026-09-01 06:59:59','UNPAID','2026-07-25 01:13:18','2026-07-25 01:13:18'),('ea11cde0-2ac6-46f7-9a9e-4d288b0ecf96','42d6c7c4-71ac-434d-a666-718d8b798216','0a7fd51a-6494-4202-89b6-94641b105fbb','8','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','TRANSACTION_INSTALLMENT','Cicilan Elektronik - Bulan 2',394667.00,'2026-09-30 23:59:59','PAID','2026-07-22 11:38:06','2026-07-22 13:13:38'),('eb17075c-fa88-425e-bbf3-1ea232bf4b16','42d6c7c4-71ac-434d-a666-718d8b798216','0a7fd51a-6494-4202-89b6-94641b105fbb','8','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','TRANSACTION_INSTALLMENT','Cicilan Elektronik - Bulan 10',394667.00,'2027-05-31 23:59:59','PAID','2026-07-22 11:38:07','2026-07-22 13:13:38'),('f2f78bed-3596-4ff8-b158-9b91382a2894','42d6c7c4-71ac-434d-a666-718d8b798216','0a7fd51a-6494-4202-89b6-94641b105fbb','8','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','TRANSACTION_INSTALLMENT','Cicilan Elektronik - Bulan 5',394667.00,'2026-12-31 23:59:59','PAID','2026-07-22 11:38:06','2026-07-22 13:13:38'),('f351513b-70b2-42c0-86ca-e9f2b1cbf6f2','985ba766-0b10-4051-9cb8-4f06b723792c','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - November 2026',220000.00,'2026-11-30 23:59:59','PAID','2026-07-22 06:04:34','2026-07-22 06:09:23'),('f6230c66-17d1-44af-8f4e-2dd61e05af25',NULL,'df603033-5528-4dde-885f-407c1015e488','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - February 2027',220000.00,'2027-03-01 06:59:59','UNPAID','2026-07-25 01:28:18','2026-07-25 01:28:18'),('f62ee940-b670-4f7e-8fd9-1f1bbace294b',NULL,'5e714c26-43e6-44a0-8a1e-def3f3290190','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - January 2027',220000.00,'2027-02-01 06:59:59','UNPAID','2026-07-25 01:13:18','2026-07-25 01:13:18'),('f843d69c-b274-4d7e-9d27-92d03a9b5f43','311a306c-f56b-488a-9aa3-82c521bbfea8','43643359-0f59-4ea4-bb6d-e93505733d4a','5b57dc36-678c-40ed-b7c4-c8872ddd71ed',NULL,'SW_WAJIB','Simpanan Wajib - July 2026',220000.00,'2026-08-01 06:59:59','PAID','2026-07-25 01:13:24','2026-07-25 01:14:01');
/*!40000 ALTER TABLE `bill_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bill_type`
--

DROP TABLE IF EXISTS `bill_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bill_type` (
  `bill_type_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `type_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tx_type` enum('SETORAN','PENARIKAN','LAINNYA') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SETORAN',
  `category_map` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `default_amount` decimal(18,2) NOT NULL,
  `period_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`bill_type_id`),
  UNIQUE KEY `type_code` (`type_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill_type`
--

LOCK TABLES `bill_type` WRITE;
/*!40000 ALTER TABLE `bill_type` DISABLE KEYS */;
INSERT INTO `bill_type` VALUES ('21eb5646-ed30-46f8-bc4a-2589fe5569f9','TABUNGAN_DEPOSIT','SETORAN','SAVINGS_TARGET','Setoran Tabungan',0.00,'MONTHLY','2026-06-16 11:16:25','2026-06-16 11:16:25'),('38420d92-3000-47b5-a737-7850eaba0ed7','SW_POKOK','SETORAN','SIMPANAN_POKOK','Simpanan Pokok',500000.00,'ONETIME','2026-06-16 11:16:25','2026-07-12 22:52:43'),('5b57dc36-678c-40ed-b7c4-c8872ddd71ed','SW_WAJIB','SETORAN','SIMPANAN_WAJIB','Simpanan Wajib',220000.00,'MONTHLY','2026-06-16 11:16:25','2026-07-12 22:50:59'),('7','TRANSACTION_DOWN_PAYMENT','','FINANCING','Down Payment',0.00,'ONETIME','2026-06-16 11:16:25','2026-06-16 11:16:25'),('8','TRANSACTION_INSTALLMENT','','FINANCING','Cicilan Pembiayaan',0.00,'MONTHLY','2026-06-16 11:16:25','2026-06-16 11:16:25'),('8ad49e3e-1e9b-4667-8c74-92e039e89013','SS_SUKARELA','SETORAN','SIMPANAN_SUKARELA','Simpanan Sukarela',0.00,'FLEXIBLE','2026-06-16 11:16:25','2026-06-16 11:16:25'),('99e73506-5d52-4531-85b6-1db6a7761870','SUKUK_INVESTMENT','SETORAN','INVESTMENT','Pembelian Sukuk',0.00,'ONE_TIME','2026-06-27 13:17:47','2026-06-27 13:17:47');
/*!40000 ALTER TABLE `bill_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bills`
--

DROP TABLE IF EXISTS `bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bills` (
  `bill_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `bill_type_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `due_date` datetime NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`bill_id`),
  KEY `member_id` (`member_id`),
  KEY `bill_type_id` (`bill_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bills`
--

LOCK TABLES `bills` WRITE;
/*!40000 ALTER TABLE `bills` DISABLE KEYS */;
INSERT INTO `bills` VALUES ('0f05d180-9fd9-4852-904a-b9d84a2c9a30','0a7fd51a-6494-4202-89b6-94641b105fbb','8ad49e3e-1e9b-4667-8c74-92e039e89013','MEMBER_REGISTRATION #002207260601833',500000.00,'2026-07-23 06:20:36','pending','2026-07-22 06:20:36','2026-07-22 06:20:36'),('2bf35276-cd60-44c5-aa98-20799b8d8c88','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed','MEMBER_REGISTRATION #002207260601833',220000.00,'2026-07-23 06:09:34','paid','2026-07-22 06:09:34','2026-07-22 06:09:44'),('2d412bed-d575-4dce-b480-02d30c1545ce','0a7fd51a-6494-4202-89b6-94641b105fbb','8ad49e3e-1e9b-4667-8c74-92e039e89013','MEMBER_REGISTRATION #002207260601833',50000.00,'2026-07-23 06:16:27','paid','2026-07-22 06:16:27','2026-07-22 06:16:36'),('34d6482a-d551-4861-80e0-6f63856fc661','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed','MEMBER_REGISTRATION #002207260601833',220000.00,'2026-07-23 06:14:07','paid','2026-07-22 06:14:07','2026-07-22 06:14:17'),('3fcced9e-390b-42ad-87ff-3139c39ecee0','0a7fd51a-6494-4202-89b6-94641b105fbb','8','MEMBER_REGISTRATION #002207260601833',54880000.00,'2026-07-23 13:50:20','paid','2026-07-22 13:50:20','2026-07-22 13:50:43'),('42d6c7c4-71ac-434d-a666-718d8b798216','0a7fd51a-6494-4202-89b6-94641b105fbb','8','FINANCING_PAYMENT #002207260601833',4736004.00,'2026-07-23 13:13:13','paid','2026-07-22 13:13:13','2026-07-22 13:13:38'),('432431cd-14d3-4041-b655-6536902620fc','0a7fd51a-6494-4202-89b6-94641b105fbb','7','FINANCING_PAYMENT #002207260601833',1500000.00,'2026-07-23 11:38:51','paid','2026-07-22 11:38:51','2026-07-22 11:39:29'),('65056d7c-2caa-4726-821c-dabaa317a043','0a7fd51a-6494-4202-89b6-94641b105fbb','8ad49e3e-1e9b-4667-8c74-92e039e89013','MEMBER_REGISTRATION #002207260601833',500000.00,'2026-07-23 06:18:18','paid','2026-07-22 06:18:18','2026-07-22 06:18:30'),('664ef54f-8f94-44a8-8b1e-64adff736a98','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed','MEMBER_REGISTRATION #002207260601833',220000.00,'2026-07-23 06:07:30','paid','2026-07-22 06:07:30','2026-07-22 06:07:40'),('748217ca-c0df-4f65-8d91-543f2f3bd3a6','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed','MEMBER_REGISTRATION #002207260601833',220000.00,'2026-07-23 06:12:33','paid','2026-07-22 06:12:33','2026-07-22 06:12:44'),('985ba766-0b10-4051-9cb8-4f06b723792c','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed','MEMBER_REGISTRATION #002207260601833',220000.00,'2026-07-23 06:09:13','paid','2026-07-22 06:09:13','2026-07-22 06:09:23'),('c4f4ffb3-67a2-4826-9a41-d9dbe498a221','0a7fd51a-6494-4202-89b6-94641b105fbb','8ad49e3e-1e9b-4667-8c74-92e039e89013','MEMBER_REGISTRATION #002207260601833',500000.00,'2026-07-23 06:20:48','paid','2026-07-22 06:20:48','2026-07-22 06:20:57'),('cd06f4e3-0609-4b46-a2ea-9d621a1d3679','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed','MEMBER_REGISTRATION #002207260601833',220000.00,'2026-07-23 06:12:25','pending','2026-07-22 06:12:25','2026-07-22 06:12:25'),('d14855d8-c991-41c2-97b6-66c6cbb4f1f1','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed','MEMBER_REGISTRATION #002207260601833',220000.00,'2026-07-23 06:07:04','paid','2026-07-22 06:07:04','2026-07-22 06:07:12'),('d3f37ba3-6af4-427f-be17-90aabf850f94','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed','MEMBER_REGISTRATION #002207260601833',720000.00,'2026-07-23 06:04:57','paid','2026-07-22 06:04:57','2026-07-22 06:05:09'),('eef9d19f-ef8c-4426-956c-2bf9639a5245','0a7fd51a-6494-4202-89b6-94641b105fbb','5b57dc36-678c-40ed-b7c4-c8872ddd71ed','MEMBER_REGISTRATION #002207260601833',220000.00,'2026-07-23 06:08:19','paid','2026-07-22 06:08:19','2026-07-22 06:08:32'),('fffc762a-0113-431b-9d64-fadfc4b28155','0a7fd51a-6494-4202-89b6-94641b105fbb','8','FINANCING_PAYMENT #002207260601833',3000000.00,'2026-07-23 13:29:20','paid','2026-07-22 13:29:20','2026-07-22 13:29:45');
/*!40000 ALTER TABLE `bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_profiles`
--

DROP TABLE IF EXISTS `business_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_profiles` (
  `profile_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `business_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_address` text COLLATE utf8mb4_unicode_ci,
  `monthly_revenue` decimal(18,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`profile_id`),
  UNIQUE KEY `member_id` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `asset_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ownership_proof_url` text COLLATE utf8mb4_unicode_ci,
  `collateral_proof_url` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`collateral_id`),
  KEY `fk_collateral_business` (`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collateral_assets`
--

LOCK TABLES `collateral_assets` WRITE;
/*!40000 ALTER TABLE `collateral_assets` DISABLE KEYS */;
/*!40000 ALTER TABLE `collateral_assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_forms`
--

DROP TABLE IF EXISTS `contact_forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_forms` (
  `form_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `submitted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`form_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_forms`
--

LOCK TABLES `contact_forms` WRITE;
/*!40000 ALTER TABLE `contact_forms` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_forms` ENABLE KEYS */;
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
  `month_label` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doc_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pic_member_id` bigint DEFAULT NULL,
  `purpose` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `debit_amount` decimal(18,2) DEFAULT NULL,
  `credit_amount` decimal(18,2) DEFAULT NULL,
  `balance` decimal(18,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`csr_tx_id`),
  KEY `fk_csr_pic_member` (`pic_member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `track_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`track_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curriculum_tracks`
--

LOCK TABLES `curriculum_tracks` WRITE;
/*!40000 ALTER TABLE `curriculum_tracks` DISABLE KEYS */;
/*!40000 ALTER TABLE `curriculum_tracks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curriculums`
--

DROP TABLE IF EXISTS `curriculums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curriculums` (
  `curriculum_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `curriculum_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `curriculum_type` enum('WAJIB','REGULER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`curriculum_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curriculums`
--

LOCK TABLES `curriculums` WRITE;
/*!40000 ALTER TABLE `curriculums` DISABLE KEYS */;
INSERT INTO `curriculums` VALUES ('06916d21-6325-4f02-82ac-150d99a80ca1','Pengenalan Koperasi','WAJIB','Dasar-dasar pemahaman tentang koperasi',1,'2026-06-13 15:08:13','2026-06-13 15:08:13'),('54f3323f-9217-4933-8ffd-4fa40482a3f2','Etika Bisnis Syariah','WAJIB','Penerapan prinsip syariah dalam bisnis',1,'2026-06-13 15:08:13','2026-06-13 15:08:13'),('8fec7a67-d57f-47f4-9ad1-cb715640c10e','Leadership Koperasi','REGULER','Pengembangan kepemimpinan untuk pengurus',1,'2026-06-13 15:08:13','2026-06-13 15:08:13'),('987eb4a5-01a1-46a0-b5c0-5cae7d4163c2','Digital Marketing Koperasi','REGULER','Strategi pemasaran digital untuk koperasi',1,'2026-06-13 15:08:13','2026-06-13 15:08:13'),('fba39173-a259-4e24-af40-13f6277d5311','Manajemen Keuangan Koperasi','WAJIB','Prinsip dan praktik manajemen keuangan',1,'2026-06-13 15:08:13','2026-06-13 15:08:13');
/*!40000 ALTER TABLE `curriculums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entity_step_approvals`
--

DROP TABLE IF EXISTS `entity_step_approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity_step_approvals` (
  `entity_step_approval_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `entity_ref` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `approval_step_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `is_approved` tinyint DEFAULT '0',
  `approved_at` datetime DEFAULT NULL,
  PRIMARY KEY (`entity_step_approval_id`),
  KEY `approval_step_id` (`approval_step_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_step_approvals`
--

LOCK TABLES `entity_step_approvals` WRITE;
/*!40000 ALTER TABLE `entity_step_approvals` DISABLE KEYS */;
INSERT INTO `entity_step_approvals` VALUES ('025ec625-dc9a-4b81-842c-8164e13b77c2','members','28d1fa84-65ab-48d1-9543-0982afdae987','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-06-28 09:54:46'),('0341fc40-e50a-4c40-a1d9-108a43449d6e','savings_withdrawal','5f6c157a-9569-4205-829f-84103313f7c6','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-06-28 10:30:50'),('04019465-2cb5-4a7e-9896-c499c865b54d','exit_requests','71485dac-543a-4a74-9468-decc51b5d1d8','741f63b9-2b69-4405-8e4d-a88741d33f3f',1,'2026-07-23 09:42:51'),('04a50621-113f-4511-958c-a779b2547d12','members','b08024e6-a58b-4ef0-8807-b2fe11a49d55','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-07-04 15:11:57'),('0609b80b-8809-4015-bc5e-43a064c3de08','financing_applications','71ca8581-40ca-4cae-a0c0-bcb08c8fc502','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-22 13:25:44'),('0655ac6b-0a7c-4274-8f65-eb8097e7592b','member_saving_targets','39f07132-5fa6-487c-ad9d-53706cc49fc2','ae3d446a-ba2a-43fd-969e-ea066fa84c3f',1,'2026-07-13 07:53:15'),('074178c3-a913-4510-9fa4-6a4bf24b3ced','savings_withdrawal','70d70f10-6424-408c-8fd6-c61994548439','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-07-04 18:22:15'),('09acb93c-aeaf-4934-b3c7-2981413d7f7a','financing_applications','307448b3-6d21-4272-a22d-d6bdf549696c','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-06-12 13:55:46'),('0af4f440-b2ed-4d46-b46e-7b1c0fa81218','members','28d1fa84-65ab-48d1-9543-0982afdae987','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-06-28 09:52:55'),('0c86d12d-edf3-45e5-a1ec-f6e20d8c4b88','members','845aa028-2452-4368-ae37-f22f61d1fe55','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-06-20 00:25:51'),('0ca859f0-ad83-4cf2-9f2b-806f98a87cfb','financing_applications','ae792540-ce34-4ebf-bec2-0bceac2e9120','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-21 15:57:25'),('10783f8a-b0ff-4338-85d9-261d89740640','financing_applications','3899a56c-61b1-452b-8e4f-f6844679efa6','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-12 16:26:53'),('11f32463-318b-41c6-96d7-d7b6bcbf6a63','tabungan_withdrawals','52b039b4-71b8-4ea5-b238-9143625efe92','bd75b0f1-63b9-420d-9d8c-16698a8763b4',1,'2026-07-11 13:09:40'),('12cb1c61-db19-4beb-ae2d-a94c2290c4c3','member_saving_targets','a3e91f8d-d023-4d40-9f78-bf2cce1305bd','c553f08f-eed7-4fcd-aa47-4762514e54b0',1,'2026-06-27 23:37:59'),('13267365-9910-4d4c-a0cc-51eec29c38ed','financing_applications','ae792540-ce34-4ebf-bec2-0bceac2e9120','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-21 15:57:00'),('13d47b36-196d-4e74-9d69-baebcdec595b','financing_applications','cd989fb3-4917-4edb-8c7f-b15e63bab308','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-21 16:13:47'),('14b76c01-b856-47db-a136-1778029598f4','members','c1bae905-c53d-4b46-b0ff-b1350fdb5d4b','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-06-15 21:43:01'),('14c71539-a88c-401c-975d-39d6cace8718','financing_applications','ed8399fb-41c9-40cb-ab72-f2254964658d','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-13 07:44:18'),('1545f7b4-640a-4812-91e9-abdcbd33f0a8','savings_withdrawal','5932c072-a923-48dc-aa57-25c963e84dee','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-06-15 21:51:14'),('1552ec18-b51b-4ff9-8bbd-2727cd8b2bb4','financing_applications','b6f7e4af-ed0f-4bf3-b842-2c32125c22f5','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-06-15 15:13:50'),('1575761d-f529-41a1-9cbd-890573e284e0','savings_withdrawal','52ac4636-453d-469f-9311-e187e069982a','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-06-27 21:28:01'),('1914db46-57b4-43eb-b7e3-54120be122d5','member_saving_targets','8eac3e7c-6dd3-47e1-84ee-2228df92ca92','aa78034f-529e-4bff-a620-16324a7e758b',1,'2026-06-27 23:37:06'),('19e07003-5fca-48d6-be0f-50f90722dcc8','financing_applications','d36aa642-0645-4572-bdd9-3a9c3ae82f8d','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-28 01:26:05'),('1a1d0b47-5428-4bf9-ac89-71a29aa431cc','financing_applications','ebf9cfd6-e69e-4a69-aef1-7467102a7a9e','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-20 10:45:06'),('1f076aab-5af8-47d3-9617-b77f2b95aec4','savings_withdrawal','73b777cd-015f-4de8-a643-3edd0f4225c5','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-07-10 05:25:08'),('1f20da0c-61f6-4adb-afc8-36d2962113a3','member_saving_targets','7c69914d-42ce-4e53-91b1-09f7556ec73a','ae3d446a-ba2a-43fd-969e-ea066fa84c3f',1,'2026-06-27 18:07:01'),('1fdb597b-5eab-4cb2-8425-79c7374bef6e','financing_applications','0f052691-fc1b-4865-bc0f-9a64555bac2e','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-28 11:25:18'),('20056bc1-51b0-41a2-a0e6-91049db0316e','savings_withdrawal','04793577-3110-4676-ac7b-308bff0bb964','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-06-12 06:00:41'),('20ea48f9-b7f8-41d1-8b2b-5698539e6b75','members','9cdaeba3-619d-4ce4-83db-6e32c236aabb','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-07-22 06:04:33'),('22cacec3-0a9e-4e20-aad6-adbb12775e49','financing_applications','0a2eaf33-5931-40a1-8032-4cf23e91dd95','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-10 05:44:20'),('22cf2aa1-0971-48eb-a80f-a84ee6a3fd02','savings_withdrawal','97363bf3-495e-45ff-acdb-702e5865a117','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-06-14 16:02:24'),('233bf68c-6644-48db-b426-1a2b4d2ac67b','financing_applications','2cbef909-93b9-4521-a12b-97470159bffb','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-28 11:34:50'),('2434d96b-4d55-4f1c-afb8-18055c76c6d9','financing_applications','f0b03fda-448e-42ef-813b-b422e6d16c7c','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-20 10:51:07'),('2695efef-4e96-4f97-8386-1f1ac0d9a551','members','5bf49f02-1ed4-4b24-aab0-10d045d86ea8','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-07-12 22:54:33'),('2726e35e-ca12-406b-95cb-a44daf565841','savings_withdrawal','c1fb93f6-b0a3-461c-bdc2-c592588c848f','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-07-22 06:21:41'),('27882e90-7bef-4511-8cd3-49442414c42c','tabungan_withdrawals','52b039b4-71b8-4ea5-b238-9143625efe92','09202b1c-ef05-497c-8b8e-3cb2ed2f7e31',1,'2026-07-11 13:08:56'),('2870c5a0-43c1-4c1e-8dee-e5257360f673','member_saving_targets','bd717ff2-a73c-4e08-a0b1-59c33b918c87','aa78034f-529e-4bff-a620-16324a7e758b',1,'2026-06-27 23:37:24'),('2a52fc7a-3c51-4506-8fd3-e18d1a1b1552','members','9cdaeba3-619d-4ce4-83db-6e32c236aabb','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-07-22 06:03:56'),('2c5ddd40-66ae-47ca-9fc0-fc0e1ac2e945','savings_withdrawal','5f6c157a-9569-4205-829f-84103313f7c6','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-06-28 10:30:25'),('2cae07aa-4c92-458a-b1e8-ffb4e88fb223','financing_applications','ef991d7f-5d8f-475e-bc0a-228191029154','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-28 11:02:48'),('2d8aeef5-5d4b-46b0-b88f-f8b4f69e5a74','members','254317fd-7bf7-4dfe-a573-198fa700d91a','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-07-19 08:15:45'),('2edeb99a-d3a0-41c5-9edf-30641f410432','members','845aa028-2452-4368-ae37-f22f61d1fe55','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-06-20 00:25:39'),('2f6683d6-ff38-46d3-b3b2-3b4baa0faaab','financing_applications','5ab78b36-2690-417c-b048-c9ca435082e0','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-10 05:28:07'),('331a48d8-00c2-43f9-b030-4be27435abcd','savings_withdrawal','cb6cb9c5-ae22-420b-b1ac-aa53d6852ab7','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-07-22 10:58:41'),('34b772bf-eb0c-41f7-98f1-bb970ac6af99','savings_withdrawal','06e7d5c1-65f2-47fd-9a41-f8f293a5774c','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-07-22 07:47:48'),('35990145-0c09-40d6-8e3e-e847feace2e1','financing_applications','5ab78b36-2690-417c-b048-c9ca435082e0','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-10 05:29:09'),('35e9f23a-0105-4a02-9858-216c1f36a590','financing_applications','b6f7e4af-ed0f-4bf3-b842-2c32125c22f5','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-15 15:12:08'),('364881db-26f9-47e4-bfb0-3e9addb6c802','financing_applications','84390efa-7232-4522-ad99-59ea03abbc3c','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-10 05:53:59'),('3682ba15-f6a2-4ec0-b40b-5948afe62f16','savings_withdrawal','70d70f10-6424-408c-8fd6-c61994548439','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-07-04 17:56:51'),('37d1b144-b1ff-4e23-9b73-a96e9a121936','member_saving_targets','9bd1c1c1-ab12-4d95-a6bb-80867eff5ad0','ae3d446a-ba2a-43fd-969e-ea066fa84c3f',1,'2026-07-11 13:03:09'),('39943151-3800-4b89-b8f6-4819a7608c15','savings_withdrawal','d8c58f53-5e76-440f-a7ee-fff7ef4a6730','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-06-27 20:59:51'),('3a3be0a9-53bb-4bc9-8067-38d50d4ad4d7','financing_applications','5869361c-afcd-4fc2-8941-87aa81cba3a2','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-10 05:37:35'),('3adee64c-fafd-42c0-875f-8c3a9e7d46b9','savings_withdrawal','52ac4636-453d-469f-9311-e187e069982a','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-06-27 21:27:26'),('3c7177d3-2c22-4736-9e2a-47d9f4592ef6','member_saving_targets','a3e91f8d-d023-4d40-9f78-bf2cce1305bd','aa78034f-529e-4bff-a620-16324a7e758b',1,'2026-06-27 23:37:16'),('3d46300d-714c-4943-979b-6e677e5d5c36','tabungan_withdrawals','52b039b4-71b8-4ea5-b238-9143625efe92','cc92ea12-afb5-4924-aef0-a8d564e7bc52',1,'2026-07-11 13:09:14'),('3db5639f-de64-4406-8954-e808294242e9','financing_applications','9d8c679f-02b0-4ef9-87fb-d2102e5db784','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-28 11:35:57'),('3e2c7ea2-f94d-4dd4-9697-2de7d9a9cb2e','members','e3f23232-51db-48c6-88b9-c0f7447f2921','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-06-11 05:56:39'),('3ea03669-8394-40b4-88ff-eb1139e9c257','financing_applications','0a2eaf33-5931-40a1-8032-4cf23e91dd95','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-10 05:43:23'),('3ef3f9b1-7684-47d1-83b7-31c81d960d58','members','e3f23232-51db-48c6-88b9-c0f7447f2921','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-06-11 05:56:30'),('3f623bf6-5737-4fdf-a3ab-54eb0f8f3cda','member_saving_targets','36ac5941-b95c-4c04-9ea3-2f285d81f27c','aa78034f-529e-4bff-a620-16324a7e758b',1,'2026-06-27 06:38:58'),('4087a899-ce06-4885-954f-3e9079dd0dff','financing_applications','853b02b7-a090-47a8-a95a-3b5d56cbbac9','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-12 14:28:39'),('40d86e47-ae54-434c-b8f5-605ccc9c269a','savings_withdrawal','72bc481a-5702-4354-b0fe-1251d4c42e58','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-07-19 10:17:15'),('4120cb85-4e0c-41a8-a5f2-511d2f466858','financing_applications','d1231c9b-c32b-4560-8e7b-a6420dfdf5db','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-28 11:01:43'),('41570374-bb26-4ca9-838a-ca7df32124ab','financing_applications','ef991d7f-5d8f-475e-bc0a-228191029154','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-28 11:02:08'),('41f795f0-e142-4f20-9d62-807f171f2ccd','member_saving_targets','258a5048-61af-4cee-ae65-50fa43096df1','ae3d446a-ba2a-43fd-969e-ea066fa84c3f',1,'2026-07-11 09:15:42'),('429d0ac7-b259-4a49-9816-9baf92560071','savings_withdrawal','1891a509-17ba-4632-b996-b6f20b934d77','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-07-12 23:01:26'),('45f4a83c-ce28-4984-9d77-c7194f31b03a','financing_applications','aa7b5b48-d165-480b-b9b2-89f775588f75','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-28 14:03:16'),('474a3e02-bfaf-4d07-aabf-07436db6eb87','savings_withdrawal','1891a509-17ba-4632-b996-b6f20b934d77','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-07-12 23:01:01'),('476d2ac7-c607-48bc-94c1-821d0c4feda7','savings_withdrawal','cb6cb9c5-ae22-420b-b1ac-aa53d6852ab7','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-07-22 10:56:29'),('494da8f1-1d9d-4c80-b530-fa5db15f7b1f','savings_withdrawal','70715c92-8e76-45f4-8efa-4f455c2caf1f','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-07-04 18:23:36'),('4ade718c-6a21-4d1a-9db7-4febd1d96425','financing_applications','490b7bf2-0360-4dba-b5f2-dd1eb010efeb','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-06-28 11:21:06'),('4b37b9ef-8bdc-4431-9f1d-11f7c05aef10','savings_withdrawal','04793577-3110-4676-ac7b-308bff0bb964','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-06-12 05:55:03'),('4bc64926-cfad-4b2c-9dd6-322b66c07433','members','59453963-c10a-4747-a344-97d90a56de01','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-06-14 21:26:06'),('4c70a7a8-299b-4d58-af09-a18cdc703e64','savings_withdrawal','72bc481a-5702-4354-b0fe-1251d4c42e58','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-07-19 08:44:59'),('4c79e600-fccf-42c5-8ac4-30a9d655992a','financing_applications','047a1b81-ea9c-4586-bb4d-f10c3b5885a1','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-12 23:46:16'),('4cf3546f-3795-496b-ae56-0e77909c9588','financing_applications','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-22 11:31:59'),('4d676ec0-a464-4a47-906a-c4e8e823c23d','savings_withdrawal','d8c58f53-5e76-440f-a7ee-fff7ef4a6730','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-06-27 20:59:37'),('4e36bcb5-4f77-4e2d-b889-f6d4e879d1a0','savings_withdrawal','f5c203e7-8e60-41ce-9d43-d360e119e39a','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-06-14 15:37:38'),('4e67c8ae-214b-4859-8a48-b6790e690087','savings_withdrawal','52ac4636-453d-469f-9311-e187e069982a','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-06-27 21:28:36'),('4ebae85b-cc2b-4b1b-8234-0036c5542d36','financing_applications','982c5915-a8e9-44da-bc27-15b6a6a226c3','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-10 05:58:53'),('4edb3e55-786c-45af-9b97-0b040030b849','financing_applications','0f052691-fc1b-4865-bc0f-9a64555bac2e','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-28 11:26:54'),('4f8716fb-0d1e-44db-983e-b1fb8d7d3678','savings_withdrawal','c1fb93f6-b0a3-461c-bdc2-c592588c848f','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-07-22 06:22:55'),('510de7ee-f4d2-4c7a-a2b0-11a223f42dba','savings_withdrawal','dc873961-e0ee-45ce-afca-e456a133e971','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-06-28 10:51:26'),('5458327e-f901-4845-a34f-22b6494cb3b8','financing_applications','307448b3-6d21-4272-a22d-d6bdf549696c','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-12 13:55:05'),('557f53d6-d500-4fa7-ac5f-52d136263e93','financing_applications','0c2a6dd8-c22e-4fd4-9783-a3c5709ecd94','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-12 23:49:03'),('55b1d6a0-2aa3-450a-b60a-094f81c7b79c','financing_applications','ef991d7f-5d8f-475e-bc0a-228191029154','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-06-28 11:05:40'),('585df273-448c-40d0-b246-417339bc9f29','financing_applications','464ce96e-886b-4927-9e66-9b104b187f2d','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-12 12:48:41'),('58c6cc55-0a07-45ab-834b-aa9f85f16603','financing_applications','3282af71-207b-4fda-9d92-4892cb2c168f','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-28 14:00:52'),('59e34232-c062-4034-a9fe-bb06b63e204a','members','fc251e92-0c81-4f3f-b184-7a2f8bd85bc3','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-06-14 21:11:24'),('5a045528-4db2-4a3c-9749-8d16bc811b55','members','59453963-c10a-4747-a344-97d90a56de01','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-06-14 21:26:21'),('5a34185c-1e37-433f-a437-6edc15dab6c0','financing_applications','f0b03fda-448e-42ef-813b-b422e6d16c7c','c764fb77-3deb-4080-9164-533cc3a6ebdc',0,NULL),('5a50233b-21b1-405c-bdf9-becae4141a83','savings_withdrawal','70d70f10-6424-408c-8fd6-c61994548439','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-07-04 17:54:35'),('5a6b9474-0301-49b2-bb5d-ea0dab3e4439','financing_applications','5869361c-afcd-4fc2-8941-87aa81cba3a2','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-10 05:36:31'),('5b382697-8722-4a41-acfc-1a1374fe2696','financing_applications','d7f3d05a-8728-4ba6-879e-6d8e6860a27f','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-06-28 14:49:52'),('5dd8cd1c-bbd5-441f-824d-7b040bb329e1','financing_applications','aa7b5b48-d165-480b-b9b2-89f775588f75','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-06-28 14:03:49'),('5e0c19d3-0d6a-44db-8aaf-413e00c3137a','financing_applications','982c5915-a8e9-44da-bc27-15b6a6a226c3','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-10 06:00:19'),('5e4206f2-700f-487c-960c-cfa91f5114c4','financing_applications','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-22 13:34:50'),('60a29fa1-2141-4649-a49d-416855b4dd04','member_saving_targets','7c69914d-42ce-4e53-91b1-09f7556ec73a','aa78034f-529e-4bff-a620-16324a7e758b',1,'2026-06-27 18:06:37'),('620dbf24-5acf-4693-adc9-4bc44633a17f','financing_applications','197fac2c-1b2c-4b8b-b5bf-07ed64861a2d','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-20 10:47:31'),('624242e6-c695-4ad4-a1e5-0a9586cda783','members','993c8641-791e-49f4-b69e-070f771bbc16','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-06-27 15:45:07'),('62fed235-5d9d-4189-923a-483582c5b24e','savings_withdrawal','73b777cd-015f-4de8-a643-3edd0f4225c5','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-07-10 05:24:42'),('65730a1b-8a9e-49d1-8a35-e9ec467d456b','members','aa4c38c1-f577-48af-bf4a-3f7ab2089fea','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-06-28 10:07:50'),('693a04c0-447a-4b88-8642-867e412ac8b2','financing_applications','464ce96e-886b-4927-9e66-9b104b187f2d','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-06-12 12:51:56'),('6969d792-6a13-4f62-a973-8daa72115981','members','96a41a6b-081e-488e-b339-a6de32311267','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-07-25 01:28:17'),('69c69818-2364-46a4-8a01-cc9bf020cd76','members','cbdc3ae9-2432-4e1f-ade9-6a39a9986445','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-07-25 01:12:50'),('6a1df5c1-3afc-47ce-8c8c-6ca370eac2a6','financing_applications','ca4f7ad6-3d0e-428a-ba7f-9712863c00c5','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-12 23:31:25'),('6d80719c-ff64-46d5-94ce-ee35683fc3d3','savings_withdrawal','06e7d5c1-65f2-47fd-9a41-f8f293a5774c','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-07-22 07:44:24'),('6e3bc9e9-5599-4c10-9597-9d38f36cf1ec','savings_withdrawal','72bc481a-5702-4354-b0fe-1251d4c42e58','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-07-19 08:45:36'),('6ebad5f4-5f1c-48a5-8e33-3302662688ed','members','ce0c9410-71b8-411d-a13e-174902d3503c','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-06-28 09:58:35'),('702407d9-22ba-4118-bd6c-07cb8afd3541','members','aa4c38c1-f577-48af-bf4a-3f7ab2089fea','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-06-28 10:03:09'),('70e7fa61-ed00-45f5-a695-3a8765d7f1fd','financing_applications','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-22 11:38:06'),('712843a6-6553-4d53-9747-58ae045d0ce1','tabungan_withdrawals','7da294b0-ffcb-479f-bdd1-535ad155aa4f','bd75b0f1-63b9-420d-9d8c-16698a8763b4',1,'2026-07-11 11:41:11'),('7180de2a-336c-4bae-969c-6d976117143d','savings_withdrawal','b8d0aa4b-c83a-400a-96ec-33b2f9a8657c','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-07-21 15:35:38'),('71a260eb-fbc9-4a76-84d3-bb482e4818e5','financing_applications','d36aa642-0645-4572-bdd9-3a9c3ae82f8d','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-28 01:16:32'),('725bae06-b190-4a5e-bec6-6ec462107477','financing_applications','b8788138-1aaf-4dbc-8d01-47915fa3c8c5','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-22 11:35:07'),('7273ff58-e7a8-49bc-8702-e099ecad4e99','financing_applications','162072e2-bea3-4d9f-b92e-1afe855156ab','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-20 16:15:54'),('73a8cc36-97f6-4415-b8b8-0f97cd66cfdf','financing_applications','0c2a6dd8-c22e-4fd4-9783-a3c5709ecd94','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-12 23:49:26'),('757bf9f5-03d7-4a9c-b2c3-76b2bacd4ef5','savings_withdrawal','dc873961-e0ee-45ce-afca-e456a133e971','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-06-28 10:48:17'),('76299ffb-9af8-4102-aab5-070f7df69ffe','savings_withdrawal','dc873961-e0ee-45ce-afca-e456a133e971','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-06-28 10:46:32'),('76c5e131-cdde-40fe-99d1-7e25118b6c77','savings_withdrawal','f5c203e7-8e60-41ce-9d43-d360e119e39a','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-06-14 15:48:44'),('76c6caa8-7ed6-4170-877a-3696b7cacafd','members','05cb7dc0-14f2-4726-9118-9d50822301e8','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-07-25 01:13:18'),('76d8c0e6-61b3-40e6-8199-3c5e50008ba4','savings_withdrawal','e3b3589d-7e16-4ba0-a923-c9346115d50a','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-06-27 21:04:38'),('77db5d6c-eb38-4fe1-853d-ad6600ef54f0','financing_applications','84390efa-7232-4522-ad99-59ea03abbc3c','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-10 05:52:03'),('791255a7-45a8-4047-a92f-542f4532d640','financing_applications','26c1b1aa-fbbe-42ef-a9a2-fc823f646597','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-19 09:00:54'),('792dc507-29bc-48e9-8a4f-431a17ea414f','financing_applications','a31bf12e-6cc0-419f-8c62-5b649cd3fe09','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-06-14 21:30:32'),('79b17d27-38e1-4f0a-8fdd-29965ec268b5','financing_applications','dba222dd-1042-4bb0-ac4f-24ad93afbe7e','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-20 10:55:55'),('7caac82e-4cc1-40a4-b06b-b9c4b8e26d30','financing_applications','cd989fb3-4917-4edb-8c7f-b15e63bab308','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-21 16:15:10'),('7cdc037b-e3ec-4c84-b4e3-805c7eebedc4','financing_applications','ca4f7ad6-3d0e-428a-ba7f-9712863c00c5','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-12 23:31:48'),('80446a4a-04f4-460e-a3f4-93b205de7f09','savings_withdrawal','b8d0aa4b-c83a-400a-96ec-33b2f9a8657c','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-07-21 15:24:17'),('80e1d291-4d61-48ee-a063-405a695f2bba','financing_applications','26c1b1aa-fbbe-42ef-a9a2-fc823f646597','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-20 10:41:26'),('814f9714-8cad-4da6-8c89-82053839dacf','savings_withdrawal','73b777cd-015f-4de8-a643-3edd0f4225c5','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-07-10 05:24:14'),('83471819-f34e-4a18-af17-fde0addb1b2a','savings_withdrawal','cb6cb9c5-ae22-420b-b1ac-aa53d6852ab7','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-07-22 10:46:59'),('8694786e-1d56-4013-a049-24691948d806','members','b08024e6-a58b-4ef0-8807-b2fe11a49d55','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-07-04 15:09:35'),('882fbb35-c725-4879-84e8-2a4d8303f456','savings_withdrawal','97363bf3-495e-45ff-acdb-702e5865a117','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-06-14 15:51:46'),('8898bade-6a7d-4169-9503-c0797b221272','member_saving_targets','39f07132-5fa6-487c-ad9d-53706cc49fc2','aa78034f-529e-4bff-a620-16324a7e758b',1,'2026-07-13 07:43:31'),('88a5f3f8-744c-4820-948b-340954d8251e','savings_withdrawal','e3b3589d-7e16-4ba0-a923-c9346115d50a','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-06-27 21:05:35'),('895e433f-f4ae-489a-9659-f28d3887951e','financing_applications','f0b03fda-448e-42ef-813b-b422e6d16c7c','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-20 10:50:36'),('89b5be70-4303-44a0-9305-620dd97827fb','financing_applications','307448b3-6d21-4272-a22d-d6bdf549696c','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-12 13:55:32'),('8a28d5a9-827c-4bdc-ab83-028a9ef9f2b0','member_saving_targets','258a5048-61af-4cee-ae65-50fa43096df1','aa78034f-529e-4bff-a620-16324a7e758b',1,'2026-07-11 09:06:43'),('8b1ad116-9f8b-4e2c-a8e0-0f19807f8378','member_saving_targets','39f07132-5fa6-487c-ad9d-53706cc49fc2','c553f08f-eed7-4fcd-aa47-4762514e54b0',1,'2026-07-13 07:48:02'),('8ba36591-45af-4bcb-80ce-2bcc1958a92a','financing_applications','b6f7e4af-ed0f-4bf3-b842-2c32125c22f5','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-15 15:11:18'),('8be3e995-8fbf-4a9e-a5c3-e6c765a31e5a','tabungan_withdrawals','7da294b0-ffcb-479f-bdd1-535ad155aa4f','cc92ea12-afb5-4924-aef0-a8d564e7bc52',1,'2026-07-11 11:34:28'),('8bf0b40d-ffe6-4a75-9ec4-d6c2f67b04d6','financing_applications','3282af71-207b-4fda-9d92-4892cb2c168f','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-06-28 14:04:08'),('8ccd5dc0-b1a6-40e2-b6c9-ce14f0de10f5','financing_applications','490b7bf2-0360-4dba-b5f2-dd1eb010efeb','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-28 11:19:15'),('901cd156-fb92-474c-956c-1afdb155aa7c','financing_applications','047a1b81-ea9c-4586-bb4d-f10c3b5885a1','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-12 23:44:51'),('9023481a-6010-487f-98b1-fce224cb9de6','savings_withdrawal','9d14a828-231e-42e0-adc8-f51a75c324f7','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-06-20 00:29:37'),('905ee054-21d6-43ae-891c-6567680f19ae','financing_applications','9d8c679f-02b0-4ef9-87fb-d2102e5db784','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-06-28 11:36:28'),('90b035e6-3248-48c0-ac32-3daf24fef1c0','financing_applications','853b02b7-a090-47a8-a95a-3b5d56cbbac9','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-06-12 14:28:51'),('90b5bde7-ba03-4b22-bf18-9487d9945c9c','savings_withdrawal','e3b3589d-7e16-4ba0-a923-c9346115d50a','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-06-27 21:04:22'),('917b565c-14ad-47e0-8c55-5bfda36b698d','financing_applications','ae792540-ce34-4ebf-bec2-0bceac2e9120','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-21 15:58:05'),('91c2c1a5-4084-402c-ac06-b72d918acd24','savings_withdrawal','f5c203e7-8e60-41ce-9d43-d360e119e39a','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-06-14 14:25:59'),('92daa6cd-dc15-4cc5-9bb8-19eab4a19c44','financing_applications','464ce96e-886b-4927-9e66-9b104b187f2d','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-12 12:51:29'),('95ee978c-1d46-468d-9166-f346fc02739e','financing_applications','d36aa642-0645-4572-bdd9-3a9c3ae82f8d','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-06-28 01:57:50'),('971c284f-be80-4551-a02c-c0339732f211','members','2be2b591-1bc3-45d2-b6d4-17e5fc79e26a','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-06-11 05:49:47'),('97efd568-4074-47c1-a751-6ce8d1e24071','members','7b8eda2f-8a9e-4bfb-a141-1323cc9d9a60','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-06-14 12:17:25'),('993c039d-f097-4654-ade5-538063958525','savings_withdrawal','9d14a828-231e-42e0-adc8-f51a75c324f7','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-06-20 00:28:49'),('9a6b4177-74e6-4187-b30c-60e98f92b118','financing_applications','5ab78b36-2690-417c-b048-c9ca435082e0','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-10 05:28:31'),('9a8b8898-0a41-44ee-8ccd-70987bc4ea6b','financing_applications','0a2eaf33-5931-40a1-8032-4cf23e91dd95','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-10 05:43:42'),('9b821728-df18-4fb1-93c6-32b6afa17c93','financing_applications','cd989fb3-4917-4edb-8c7f-b15e63bab308','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-21 16:12:58'),('9c3a8d39-4ebd-49a4-8f81-9407e305c0b6','financing_applications','aa7b5b48-d165-480b-b9b2-89f775588f75','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-28 14:01:08'),('9d8c7854-da76-4569-bd7f-49728a51a622','financing_applications','3282af71-207b-4fda-9d92-4892cb2c168f','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-28 14:03:00'),('9de76f2c-46c3-4cd6-adf5-75596f6ec975','members','68e8a3c6-4710-4ff2-b43e-d71abdae3965','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-06-13 01:36:56'),('9e9c63bc-4bee-4683-99c0-a3ca2ced603a','members','8c17a15e-19e6-4698-91ee-668858f5c61e','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-06-28 09:59:14'),('9e9fb44b-52e2-4039-8e23-99b8abbdf9f1','financing_applications','0f052691-fc1b-4865-bc0f-9a64555bac2e','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-06-28 11:28:50'),('a0c0211e-65c4-486b-aa53-a8eae8704b7d','financing_applications','2cbef909-93b9-4521-a12b-97470159bffb','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-06-28 11:36:37'),('a13bd193-b797-4763-a10e-5ceea7db47b3','financing_applications','71ca8581-40ca-4cae-a0c0-bcb08c8fc502','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-22 13:24:02'),('a1ce45ad-5332-445e-bd23-09e190bd2394','financing_applications','d1231c9b-c32b-4560-8e7b-a6420dfdf5db','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-28 11:03:25'),('a2a83bfe-1be6-43ad-b362-5788b64fefbb','members','05cb7dc0-14f2-4726-9118-9d50822301e8','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-07-23 21:50:30'),('a74dac11-db71-4b58-b8dd-5735d39614ad','members','7b8eda2f-8a9e-4bfb-a141-1323cc9d9a60','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-06-14 11:36:14'),('a8fcf557-be8f-4d7b-a031-478a8d26718c','financing_applications','dba222dd-1042-4bb0-ac4f-24ad93afbe7e','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-20 10:55:33'),('a9c185dc-fbe1-47e0-9cfa-dc605867dc77','financing_applications','5869361c-afcd-4fc2-8941-87aa81cba3a2','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-10 05:37:03'),('adaf9338-37f7-4af7-9023-fc16d42faf90','savings_withdrawal','ee29b855-ef5d-4b44-b147-5e571a4f8c85','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-06-13 01:58:39'),('aeab3852-c658-49aa-8b21-eeee9ea2723f','members','5bf49f02-1ed4-4b24-aab0-10d045d86ea8','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-07-12 22:54:14'),('b175817e-9a44-457e-b286-894e69712c12','savings_withdrawal','97363bf3-495e-45ff-acdb-702e5865a117','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-06-14 15:52:10'),('b3950df7-01b3-473d-8ec0-0d31a91a8456','exit_requests','71485dac-543a-4a74-9468-decc51b5d1d8','4e7a7f27-c78e-4b21-aca1-fa7e0f66953f',1,'2026-07-23 09:38:17'),('b4f59e8a-5f6f-47c2-afa6-60080945618a','financing_applications','0c2a6dd8-c22e-4fd4-9783-a3c5709ecd94','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-12 23:48:39'),('b64628de-1872-4a81-92a8-569773fea46d','member_saving_targets','d920f317-809a-4841-ac15-bb11b80106c6','ae3d446a-ba2a-43fd-969e-ea066fa84c3f',1,'2026-06-27 23:39:50'),('b6f3d053-bee2-441e-9b96-a6a577715d24','members','96a41a6b-081e-488e-b339-a6de32311267','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-07-25 01:27:16'),('b8f9d00a-c1a4-45f4-b785-6ff960be6420','financing_applications','3899a56c-61b1-452b-8e4f-f6844679efa6','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-06-12 16:27:31'),('b98638ea-87d4-40d4-9a43-0a13b8514cf6','financing_applications','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-22 13:45:41'),('ba4031a7-c14e-44c2-87a4-93f745f34cab','member_saving_targets','bd717ff2-a73c-4e08-a0b1-59c33b918c87','ae3d446a-ba2a-43fd-969e-ea066fa84c3f',1,'2026-06-27 23:38:37'),('bad9b6e3-8d9e-4656-ab52-e49ca1f8f394','members','8c17a15e-19e6-4698-91ee-668858f5c61e','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-06-28 09:58:48'),('bb4f03ae-ba51-4c24-bf9f-b001837372c1','financing_applications','ca4f7ad6-3d0e-428a-ba7f-9712863c00c5','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-12 23:29:25'),('bb9cac52-1edd-44d4-be38-1a540a011740','savings_withdrawal','5f6c157a-9569-4205-829f-84103313f7c6','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-06-28 10:32:32'),('bc4d4bc8-7f1b-4e5e-9ec1-62a839bc1086','members','2be2b591-1bc3-45d2-b6d4-17e5fc79e26a','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-06-11 05:49:16'),('be30f0bf-3cc1-4f57-b893-46bc36180fd0','member_saving_targets','8eac3e7c-6dd3-47e1-84ee-2228df92ca92','c553f08f-eed7-4fcd-aa47-4762514e54b0',1,'2026-06-27 23:37:49'),('be617dfe-4b33-4eff-801e-8281136cafb6','financing_applications','a31bf12e-6cc0-419f-8c62-5b649cd3fe09','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-14 21:29:59'),('c09a3e04-372a-442d-ab6f-901063c915c4','savings_withdrawal','9d14a828-231e-42e0-adc8-f51a75c324f7','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-06-20 00:29:00'),('c0ae67c9-4ad7-495c-b1b5-86fd912fa2a5','member_saving_targets','258a5048-61af-4cee-ae65-50fa43096df1','c553f08f-eed7-4fcd-aa47-4762514e54b0',1,'2026-07-11 09:09:39'),('c1a8c7ca-fc8c-4cca-a2f0-7ad5a13b50b2','member_saving_targets','d920f317-809a-4841-ac15-bb11b80106c6','aa78034f-529e-4bff-a620-16324a7e758b',1,'2026-06-27 23:39:17'),('c2ef444b-fec5-4ea5-b0bf-b79946e5ef86','member_saving_targets','7c69914d-42ce-4e53-91b1-09f7556ec73a','c553f08f-eed7-4fcd-aa47-4762514e54b0',1,'2026-06-27 18:06:51'),('c3182de6-5058-4876-855e-5260603aebc1','savings_withdrawal','8c74ca8d-66bc-40e4-84ce-3dac6dd21303','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-06-16 14:06:11'),('c31a23f0-4d11-459e-9ba8-47560023c479','financing_applications','73f440b1-1c88-4a6b-908b-f9667f7ece73','5451bd25-0db9-44fa-86d7-e38be5ee5374',0,NULL),('c329afa9-8a80-4f6c-83ca-834d45967556','member_saving_targets','36ac5941-b95c-4c04-9ea3-2f285d81f27c','ae3d446a-ba2a-43fd-969e-ea066fa84c3f',1,'2026-06-27 06:39:23'),('c8f597b2-813e-4055-b237-a2b723776729','savings_withdrawal','8c74ca8d-66bc-40e4-84ce-3dac6dd21303','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-06-16 14:07:39'),('c9383ea3-5cdd-41e2-8dff-e802fd2cf65d','financing_applications','197fac2c-1b2c-4b8b-b5bf-07ed64861a2d','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-20 10:48:42'),('ccb659fa-1af9-46a4-8036-2e672c6e8478','financing_applications','2cbef909-93b9-4521-a12b-97470159bffb','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-28 11:36:23'),('cd5a49ee-f009-4a95-bedd-3d18b860716d','financing_applications','853b02b7-a090-47a8-a95a-3b5d56cbbac9','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-12 14:28:19'),('ce4fa0ab-b30a-4993-a3fe-790d4bd9c9b3','financing_applications','51f924fd-e02d-45f9-95df-fbecead37f89','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-28 14:06:34'),('cf6b6c4f-5138-441d-bfb8-c871cd9a34c0','members','4bd09b20-7c9e-4c5b-83d3-2dcb3426bf4c','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-07-21 15:19:43'),('d0f1decb-39d9-4689-8c5c-f5aac9a38bdf','savings_withdrawal','5932c072-a923-48dc-aa57-25c963e84dee','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-06-15 21:50:10'),('d1191a30-c17c-4c01-aa07-52d53e62acaa','financing_applications','ebf9cfd6-e69e-4a69-aef1-7467102a7a9e','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-20 10:44:25'),('d22a7e91-4601-4d40-827b-1e40026696a1','member_saving_targets','8eac3e7c-6dd3-47e1-84ee-2228df92ca92','ae3d446a-ba2a-43fd-969e-ea066fa84c3f',1,'2026-06-27 23:38:28'),('d2f50428-2ed3-4746-9e51-57a3fbf405df','members','c124f2c8-558b-454d-8ec7-614d118c4cef','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-06-18 21:36:08'),('d394e473-7356-47a6-92f1-cf1374a78bd9','members','c1bae905-c53d-4b46-b0ff-b1350fdb5d4b','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-06-15 21:42:40'),('d4434eee-7a18-48f0-adca-f1a31336b94a','financing_applications','162072e2-bea3-4d9f-b92e-1afe855156ab','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-20 16:16:33'),('d4835d69-fc37-4b2c-b6a8-9bb0f537d7ca','financing_applications','dba222dd-1042-4bb0-ac4f-24ad93afbe7e','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-20 11:11:02'),('d49f659d-ec1d-441a-8bc7-9452ce12c130','savings_withdrawal','ee29b855-ef5d-4b44-b147-5e571a4f8c85','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-06-13 01:58:55'),('d61f2057-909a-4e19-911d-a44d46fe5ba1','financing_applications','197fac2c-1b2c-4b8b-b5bf-07ed64861a2d','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-20 10:48:07'),('d67a370a-b620-47a3-b4e7-ca53ea76b1f8','financing_applications','3899a56c-61b1-452b-8e4f-f6844679efa6','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-12 16:25:54'),('d69ae0ad-e1d7-4c33-9289-a25af2c99e3e','members','c124f2c8-558b-454d-8ec7-614d118c4cef','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-06-18 21:35:47'),('d7220bf4-d486-4808-bccc-ebd19e814df5','tabungan_withdrawals','7da294b0-ffcb-479f-bdd1-535ad155aa4f','09202b1c-ef05-497c-8b8e-3cb2ed2f7e31',1,'2026-07-11 11:09:44'),('d7c0bc0c-deb7-40e3-a62b-b40009ffdfe8','member_saving_targets','36ac5941-b95c-4c04-9ea3-2f285d81f27c','c553f08f-eed7-4fcd-aa47-4762514e54b0',1,'2026-06-27 06:39:14'),('dd92f464-4d47-41d2-9e09-e6e604367f74','member_saving_targets','a3e91f8d-d023-4d40-9f78-bf2cce1305bd','ae3d446a-ba2a-43fd-969e-ea066fa84c3f',1,'2026-06-27 23:38:47'),('de073368-0edc-41ee-a8d1-658fb98d2bd9','financing_applications','982c5915-a8e9-44da-bc27-15b6a6a226c3','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-10 05:58:26'),('de2412c3-1a94-4a0d-9d5c-3c2910c01c4d','members','4bd09b20-7c9e-4c5b-83d3-2dcb3426bf4c','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-07-21 15:11:55'),('e09d29db-341d-40cc-a775-55e130989835','members','68e8a3c6-4710-4ff2-b43e-d71abdae3965','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-06-13 01:36:45'),('e0a0977a-db67-4ba9-b42b-07e85acbbf6b','savings_withdrawal','8c74ca8d-66bc-40e4-84ce-3dac6dd21303','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-06-16 14:05:46'),('e18423ce-8c53-40d0-bae2-a52b9c5e7fc2','financing_applications','162072e2-bea3-4d9f-b92e-1afe855156ab','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-20 16:15:25'),('e236c285-9c58-4529-be39-e611cfdcc347','member_saving_targets','bd717ff2-a73c-4e08-a0b1-59c33b918c87','c553f08f-eed7-4fcd-aa47-4762514e54b0',1,'2026-06-27 23:38:07'),('e23ebaab-1e37-463f-968b-9c2278484afc','savings_withdrawal','5932c072-a923-48dc-aa57-25c963e84dee','c7a56350-8064-49bc-8b9d-d9bb20261f2d',1,'2026-06-15 21:47:55'),('e30d658d-65a3-4a42-a9fe-a563f520e7a5','member_saving_targets','d920f317-809a-4841-ac15-bb11b80106c6','c553f08f-eed7-4fcd-aa47-4762514e54b0',1,'2026-06-27 23:39:35'),('e4b5a2de-dddc-4871-bc5b-6c33c5668e59','savings_withdrawal','06e7d5c1-65f2-47fd-9a41-f8f293a5774c','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-07-22 10:42:28'),('e68b8f9a-28d6-4593-807f-26cafb105560','exit_requests','71485dac-543a-4a74-9468-decc51b5d1d8','f09e8ead-d6ba-4064-9e01-5b980d2a1310',1,'2026-07-23 09:39:07'),('e71aea66-768d-4ce5-97f8-8d50aa03d8b0','financing_applications','51f924fd-e02d-45f9-95df-fbecead37f89','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-28 14:00:32'),('e72b6159-f03a-4204-80e6-899c8ba85696','financing_applications','71ca8581-40ca-4cae-a0c0-bcb08c8fc502','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-22 13:24:41'),('e76e3d02-4c68-4014-be06-2fb98c31b826','members','993c8641-791e-49f4-b69e-070f771bbc16','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-06-27 15:44:59'),('e8583113-7a9f-42f2-9872-8d7ddb5adb9f','members','fc251e92-0c81-4f3f-b184-7a2f8bd85bc3','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-06-14 21:12:37'),('e89948c0-d700-4ab4-a53a-87f8b6ca44bf','financing_applications','26c1b1aa-fbbe-42ef-a9a2-fc823f646597','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-20 10:42:17'),('e928d1ec-998f-442c-aaea-83435f289170','financing_applications','490b7bf2-0360-4dba-b5f2-dd1eb010efeb','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-28 11:20:22'),('eb059b16-22b2-40c8-880e-f96741c55e13','savings_withdrawal','b8d0aa4b-c83a-400a-96ec-33b2f9a8657c','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-07-21 15:37:16'),('ec2081b0-3dd7-4413-988e-8f237b7c83b3','financing_applications','ed8399fb-41c9-40cb-ab72-f2254964658d','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-13 07:47:44'),('ec380a4e-c1c9-491f-9e5a-e38364ecad79','savings_withdrawal','ee29b855-ef5d-4b44-b147-5e571a4f8c85','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-06-13 01:59:19'),('ede2fc2e-3138-44a5-92ec-f12897039ed5','members','254317fd-7bf7-4dfe-a573-198fa700d91a','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-07-19 08:14:28'),('ee0f5df5-d23d-418e-a812-858a9d3dc58b','members','cbdc3ae9-2432-4e1f-ade9-6a39a9986445','52d1bef5-cb8e-4919-a88f-20b41b4c2edb',1,'2026-07-25 01:13:24'),('ee1115e3-c4b5-4edf-ab6d-b574b00bf854','financing_applications','a31bf12e-6cc0-419f-8c62-5b649cd3fe09','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-14 21:29:22'),('ef9b0312-4dff-457a-9903-6e5e78c5b1dc','savings_withdrawal','04793577-3110-4676-ac7b-308bff0bb964','fe9fc4f9-fb9e-4633-9fa9-1bb7b1cb7cc4',1,'2026-06-12 06:00:14'),('efb7a730-bccf-49fb-ab38-6593f499e625','financing_applications','ed8399fb-41c9-40cb-ab72-f2254964658d','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-07-13 07:53:31'),('effcb171-ab48-4f93-895a-31142ac0a9ae','member_saving_targets','9bd1c1c1-ab12-4d95-a6bb-80867eff5ad0','c553f08f-eed7-4fcd-aa47-4762514e54b0',1,'2026-07-11 13:02:48'),('f0c1e0f5-3edd-409f-8ee3-34a20e679bf9','members','ce0c9410-71b8-411d-a13e-174902d3503c','921b4cfd-da44-4507-9fa1-781128515015',1,'2026-06-28 09:58:01'),('f127d06a-6187-43ff-87e8-ea98d82a3df3','financing_applications','ebf9cfd6-e69e-4a69-aef1-7467102a7a9e','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-20 10:43:48'),('f1bebfbd-688f-4b8e-9d20-5b5a4dcddc46','financing_applications','d1231c9b-c32b-4560-8e7b-a6420dfdf5db','c764fb77-3deb-4080-9164-533cc3a6ebdc',1,'2026-06-28 11:07:58'),('f228f9ef-df4f-459b-a8ce-63a4d9ceb988','financing_applications','b19b04bf-ea9e-434c-aa0f-fe85367eb0bf','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-16 01:38:38'),('f51f0123-dea7-4557-96f4-440b7c623882','savings_withdrawal','d8c58f53-5e76-440f-a7ee-fff7ef4a6730','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-06-27 21:05:20'),('f584b28d-5a73-4ea6-b92e-7239f6ff6ca2','savings_withdrawal','c1fb93f6-b0a3-461c-bdc2-c592588c848f','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-07-22 06:24:58'),('f5e89d7c-f57c-472b-bac2-779e6363592e','financing_applications','c7fabe18-2733-419c-b646-5bd1676eca6c','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-07-12 23:34:53'),('faca74d6-8a02-4b6a-b03a-df330b022b26','financing_applications','d7f3d05a-8728-4ba6-879e-6d8e6860a27f','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-06-28 14:43:50'),('fb2e99a2-d60e-4def-84f6-d6ba23ade4d2','financing_applications','9d8c679f-02b0-4ef9-87fb-d2102e5db784','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-28 11:35:12'),('fb4a2910-9bb7-4c30-82cf-0e3a0e220c2f','financing_applications','d7f3d05a-8728-4ba6-879e-6d8e6860a27f','5451bd25-0db9-44fa-86d7-e38be5ee5374',1,'2026-06-28 14:43:25'),('fbd869b6-d5c4-400b-a9a5-871c1d59e1af','financing_applications','84390efa-7232-4522-ad99-59ea03abbc3c','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-10 05:53:09'),('fe78a266-0991-4acd-9e2f-c58c28092076','financing_applications','cebd03d3-f11a-43a4-864a-c03b5f8df5e1','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-22 13:40:30'),('fe96a314-5deb-4459-9be0-be3aaac7e66c','savings_withdrawal','1891a509-17ba-4632-b996-b6f20b934d77','1d546dbd-e7b1-4ae9-bcc1-54ac916d9499',1,'2026-07-12 23:01:53'),('feec36e9-06f0-46bb-b3c6-0494177dc98d','member_saving_targets','9bd1c1c1-ab12-4d95-a6bb-80867eff5ad0','aa78034f-529e-4bff-a620-16324a7e758b',1,'2026-07-11 13:02:23'),('ff9cd697-99de-4b1e-ad2c-ccfc7c61bf56','financing_applications','047a1b81-ea9c-4586-bb4d-f10c3b5885a1','accd3b83-97ec-4486-b9ee-9b12afad7775',1,'2026-07-12 23:45:46');
/*!40000 ALTER TABLE `entity_step_approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluations`
--

DROP TABLE IF EXISTS `evaluations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluations` (
  `evaluation_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `material_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `score` int DEFAULT NULL,
  `passed` tinyint(1) DEFAULT '0',
  `answers` json DEFAULT NULL,
  `evaluated_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`evaluation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluations`
--

LOCK TABLES `evaluations` WRITE;
/*!40000 ALTER TABLE `evaluations` DISABLE KEYS */;
/*!40000 ALTER TABLE `evaluations` ENABLE KEYS */;
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
  KEY `fk_exit_refund_request` (`exit_request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `obligation_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_bill` decimal(18,2) DEFAULT NULL,
  `total_paid` decimal(18,2) DEFAULT NULL,
  `remaining_amount` decimal(18,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`exit_settlement_id`),
  KEY `fk_exit_settlement_request` (`exit_request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exit_settlements`
--

LOCK TABLES `exit_settlements` WRITE;
/*!40000 ALTER TABLE `exit_settlements` DISABLE KEYS */;
/*!40000 ALTER TABLE `exit_settlements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feature_configs`
--

DROP TABLE IF EXISTS `feature_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feature_configs` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `menu` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `submenu` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `akad_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feature_configs`
--

LOCK TABLES `feature_configs` WRITE;
/*!40000 ALTER TABLE `feature_configs` DISABLE KEYS */;
INSERT INTO `feature_configs` VALUES ('arisan','Arisan','Daftar Arisan','Wadiah'),('billing','Billing','Pembayaran Tagihan',NULL),('investasi','Investasi','Investasi','Wadiah'),('jualBeli','Juali Beli','Jual Beli','Wadiah'),('pendanaan','Pendanaan','Pendanaan','Wadiah'),('pinjaman_brg','Pinjaman','Pinjaman Barang','Wadiah'),('pinjaman_reg','Pinjaman','Pinjaman Reguler','Wadiah'),('tabungan','Tabungan','Tabungan Umum','Wadiah');
/*!40000 ALTER TABLE `feature_configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financing_applications`
--

DROP TABLE IF EXISTS `financing_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financing_applications` (
  `financing_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `business_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purpose` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_price` decimal(18,2) DEFAULT '0.00',
  `down_payment` decimal(18,2) DEFAULT '0.00',
  `required_amount` decimal(18,2) NOT NULL,
  `cooperation_months` int DEFAULT NULL,
  `monthly_installment` decimal(18,2) DEFAULT NULL,
  `margin_percent` decimal(5,2) DEFAULT '0.00',
  `margin_amount` decimal(18,2) DEFAULT '0.00',
  `total_tagihan` decimal(18,2) DEFAULT '0.00',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `approval_flow_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `current_step_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `akad_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Murabahah',
  `collateral_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_rejected` tinyint(1) DEFAULT '0',
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `metode_pencairan` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_rekening` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_tujuan` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lokasi_pencairan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tanggal_pencairan` date DEFAULT NULL,
  `jam_pencairan` time DEFAULT NULL,
  `nama_nasabah` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_peserta_2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `arisan_batch_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `file_evidence` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `operational_cost` decimal(18,2) DEFAULT '0.00',
  `business_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `business_sector` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `business_address` text COLLATE utf8mb4_unicode_ci,
  `estimated_yearly_turnover` decimal(18,2) DEFAULT '0.00',
  `estimated_monthly_turnover` decimal(18,2) DEFAULT '0.00',
  `investor_profit_share` decimal(5,2) DEFAULT '0.00',
  `contract_proof` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `additional_documents` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transfer_proof_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount` decimal(15,2) DEFAULT '0.00',
  PRIMARY KEY (`financing_id`),
  KEY `member_id` (`member_id`),
  KEY `approval_flow_id` (`approval_flow_id`),
  KEY `current_step_id` (`current_step_id`),
  KEY `arisan_batch_id` (`arisan_batch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financing_applications`
--

LOCK TABLES `financing_applications` WRITE;
/*!40000 ALTER TABLE `financing_applications` DISABLE KEYS */;
INSERT INTO `financing_applications` VALUES ('71ca8581-40ca-4cae-a0c0-bcb08c8fc502','0a7fd51a-6494-4202-89b6-94641b105fbb',NULL,'Darurat','Pinjaman Darurat',3000000.00,0.00,3000000.00,3,1000000.00,0.00,0.00,0.00,'APPROVED','bf046302-6819-41a4-b375-3340fb201bda',NULL,'Murabahah',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'uploads/financing-evidence/evidence-71ca8581-40ca-4cae-a0c0-bcb08c8fc502-1784701053590-148713546.png','2026-07-22 13:17:33','2026-07-22 13:25:45',0.00,NULL,NULL,NULL,0.00,0.00,0.00,NULL,NULL,'uploads/transfers/71ca8581-40ca-4cae-a0c0-bcb08c8fc502_fin_1784701544797.png',0.00),('b8788138-1aaf-4dbc-8d01-47915fa3c8c5','0a7fd51a-6494-4202-89b6-94641b105fbb',NULL,'Elektronik','Lenovo',5000000.00,1500000.00,3700000.00,12,394667.00,28.00,1036000.00,4736000.00,'APPROVED','bf046302-6819-41a4-b375-3340fb201bda',NULL,'Murabahah',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-22 11:28:45','2026-07-22 11:38:07',200000.00,NULL,NULL,NULL,0.00,0.00,0.00,NULL,NULL,NULL,0.00),('cebd03d3-f11a-43a4-864a-c03b5f8df5e1','0a7fd51a-6494-4202-89b6-94641b105fbb',NULL,'Arisan','Arisan umrah  - batch 6',54000000.00,0.00,54000000.00,12,4500000.00,0.00,0.00,0.00,'APPROVED','bf046302-6819-41a4-b375-3340fb201bda',NULL,'Musyarakah Mutanaqisah',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'mohamadfahmyiqbal','Istri','gggg','15aaa0f0-d806-423c-b4b4-66697c30ee43',NULL,'2026-07-22 13:33:37','2026-07-22 13:45:42',0.00,NULL,NULL,NULL,0.00,0.00,0.00,NULL,NULL,NULL,0.00);
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
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`financing_bill_id`),
  KEY `idx_financing_bills_due_status` (`financing_id`,`due_datetime`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financing_bills`
--

LOCK TABLES `financing_bills` WRITE;
/*!40000 ALTER TABLE `financing_bills` DISABLE KEYS */;
/*!40000 ALTER TABLE `financing_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financing_categories`
--

DROP TABLE IF EXISTS `financing_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financing_categories` (
  `category_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `category_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financing_categories`
--

LOCK TABLES `financing_categories` WRITE;
/*!40000 ALTER TABLE `financing_categories` DISABLE KEYS */;
INSERT INTO `financing_categories` VALUES ('1651acf2-669d-4031-a666-9b1faf000937','Kendaraan',1),('7519d422-7aec-4e4d-bbc4-c164e9c70983','Property',1),('8b92cb2b-7e5f-41aa-b90a-d2b6cdae9a9a','Elektronik',1);
/*!40000 ALTER TABLE `financing_categories` ENABLE KEYS */;
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
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`financing_disbursement_id`),
  KEY `fk_financing_disbursement_app` (`financing_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `payment_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`financing_payment_id`),
  KEY `fk_financing_payment_bill` (`financing_bill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financing_payments`
--

LOCK TABLES `financing_payments` WRITE;
/*!40000 ALTER TABLE `financing_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `financing_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financing_terms`
--

DROP TABLE IF EXISTS `financing_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financing_terms` (
  `term_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `label` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value_months` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `persentase_anggota` decimal(5,2) NOT NULL DEFAULT '0.00',
  `persentase_reguler` decimal(5,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`term_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financing_terms`
--

LOCK TABLES `financing_terms` WRITE;
/*!40000 ALTER TABLE `financing_terms` DISABLE KEYS */;
INSERT INTO `financing_terms` VALUES ('00f5c606-440a-449a-bfa8-073e4a03d7e5','35x Pembayaran',35,1,42.50,45.50),('05623dd9-094d-465a-9a5c-f8186baece8f','27x Pembayaran',27,1,38.50,41.50),('0a45aa8e-9489-4dc6-8f84-3b3fc5f80d9c','34x Pembayaran',34,1,42.00,45.00),('10b6b8f7-36b2-4658-8edd-0c6e63ff71e9','31x Pembayaran',31,1,40.50,43.50),('1322063c-2632-4cfd-b840-29aef51b376e','48x Pembayaran',48,1,49.00,52.00),('19c80970-2e56-4bcb-9597-62bc39373982','53x Pembayaran',53,1,51.50,54.50),('1a3e95b8-bc5c-4da6-a49c-7cf599093b42','50x Pembayaran',50,1,50.00,53.00),('1bacc845-a263-4f85-a03f-85ea315d57f6','59x Pembayaran',59,1,54.50,57.50),('201cf516-57dc-4a7c-a219-9afb4bee2d57','46x Pembayaran',46,1,48.00,51.00),('255f8bbe-d3e7-42f3-9b5e-aaef47b75ff0','4x Pembayaran',4,1,9.00,14.00),('2a603640-a989-464a-afd2-cb252007dd75','15x Pembayaran',15,1,28.00,31.00),('329512d1-5d42-4dd8-a349-7d8e87c6e448','23x Pembayaran',23,1,36.00,39.00),('36f5fcbe-6f53-4ac8-9b7d-54454c480817','26x Pembayaran',26,1,38.00,41.00),('3ed499cc-762e-49de-bb24-e8af6865070f','39x Pembayaran',39,1,44.50,47.50),('3f3b0c4f-b516-49bb-b489-08c8f3f6f04a','56x Pembayaran',56,1,53.00,56.00),('4021335d-55f0-473f-a41b-b86847f4a748','38x Pembayaran',38,1,44.00,47.00),('4200f76b-18de-472d-bc56-0ff6866eab1c','14x Pembayaran',14,1,27.00,30.00),('428e6858-39de-4655-addd-f14fd584e309','17x Pembayaran',17,1,30.00,33.00),('495aa465-3c60-4168-816b-3f073b105ad7','7x Pembayaran',7,1,15.00,20.00),('4ac06be8-ca2a-4b65-a6d8-88de9461cbe4','43x Pembayaran',43,1,46.50,49.50),('52cc7b98-caad-405a-b961-da1d22b4057d','51x Pembayaran',51,1,50.50,53.50),('54e43ae5-b2e7-4943-aef4-0fdb2958e068','37x Pembayaran',37,1,43.50,46.50),('556d1e2b-8bf9-4f92-9cf0-f95e64e04bb4','44x Pembayaran',44,1,47.00,50.00),('557308ff-c889-4614-ac98-652660e596f3','47x Pembayaran',47,1,48.50,51.50),('58d1e7d3-a943-4488-ae5a-1f095f2aeb23','3x Pembayaran',3,1,7.00,12.00),('5b62e134-de2e-463c-99fa-2393afeb6081','57x Pembayaran',57,1,53.50,56.50),('5fba6c84-5a27-41db-937e-8694a5a085aa','2x Pembayaran',2,1,5.00,10.00),('658368cf-e017-431c-9784-208872f1ba57','6x Pembayaran',6,1,13.00,18.00),('682783a3-e495-4ecd-b5c8-d7cb5527d6ee','16x Pembayaran',16,1,29.00,32.00),('68d6d4ab-591c-4c8f-b5b1-3995d2419c89','30x Pembayaran',30,1,40.00,43.00),('6c44b5a4-4ddf-47ae-a37b-29f2a7149aa1','24x Pembayaran',24,1,37.00,40.00),('6cc5ee41-8f02-4f1e-9fde-21999f64404c','60x Pembayaran',60,1,55.00,58.00),('6f050390-747b-407d-88fe-0aecea974d81','49x Pembayaran',49,1,49.50,52.50),('7c1edd72-b322-4438-aa14-4124825bb083','42x Pembayaran',42,1,46.00,49.00),('7f8599e5-5d09-4d4c-bfed-451c2128c2ab','32x Pembayaran',32,1,41.00,44.00),('86c62249-44e8-4aa4-9c47-ad4ce85a3f7a','11x Pembayaran',11,1,23.00,26.00),('86e80456-6c66-4748-af12-820c98dec1bf','12x Pembayaran',12,1,25.00,28.00),('8948d264-f2b2-4d3d-86b9-619527fd3ea2','1x Pembayaran',1,1,3.00,8.00),('8aa16cf6-ac9b-4c11-8c7a-d6754d2e2815','18x Pembayaran',18,1,31.00,34.00),('9054adc2-ae47-4a72-9b15-6427aa1d5eb2','19x Pembayaran',19,1,32.00,35.00),('9147722e-de26-4aec-8d1b-acf8ad14b48d','55x Pembayaran',55,1,52.50,55.50),('948644e5-15b4-40f9-a76d-f0daaf82a0b8','28x Pembayaran',28,1,39.00,42.00),('961913f7-7aba-40a6-9b01-6d11736f201e','9x Pembayaran',9,1,19.00,22.00),('9f69396d-f02c-433f-93af-2ac233adecbe','21x Pembayaran',21,1,34.00,37.00),('9fbb5411-6607-40b2-88f9-f7ca894e9e9d','40x Pembayaran',40,1,45.00,48.00),('a13dcd14-119e-4842-9286-e99ae48243d4','41x Pembayaran',41,1,45.50,48.50),('c5c4c4ba-9abe-4732-81d9-439b8deefa0d','10x Pembayaran',10,1,21.00,24.00),('c6101fad-600c-447c-b864-612ba9f49d4a','25x Pembayaran',25,1,37.50,40.50),('c9879ff5-ccf7-48bd-9ffb-e6858e9d97e8','20x Pembayaran',20,1,33.00,36.00),('cb0a99ba-396d-46e8-b8c7-a2a206d10068','54x Pembayaran',54,1,52.00,55.00),('d4f03d7b-209d-4851-a3a0-4e48fa2ab29e','29x Pembayaran',29,1,39.50,42.50),('e329074d-6bba-4e59-a4e2-95a3b974a690','58x Pembayaran',58,1,54.00,57.00),('e6f38629-8a26-4e85-abd1-77a6c2d51f76','45x Pembayaran',45,1,47.50,50.50),('ec9d377a-2077-40a2-86ff-bed9744d3f64','22x Pembayaran',22,1,35.00,38.00),('ecade1cc-e66c-4c78-8ad0-1847c7990fdc','33x Pembayaran',33,1,41.50,44.50),('ee25b876-40cb-4458-b275-8859cc5c0ac9','36x Pembayaran',36,1,43.00,46.00),('f00eb74b-aac2-4348-9e20-965e64112633','52x Pembayaran',52,1,51.00,54.00),('f7628844-dedc-431e-a450-071afffb13d2','8x Pembayaran',8,1,17.00,21.00),('f7e89894-5368-4f1f-ba28-2f876b9c511c','5x Pembayaran',5,1,11.00,16.00),('fe7072ae-b60f-4e06-96a9-33f3701d495d','13x Pembayaran',13,1,26.00,29.00);
/*!40000 ALTER TABLE `financing_terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forgot_password_sessions`
--

DROP TABLE IF EXISTS `forgot_password_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forgot_password_sessions` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `email_hp` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `otp_code` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `attempts` int DEFAULT '0',
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_id` (`session_id`),
  KEY `session_id_idx` (`session_id`),
  KEY `email_hp_idx` (`email_hp`),
  KEY `expires_at_idx` (`expires_at`),
  KEY `member_id_idx` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forgot_password_sessions`
--

LOCK TABLES `forgot_password_sessions` WRITE;
/*!40000 ALTER TABLE `forgot_password_sessions` DISABLE KEYS */;
INSERT INTO `forgot_password_sessions` VALUES ('0e525ed2-77e9-4641-9e4f-7b8994b14091','abdurrohman.ady33@gmail.com','131c6a07-15eb-49cf-bc67-320b64ed4d8d','308094','2026-06-28 09:25:22',0,2,'633dbe95-529e-4e42-9f09-a847c008f014','2026-06-28 09:02:21','2026-06-28 09:15:22');
/*!40000 ALTER TABLE `forgot_password_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `general_transactions`
--

DROP TABLE IF EXISTS `general_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `general_transactions` (
  `transaction_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `transaction_type` enum('PEMBELIAN','PEMBAYARAN','TOPUP','LAINNYA') COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('PENDING','APPROVED','REJECTED','COMPLETED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `general_transactions_member_id` (`member_id`),
  KEY `general_transactions_transaction_type` (`transaction_type`),
  KEY `general_transactions_status` (`status`),
  KEY `general_transactions_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `general_transactions`
--

LOCK TABLES `general_transactions` WRITE;
/*!40000 ALTER TABLE `general_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `general_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gl_accounts`
--

DROP TABLE IF EXISTS `gl_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gl_accounts` (
  `gl_account_id` bigint NOT NULL AUTO_INCREMENT,
  `account_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`gl_account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `doc_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pic_member_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`gl_journal_id`),
  KEY `fk_journal_pic_member` (`pic_member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  KEY `fk_journal_line_account` (`gl_account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `member_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `grade_label` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certificate_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`grade_id`),
  KEY `fk_grade_track` (`track_id`),
  KEY `fk_grade_member` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`installment_bill_id`),
  KEY `fk_installment_bill_purchase` (`purchase_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`dp_id`),
  KEY `fk_dp_purchase` (`purchase_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `payment_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`installment_payment_id`),
  KEY `fk_installment_payment_bill` (`installment_bill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `member_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(18,2) DEFAULT NULL,
  `dp_amount` decimal(18,2) DEFAULT NULL,
  `margin` decimal(18,2) DEFAULT NULL,
  `selling_price` decimal(18,2) DEFAULT NULL,
  `term_count` int DEFAULT NULL,
  `installment_amount` decimal(18,2) DEFAULT NULL,
  `akad_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`purchase_id`),
  KEY `fk_purchase_member` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`invoice_item_id`),
  KEY `fk_invoice_item_invoice` (`invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `invoice_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `member_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_datetime` datetime DEFAULT NULL,
  `expired_datetime` datetime DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `virtual_account_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`invoice_id`),
  KEY `fk_invoice_member` (`member_id`),
  KEY `fk_invoice_va` (`virtual_account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jual_beli_reports`
--

DROP TABLE IF EXISTS `jual_beli_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jual_beli_reports` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `year` int NOT NULL,
  `total_pokok` decimal(18,2) DEFAULT '0.00',
  `total_margin` decimal(18,2) DEFAULT '0.00',
  `total_dp` decimal(18,2) DEFAULT '0.00',
  `total_cicilan` decimal(18,2) DEFAULT '0.00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_member_year_report` (`member_id`,`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jual_beli_reports`
--

LOCK TABLES `jual_beli_reports` WRITE;
/*!40000 ALTER TABLE `jual_beli_reports` DISABLE KEYS */;
INSERT INTO `jual_beli_reports` VALUES ('f7e371fb-f867-4edd-8bb0-33ecab99ea61','0a7fd51a-6494-4202-89b6-94641b105fbb',2026,5200000.00,1036000.00,1500000.00,4736004.00,'2026-07-22 11:38:07','2026-07-22 11:38:07');
/*!40000 ALTER TABLE `jual_beli_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `landing_about`
--

DROP TABLE IF EXISTS `landing_about`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `landing_about` (
  `about_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `vision` text COLLATE utf8mb4_unicode_ci,
  `mission` text COLLATE utf8mb4_unicode_ci,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`about_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `landing_about`
--

LOCK TABLES `landing_about` WRITE;
/*!40000 ALTER TABLE `landing_about` DISABLE KEYS */;
INSERT INTO `landing_about` VALUES ('688c3c7a-fd8f-4aae-bee0-08867ad3efa7','Membangun Ekonomi Umat','Paguyuban Usaha Sukses hadir sebagai wadah koperasi modern yang berfokus pada pemberdayaan ekonomi umat.','Menjadi koperasi syariah terpercaya dalam membangun kemandirian ekonomi umat.','Memberikan layanan pembiayaan syariah yang adil dan memberdayakan usaha anggota.','2026-07-03 05:53:46','2026-07-03 05:53:46');
/*!40000 ALTER TABLE `landing_about` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `landing_contact`
--

DROP TABLE IF EXISTS `landing_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `landing_contact` (
  `contact_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `facebook_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagram_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`contact_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `landing_contact`
--

LOCK TABLES `landing_contact` WRITE;
/*!40000 ALTER TABLE `landing_contact` DISABLE KEYS */;
/*!40000 ALTER TABLE `landing_contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `landing_services`
--

DROP TABLE IF EXISTS `landing_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `landing_services` (
  `service_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_index` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `landing_services`
--

LOCK TABLES `landing_services` WRITE;
/*!40000 ALTER TABLE `landing_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `landing_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `landing_stats`
--

DROP TABLE IF EXISTS `landing_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `landing_stats` (
  `stats_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `active_members` int DEFAULT '0',
  `financed_businesses` int DEFAULT '0',
  `satisfaction_rate` int DEFAULT '0',
  `cities` int DEFAULT '0',
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`stats_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `landing_stats`
--

LOCK TABLES `landing_stats` WRITE;
/*!40000 ALTER TABLE `landing_stats` DISABLE KEYS */;
/*!40000 ALTER TABLE `landing_stats` ENABLE KEYS */;
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
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`loan_bill_id`),
  KEY `fk_loan_bill_loan` (`loan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`loan_disbursement_id`),
  KEY `fk_loan_disbursement_loan` (`loan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `payment_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`loan_payment_id`),
  KEY `fk_loan_payment_bill` (`loan_bill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `loan_product_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `loan_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `akad_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `default_term` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`loan_product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loan_products`
--

LOCK TABLES `loan_products` WRITE;
/*!40000 ALTER TABLE `loan_products` DISABLE KEYS */;
INSERT INTO `loan_products` VALUES ('b4c63888-2bb8-4066-bbcd-18aad40e3e52','Darurat',NULL,'Qardh',3,'2026-06-12 14:22:23','2026-06-12 14:22:23');
/*!40000 ALTER TABLE `loan_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_notes`
--

DROP TABLE IF EXISTS `material_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_notes` (
  `note_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `material_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `note_content` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`note_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_notes`
--

LOCK TABLES `material_notes` WRITE;
/*!40000 ALTER TABLE `material_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `material_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `material_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `curriculum_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `material_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `material_type` enum('AUDIO','VIDEO','DOCUMENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_url` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `order_index` int DEFAULT '0',
  `is_unlocked` tinyint(1) DEFAULT '0',
  `quiz_questions` json DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`material_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES ('5e6ee2be-1c93-49c6-8303-78047ce88227','06916d21-6325-4f02-82ac-150d99a80ca1','Prinsip Dasar Koperasi','DOCUMENT',NULL,'\n          <h4>Prinsip Dasar Koperasi</h4>\n          <ul>\n            <li>Keanggotaan bersifat sukarela dan terbuka.</li>\n            <li>Pengelolaan dilakukan secara demokratis.</li>\n            <li>Pembagian Sisa Hasil Usaha (SHU) dilakukan secara adil sebanding dengan besarnya jasa usaha masing-masing anggota.</li>\n            <li>Pemberian balas jasa yang terbatas terhadap modal.</li>\n            <li>Kemandirian.</li>\n          </ul>\n          <p>Prinsip-prinsip ini menjadi landasan operasional bagi setiap koperasi di Indonesia untuk memastikan kesejahteraan bersama.</p>\n        ',2,1,'[{\"id\": 1, \"options\": [\"Sama rata\", \"Berdasarkan jabatan\", \"Adil sebanding dengan jasa usaha\", \"Berdasarkan undian\"], \"question\": \"Salah satu prinsip koperasi adalah pembagian SHU yang dilakukan secara?\", \"correctAnswer\": 2}, {\"id\": 2, \"options\": [\"Otoriter\", \"Demokratis\", \"Tertutup\", \"Individual\"], \"question\": \"Pengelolaan koperasi harus dilakukan secara?\", \"correctAnswer\": 1}]','2026-06-14 09:11:45','2026-06-14 09:11:45'),('b950185c-6ea4-4df2-9d35-e8e1d832116a','06916d21-6325-4f02-82ac-150d99a80ca1','Sejarah Koperasi di Indonesia','DOCUMENT',NULL,'\n          <h4>Awal Mula Koperasi</h4>\n          <p>Koperasi di Indonesia pertama kali diperkenalkan oleh R. Aria Wiraatmadja pada tahun 1896 di Purwokerto. Beliau mendirikan sebuah Bank untuk Para Pegawai Negeri (Hulp-en Spaarbank). Beliau terdorong oleh penderitaan rakyat akibat lilitan hutang dari lintah darat.</p>\n          <h4>Perkembangan Masa Kolonial</h4>\n          <p>Pada tahun 1908, gerakan Budi Utomo memberikan dukungan bagi berdirinya koperasi. Kemudian pada tahun 1915 diterbitkan peraturan perundangan koperasi pertama oleh pemerintah kolonial Belanda, yaitu Verordening op de Cooperative Vereenigingen.</p>\n          <h4>Koperasi di Era Kemerdekaan</h4>\n          <p>Setelah kemerdekaan, peran koperasi ditegaskan dalam Pasal 33 UUD 1945. Drs. Mohammad Hatta, yang kemudian dikenal sebagai Bapak Koperasi Indonesia, memberikan perhatian yang sangat besar bagi pemberdayaan ekonomi rakyat melalui koperasi.</p>\n        ',1,1,'[{\"id\": 1, \"options\": [\"Drs. Mohammad Hatta\", \"R. Aria Wiraatmadja\", \"Raden Saleh\", \"Ki Hajar Dewantara\"], \"question\": \"Siapa tokoh yang memperkenalkan koperasi pertama kali di Indonesia pada tahun 1896?\", \"correctAnswer\": 1}, {\"id\": 2, \"options\": [\"Jakarta\", \"Bandung\", \"Purwokerto\", \"Yogyakarta\"], \"question\": \"Di kota manakah bank koperasi pertama didirikan di Indonesia?\", \"correctAnswer\": 2}, {\"id\": 3, \"options\": [\"Pasal 27\", \"Pasal 30\", \"Pasal 33\", \"Pasal 34\"], \"question\": \"Pasal berapakah dalam UUD 1945 yang menegaskan peran koperasi?\", \"correctAnswer\": 2}]','2026-06-14 09:11:45','2026-06-14 09:11:45');
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_bank_accounts`
--

DROP TABLE IF EXISTS `member_bank_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_bank_accounts` (
  `member_bank_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `bank_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_account_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_holder` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`member_bank_id`),
  KEY `member_id` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_bank_accounts`
--

LOCK TABLES `member_bank_accounts` WRITE;
/*!40000 ALTER TABLE `member_bank_accounts` DISABLE KEYS */;
INSERT INTO `member_bank_accounts` VALUES ('570faa7a-aaac-4737-af01-20c773d5888d','0a7fd51a-6494-4202-89b6-94641b105fbb','Mandiri','82728782837','Mohamad Fahmy Iqbal','2026-07-22 06:03:09','2026-07-22 06:03:09'),('9b9704f0-e6d3-452e-ac60-f1b51add71ce','df603033-5528-4dde-885f-407c1015e488','Mandiri','12389123712983','Mohamad Fahmy Iqbal','2026-07-25 01:17:08','2026-07-25 01:17:08'),('f483326e-efed-4f53-b2f7-ebc3a937b7a7','5e714c26-43e6-44a0-8a1e-def3f3290190','BSI','7654321','Avhan hadi bijaksana','2026-07-23 21:10:33','2026-07-23 21:10:33');
/*!40000 ALTER TABLE `member_bank_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_emergency_contacts`
--

DROP TABLE IF EXISTS `member_emergency_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_emergency_contacts` (
  `emergency_contact_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `contact_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`emergency_contact_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_emergency_contacts`
--

LOCK TABLES `member_emergency_contacts` WRITE;
/*!40000 ALTER TABLE `member_emergency_contacts` DISABLE KEYS */;
INSERT INTO `member_emergency_contacts` VALUES ('20a6f852-2eb8-4166-b64f-a2858c9e2b46','0a7fd51a-6494-4202-89b6-94641b105fbb','istri','23123123123123','istri','2026-07-22 06:03:09','2026-07-22 06:03:09'),('bc99f3b5-f116-4280-b68c-53ddd93dd823','df603033-5528-4dde-885f-407c1015e488','istri','231313123','idsd','2026-07-25 01:17:08','2026-07-25 01:17:08'),('ee635614-c5bf-46dd-997d-b947406280e0','5e714c26-43e6-44a0-8a1e-def3f3290190','Umi','081245674567','Istri','2026-07-23 21:10:33','2026-07-23 21:10:33');
/*!40000 ALTER TABLE `member_emergency_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_employments`
--

DROP TABLE IF EXISTS `member_employments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_employments` (
  `employment_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `occupation` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employer_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employer_address` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`employment_id`),
  KEY `member_id` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_employments`
--

LOCK TABLES `member_employments` WRITE;
/*!40000 ALTER TABLE `member_employments` DISABLE KEYS */;
INSERT INTO `member_employments` VALUES ('006a1e36-0dcc-4807-9563-d46035c1367c','0a7fd51a-6494-4202-89b6-94641b105fbb','swasta','asd','asd','2026-07-22 06:03:09','2026-07-22 06:03:09'),('34c0c5ee-66a3-4056-9af2-ab37637134a6','df603033-5528-4dde-885f-407c1015e488','sasta','ssss','adsasd','2026-07-25 01:17:08','2026-07-25 01:17:08'),('86bcd3a2-cb86-4750-9afd-e066b38c2845','5e714c26-43e6-44a0-8a1e-def3f3290190','Karyawan swasta','Unilever','Jababeka1','2026-07-23 21:10:33','2026-07-23 21:10:33');
/*!40000 ALTER TABLE `member_employments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_financial_summaries`
--

DROP TABLE IF EXISTS `member_financial_summaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_financial_summaries` (
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `simpanan_pokok` decimal(18,2) DEFAULT '0.00',
  `simpanan_wajib` decimal(18,2) DEFAULT '0.00',
  `simpanan_sukarela` decimal(18,2) DEFAULT '0.00',
  `tabungan_reguler` decimal(18,2) DEFAULT '0.00',
  `tabungan_details` json DEFAULT NULL,
  `jual_beli_total` decimal(18,2) DEFAULT '0.00',
  `jual_beli_sisa_cicilan` decimal(18,2) DEFAULT '0.00',
  `jual_beli_terbayar` decimal(18,2) DEFAULT '0.00',
  `jual_beli_belum_dibayar_count` int DEFAULT '0',
  `pinjaman_total_tagihan` decimal(18,2) DEFAULT '0.00',
  `pinjaman_nominal_kredit` decimal(18,2) DEFAULT '0.00',
  `pinjaman_nominal_cicilan` decimal(18,2) DEFAULT '0.00',
  `pinjaman_sisa_cicilan` decimal(18,2) DEFAULT '0.00',
  `pinjaman_terbayar` decimal(18,2) DEFAULT '0.00',
  `arisan_total_tagihan` decimal(18,2) DEFAULT '0.00',
  `arisan_sisa_cicilan` decimal(18,2) DEFAULT '0.00',
  `arisan_terbayar` decimal(18,2) DEFAULT '0.00',
  `arisan_diikuti_count` int DEFAULT '0',
  `total_investasi` decimal(18,2) DEFAULT '0.00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_pendanaan_syariah` decimal(18,2) DEFAULT '0.00',
  PRIMARY KEY (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_financial_summaries`
--

LOCK TABLES `member_financial_summaries` WRITE;
/*!40000 ALTER TABLE `member_financial_summaries` DISABLE KEYS */;
INSERT INTO `member_financial_summaries` VALUES ('0a7fd51a-6494-4202-89b6-94641b105fbb',500000.00,2640000.00,900000.00,0.00,'{}',6236000.00,0.00,6236004.00,0,3000000.00,3000000.00,1000000.00,0.00,3000000.00,0.00,0.00,54000000.00,1,0.00,'2026-07-22 06:04:34','2026-07-22 06:04:34',0.00),('5e714c26-43e6-44a0-8a1e-def3f3290190',0.00,0.00,0.00,0.00,'{}',0.00,0.00,0.00,0,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0,0.00,'2026-07-25 01:13:18','2026-07-25 01:13:18',0.00),('df603033-5528-4dde-885f-407c1015e488',0.00,0.00,0.00,0.00,'{}',0.00,0.00,0.00,0,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0,0.00,'2026-07-25 01:28:18','2026-07-25 01:28:18',0.00);
/*!40000 ALTER TABLE `member_financial_summaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_loans`
--

DROP TABLE IF EXISTS `member_loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_loans` (
  `loan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `product_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `loan_product_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nominal_principal` decimal(18,2) DEFAULT NULL,
  `term_count` int DEFAULT NULL,
  `installment_amount` decimal(18,2) DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disbursement_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disbursement_date` datetime DEFAULT NULL,
  `bank_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `principal_amount` decimal(18,2) DEFAULT NULL,
  `tenor_months` int DEFAULT NULL,
  `margin_amount` decimal(18,2) DEFAULT '0.00',
  `interest_rate` decimal(5,4) DEFAULT '0.0000',
  `monthly_payment` decimal(18,2) DEFAULT NULL,
  `loan_amount` decimal(18,2) DEFAULT NULL,
  `total_repayment` decimal(18,2) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`loan_id`),
  KEY `member_id` (`member_id`),
  KEY `product_id` (`product_id`),
  KEY `loan_product_id` (`loan_product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_loans`
--

LOCK TABLES `member_loans` WRITE;
/*!40000 ALTER TABLE `member_loans` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_loans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_push_subscriptions`
--

DROP TABLE IF EXISTS `member_push_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_push_subscriptions` (
  `subscription_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `endpoint` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `p256dh` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `auth` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'unknown',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`subscription_id`),
  UNIQUE KEY `unique_endpoint_idx` (`endpoint`(255)),
  KEY `member_id_idx` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_push_subscriptions`
--

LOCK TABLES `member_push_subscriptions` WRITE;
/*!40000 ALTER TABLE `member_push_subscriptions` DISABLE KEYS */;
INSERT INTO `member_push_subscriptions` VALUES ('13ab6bdb-f8ed-4b69-b592-327aaa2ec4a5','aa4c38c1-f577-48af-bf4a-3f7ab2089fea','https://wns2-pn1p.notify.windows.com/w/?token=BQYAAAA%2b2458KL5D5FDRvWcTBnNfqW%2fa5S1hMgPgJNUvtgP58mEfgjecnQIx94qye6nLyHwkuHCRY6o5AqoOyijfWT1wNJdvmWGjpvKwsPXFRQNjMkP5wNVLnsRYf0N4OoGtMXmyEmQHNAfAWtwlJUs2dJz32r3pC3nThruvFUGSQRQsGIEqfluA%2fV3MIcs726guVAvbGIywp4qJUZUuZiRMxAORajh05UhoDb5rnBKJz32EDAO5mJxOjlUGZKDIBn48nQpgveDhkT1KNs0fBguEphQc79g4YoTY5VzYC8E5aC%2fAftpcquUzzrU0T00KAxnkfJA%3d','BHVkr_O7quIh6oPiJUGXuN5jdyxXkl3RZn3lYtnjHar3y5xjFvayf3AVA9D8SIQgZGsfqh-grcLiD9_nSxwT7mM','NyEQr1HG-cb4gWhJRpHsVA','Web Browser','2026-06-28 09:38:28','2026-06-28 09:38:28'),('334b5513-da1f-4538-9caf-89d85101ce76','633dbe95-529e-4e42-9f09-a847c008f014','https://fcm.googleapis.com/fcm/send/cop43bBxN1E:APA91bHA7nRMJUxBMjMgIDqNMTaX9tBAa8NfZcmh5IM6g7eoX2cjXdBToHpYugkI2BFbnTvIxdneeUPQ_d50c3u9hyNT6K84kVM-vsaA_IYfPQqyXUC0m9MT_AQ6KpEXOzgw3yt0YbuD','BDbS5aXohhTAOi-V8B8NJAVBV72i7W10B-b1rh9mNLC8BfFKA6M7ZKeedHWgmmnghqwt-pnOryBriwJIYvc5_8Q','6rJdBpynZeQgPPk4z7DEEA','Web Browser','2026-06-17 18:57:52','2026-06-17 18:57:52'),('714a7192-1305-43c8-bae5-265295db070a','cbdc3ae9-2432-4e1f-ade9-6a39a9986445','https://fcm.googleapis.com/fcm/send/dSOs_4nL9Ng:APA91bHI139wXfL4BDb8L3dxl_Mhgva41N4id1Van9hbvePcRG3ippvZ_UBrZARuBQ3EKscNYfXd_XT-VhlE4zgyyOudtD4fVXvAW_9KXsDYxvuivaNcaOQMwDhShAerbAluTj9EjfET','BGCpLkl-K1rPo3lEj95jCF0kitWc1UYDz31sWrNeQsR5XDnqINNVpsJoz6BXNvDcAzCwQ8N2nEWRvWx6x8MrNQQ','aHWlGzbgGS56-tpU3SmpaA','Web Browser','2026-07-25 01:06:47','2026-07-25 01:06:47'),('a5574c81-bc06-41ac-bb10-068b4c4fa16c','e5e8df17-ba69-499b-8cc6-3c9b230cdd82','https://fcm.googleapis.com/fcm/send/fSdIb21EAOA:APA91bE5mk61U4C6FWwDXFaxk01UoMuB8V9LJYSlehfbvjuNIEf9955rs24vat-6dFtLOr1eTIv6JyfvhfN00pvexAd71wdblskWzzgHyX56qlkTq0_Ovn3xraK7lF9qdSiEyHY2zEH4','BPgGK1vhVtpjMEYDGIaTkrl7IbAMMTlgaPzzEZMkUYfVYzOmpJg83LV55EJXNBmFq1D4e6kJDxs_3TqbojaJpJE','IM3xSQ_G0Bi9mUNp3hfBHQ','Web Browser','2026-06-14 21:06:48','2026-06-14 21:06:48');
/*!40000 ALTER TABLE `member_push_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_registrations`
--

DROP TABLE IF EXISTS `member_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_registrations` (
  `registration_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nik_ktp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_ktp` text COLLATE utf8mb4_unicode_ci,
  `province_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `province_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `city_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `district_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subdistrict_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `subdistrict_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rt` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rw` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `member_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ktp_photo_path` text COLLATE utf8mb4_unicode_ci,
  `selfie_photo_path` text COLLATE utf8mb4_unicode_ci,
  `status_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `approval_flow_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `current_step_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `final_status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `registered_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`registration_id`),
  KEY `member_id` (`member_id`),
  KEY `status_id` (`status_id`),
  KEY `approval_flow_id` (`approval_flow_id`),
  KEY `current_step_id` (`current_step_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_registrations`
--

LOCK TABLES `member_registrations` WRITE;
/*!40000 ALTER TABLE `member_registrations` DISABLE KEYS */;
INSERT INTO `member_registrations` VALUES ('05cb7dc0-14f2-4726-9118-9d50822301e8','5e714c26-43e6-44a0-8a1e-def3f3290190','avhan hadi bijaksana','avhan.hb@gmail.com','081212341234','1234123412341234','Cikarang dan seterusnya','32','JAWA BARAT','3216','KABUPATEN BEKASI','3216061','CIKARANG UTARA','3216061010','KARANGRAHARJA','58','23','5','uploads/anggota/1234123412341234_ktp_1784815833562.jpg','uploads/anggota/1234123412341234_swafoto_1784815833571.jpg','3d2956f3-3de4-417d-bcda-b76965985a48','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01',NULL,'APPROVED','2026-07-23 21:10:33','2026-07-23 21:10:33','2026-07-25 01:13:18'),('96a41a6b-081e-488e-b339-a6de32311267','df603033-5528-4dde-885f-407c1015e488','iqbal fahmy','test001@gmail.com','081294262252','2222222222222222','saasd','15','JAMBI','1504','KABUPATEN BATANG HARI','1504030','MUARA TEMBESI','1504030003','TANJUNG MARWO','22','22','6','uploads/anggota/2222222222222222_ktp_1784917028249.jpg','uploads/anggota/2222222222222222_swafoto_1784917028264.jpg','3d2956f3-3de4-417d-bcda-b76965985a48','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01',NULL,'APPROVED','2026-07-25 01:17:08','2026-07-25 01:17:08','2026-07-25 01:28:18'),('9cdaeba3-619d-4ce4-83db-6e32c236aabb','0a7fd51a-6494-4202-89b6-94641b105fbb','iqbal fahmy','mohamadfahmyiqbal@gmail.com','081294262252','2222222222222222','Dahlia 5','32','JAWA BARAT','3216','KABUPATEN BEKASI','3216061','CIKARANG UTARA','3216061010','KARANGRAHARJA','53','22','5','uploads/anggota/2222222222222222_ktp_1784674988459.jpg','uploads/anggota/2222222222222222_swafoto_1784674988460.jpg','3d2956f3-3de4-417d-bcda-b76965985a48','5358f7d2-3bf4-42c6-a808-1aa2ce4e5a01',NULL,'APPROVED','2026-07-22 06:03:09','2026-07-22 06:03:09','2026-07-22 06:04:35');
/*!40000 ALTER TABLE `member_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_role_assignments`
--

DROP TABLE IF EXISTS `member_role_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_role_assignments` (
  `member_role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`member_role_id`),
  KEY `member_id` (`member_id`),
  KEY `role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_role_assignments`
--

LOCK TABLES `member_role_assignments` WRITE;
/*!40000 ALTER TABLE `member_role_assignments` DISABLE KEYS */;
INSERT INTO `member_role_assignments` VALUES ('081c0070-b7ef-4578-bfcc-59caa23c0aab','b0024d1f-0605-47fe-891e-156ca72ddefc','3','2026-06-11',NULL,'2026-06-11 05:19:22','2026-06-11 05:19:22'),('5c2b95c2-65e2-4145-9d68-d5e28aed0c2f','46b677e9-84bf-4bfa-b940-998d004882a1','4','2026-06-11',NULL,'2026-06-11 05:19:22','2026-06-11 05:19:22'),('c1db6bd9-1392-4240-ab93-601993598382','84f975b8-ed21-4021-b1c6-4f16933c3373','2','2026-06-11',NULL,'2026-06-11 05:19:22','2026-06-11 05:19:22');
/*!40000 ALTER TABLE `member_role_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_saving_targets`
--

DROP TABLE IF EXISTS `member_saving_targets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_saving_targets` (
  `member_saving_target_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `saving_target_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `start_period_month` int DEFAULT NULL,
  `start_period_year` int DEFAULT NULL,
  `current_balance` decimal(18,2) DEFAULT '0.00',
  `current_step_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `approval_flow_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `target_amount` decimal(18,2) DEFAULT NULL,
  `term_months` int DEFAULT NULL,
  `monthly_deposit` decimal(18,2) DEFAULT NULL,
  PRIMARY KEY (`member_saving_target_id`),
  KEY `member_id` (`member_id`),
  KEY `saving_target_id` (`saving_target_id`),
  KEY `current_step_id` (`current_step_id`),
  KEY `approval_flow_id` (`approval_flow_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `savings_account_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `savings_product_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `account_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `open_date` date DEFAULT NULL,
  `nominal` decimal(18,2) DEFAULT NULL,
  `current_balance` decimal(18,2) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`savings_account_id`),
  KEY `member_id` (`member_id`),
  KEY `savings_product_id` (`savings_product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_savings_accounts`
--

LOCK TABLES `member_savings_accounts` WRITE;
/*!40000 ALTER TABLE `member_savings_accounts` DISABLE KEYS */;
INSERT INTO `member_savings_accounts` VALUES ('3aac19f6-35ae-4445-a368-e69fbb80284f','0a7fd51a-6494-4202-89b6-94641b105fbb','b4e03a39-4e0c-4e81-8737-5c27d7444cb0','SAV-SW_POKOK-0a7fd51a','Simpanan Pokok','2026-07-21',NULL,500000.00,'2026-07-22 06:05:10','2026-07-22 06:05:10'),('8465c10e-771d-4f07-9f5f-076c23e5bab6','0a7fd51a-6494-4202-89b6-94641b105fbb','c85cff52-0439-454d-ad68-46223c254996','SAV-SS_SUKARELA-0a7fd51a','Simpanan Sukarela','2026-07-22',NULL,900000.00,'2026-07-22 06:16:34','2026-07-22 10:58:41'),('8cd9dca6-c973-4b0f-8be3-21f298fda3d0','0a7fd51a-6494-4202-89b6-94641b105fbb','e0ca2126-93f7-4577-ab5b-ce69cf95e8d0','SAV-SW_WAJIB-0a7fd51a','Simpanan Wajib','2026-07-21',NULL,2640000.00,'2026-07-22 06:05:10','2026-07-22 13:50:50');
/*!40000 ALTER TABLE `member_savings_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_status`
--

DROP TABLE IF EXISTS `member_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_status` (
  `status_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `status_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_status`
--

LOCK TABLES `member_status` WRITE;
/*!40000 ALTER TABLE `member_status` DISABLE KEYS */;
INSERT INTO `member_status` VALUES ('1','Calon Anggota'),('2','Pengawas'),('3','Ketua'),('4','Bendahara'),('5','Anggota Reguler'),('6','Anggota Luar Biasa');
/*!40000 ALTER TABLE `member_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_no` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `member_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_brith` date DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `nik_ktp` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `status_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `province_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `city_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `district_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `subdistrict_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `rt` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rw` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_registration_done` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `member_no` (`member_no`),
  KEY `status_id` (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES ('0900ac2d-4515-43c8-ae46-2bb1b27d5758','002307261033253','Budi Santoso','budi_1784777619392@test.com',NULL,'$2b$10$hAZEITYSO24bUnvCNBnowu70UaTdOZdMLetslB/tKERsqWEom8kRa','Calon Anggota',NULL,NULL,'2026-07-23',NULL,NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-23 10:33:42','2026-07-23 10:33:42',0),('0a7fd51a-6494-4202-89b6-94641b105fbb','002207260601833','mohamadfahmyiqbal','mohamadfahmyiqbal@gmail.com',NULL,'$2b$10$/K5Raeu7Ut7CLOodl47iM.mvWKjaj8mABe46qUT9M3/z02BebJVBG','Anggota Reguler',NULL,NULL,'2026-07-22','2222222222222222','Dahlia 5','5','32','3216','3216061','3216061010','53','22','2026-07-22 06:01:22','2026-07-22 13:50:43',1),('46b677e9-84bf-4bfa-b940-998d004882a1','BND-001','Ibu Bendahara','bendahara@kkpus.id','081234567803','$2b$10$MwE/diIzkYriwcNe/gPQX.KlZkgvEbAaAztiNJlgXoqThSdpZbXJK',NULL,NULL,NULL,NULL,NULL,NULL,'4',NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-11 05:19:22','2026-06-11 05:30:51',0),('4e0a7229-ead2-4d54-add6-05ca832a7815','002307261009200','Budi Santoso','budi_1784776164018@test.com',NULL,'$2b$10$aWZWg9Nr.6nwvxAoE7X.suFgJa/ZbGRw8n89jftB1JRITxrAjNcQC','Calon Anggota',NULL,NULL,'2026-07-23',NULL,NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-23 10:09:27','2026-07-23 10:09:27',0),('54520291-edd7-400a-b12a-44876c8aa5d7','002307261040417','Budi Santoso','budi_1784778049193@test.com',NULL,'$2b$10$k6M.kKmVKPErjm07trWJpOtFyiAacgHuU/Id9sXwh3pnNHQ/qO706','Calon Anggota',NULL,NULL,'2026-07-23',NULL,NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-23 10:40:52','2026-07-23 10:40:52',0),('5e714c26-43e6-44a0-8a1e-def3f3290190','002307261406651','Avhan Hadi Bijaksa a','avhan.hb@gmail.com',NULL,'$2b$10$xwlZb8gBqz808IgxB6tED.3YlaLohSDJ3/WOiLXAeCUEoqzRW6V2i','5',NULL,NULL,'2026-07-23','1234123412341234','Cikarang dan seterusnya','1','32','3216','3216061','3216061010','58','23','2026-07-23 21:06:02','2026-07-25 01:13:18',1),('7731a0b6-62b3-4235-80d7-4294957b9ab6','002307260216809','testsatu','tests001@gmail.com',NULL,'$2b$10$buhdVEjuJtp6ug7NoHhNoeGbTequPep80pmr79boaYxrTsCGhUTPi','Calon Anggota',NULL,NULL,'2026-07-23',NULL,NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-23 09:16:49','2026-07-23 09:16:49',0),('84f975b8-ed21-4021-b1c6-4f16933c3373','PNGWS-001','Bapak Pengawas','pengawas@kkpus.id','081234567801','$2b$10$.aajiNm.ZXnZ9TBrTOqU/ebMX9dkl0c3iuu14D4nC8dz1.5wQEwn2',NULL,NULL,NULL,NULL,NULL,NULL,'2',NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-11 05:19:22','2026-06-11 05:31:49',0),('b0024d1f-0605-47fe-891e-156ca72ddefc','KTU-001','Bapak Ketua','ketua@kkpus.id','081234567802','$2b$10$.aajiNm.ZXnZ9TBrTOqU/ebMX9dkl0c3iuu14D4nC8dz1.5wQEwn2',NULL,NULL,NULL,NULL,NULL,NULL,'3',NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-11 05:19:22','2026-06-11 05:31:50',0),('df603033-5528-4dde-885f-407c1015e488','002407261816568','testsatu','test001@gmail.com',NULL,'$2b$10$DNO98o3cDhZieCEc957S3eco8h8eUk7PA.CW6jN4TsSbFWGSkqAq.','6',NULL,NULL,'2026-07-24','2222222222222222','saasd','1','15','1504','1504030','1504030003','22','22','2026-07-25 01:16:00','2026-07-25 01:28:17',1);
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
  `member_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `office_location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `schedule_datetime` datetime DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`exit_request_id`),
  KEY `fk_exit_member` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membership_exit_requests`
--

LOCK TABLES `membership_exit_requests` WRITE;
/*!40000 ALTER TABLE `membership_exit_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `membership_exit_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membership_terminations`
--

DROP TABLE IF EXISTS `membership_terminations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membership_terminations` (
  `termination_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `supporting_document_path` text COLLATE utf8mb4_unicode_ci,
  `status` enum('PENDING','APPROVED','REJECTED','COMPLETED','WAITING_CONFIRMATION') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `approval_flow_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `current_step_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `receipt_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `payment_status` enum('PENDING','PAID','FAILED') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `payment_proof_path` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`termination_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membership_terminations`
--

LOCK TABLES `membership_terminations` WRITE;
/*!40000 ALTER TABLE `membership_terminations` DISABLE KEYS */;
INSERT INTO `membership_terminations` VALUES ('71485dac-543a-4a74-9468-decc51b5d1d8','0a7fd51a-6494-4202-89b6-94641b105fbb','Pengajuan dari halaman profil',NULL,'APPROVED','0c04764a-8c4c-4f79-afca-25c8530cd065',NULL,NULL,NULL,'2026-07-23 06:22:38',NULL,'2026-07-23 06:22:38','2026-07-23 09:42:52','uploads/transfers/71485dac-543a-4a74-9468-decc51b5d1d8_term_1784774572043.png');
/*!40000 ALTER TABLE `membership_terminations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `midtrans_disbursements`
--

DROP TABLE IF EXISTS `midtrans_disbursements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `midtrans_disbursements` (
  `disbursement_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `withdrawal_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `request_payload` json NOT NULL,
  `response_data` json DEFAULT NULL,
  `error_message` text COLLATE utf8mb4_unicode_ci,
  `status` enum('PENDING','SUCCESS','FAILED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `midtrans_transaction_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`disbursement_id`),
  KEY `withdrawal_id` (`withdrawal_id`),
  KEY `member_id` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `midtrans_disbursements`
--

LOCK TABLES `midtrans_disbursements` WRITE;
/*!40000 ALTER TABLE `midtrans_disbursements` DISABLE KEYS */;
/*!40000 ALTER TABLE `midtrans_disbursements` ENABLE KEYS */;
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
  `member_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note_text` text COLLATE utf8mb4_unicode_ci,
  `created_datetime` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`note_id`),
  KEY `fk_note_material` (`material_id`),
  KEY `fk_note_member` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `notification_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sent_datetime` datetime NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unread',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('00568947-491b-41eb-85d5-f4f5cfc73acd','d33889c0-4bf9-4745-909b-a9a726181785','Pembayaran Berhasil!','Setoran sebesar Rp 504.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-11 13:03:42','unread','2026-07-11 13:03:42','2026-07-11 13:03:42'),('0099d713-bcdb-4a0d-ae10-bf34c4f16757','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Anggota Baru','Abdullah telah mengirimkan data pendaftaran.','2026-06-28 09:33:59','unread','2026-06-28 09:33:59','2026-06-28 09:33:59'),('009d446b-6566-42a5-b8f2-663c9f5b088d','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari mohamadfahmyiqbal.','2026-07-22 11:35:08','unread','2026-07-22 11:35:08','2026-07-22 11:35:08'),('00e21641-5ffc-453e-8d1c-48b7c06f6f6f','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','Mohamad Fahmy Iqbal baru saja mendaftar sebagai Calon Anggota.','2026-06-19 21:43:44','read','2026-06-19 21:43:44','2026-06-28 09:06:46'),('010ae947-78a4-430e-9611-87def211cf12','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 23:16:26','unread','2026-06-27 23:16:26','2026-06-27 23:16:26'),('0173f5b6-68ad-4ecb-8777-78f4adc535cc','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 16:21:16','unread','2026-06-16 16:21:16','2026-06-16 16:21:16'),('027d9a05-53e1-4468-a713-f47d0efa326c','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-24 14:06:39','unread','2026-06-24 14:06:39','2026-06-24 14:06:39'),('02a35959-91fd-42a6-9d8d-cfe76bf76542','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-22 13:34:51','unread','2026-07-22 13:34:51','2026-07-22 13:34:51'),('02e16367-588d-45a8-9679-a1ee9f0bf4e7','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan savings withdrawal','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-22 06:21:41','unread','2026-07-22 06:21:41','2026-07-22 06:21:41'),('030f8a45-700c-47a4-8f93-2157eeb5cbc9','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-13 07:53:35','unread','2026-07-13 07:53:35','2026-07-13 07:53:35'),('038a0bb3-2380-4041-a0f7-bb43347e7fac','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-10 05:43:42','unread','2026-07-10 05:43:42','2026-07-10 05:43:42'),('0444618f-9b1d-4a93-ba48-4e74577f8cc0','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.000.000 telah diterima via sinkronisasi otomatis.','2026-06-20 22:21:55','unread','2026-06-20 22:21:55','2026-06-20 22:21:55'),('04446d99-ad4f-4989-81e5-26f70bd372fc','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Anggota Baru','Ade Sugianto telah mengirimkan data pendaftaran.','2026-06-28 09:37:28','unread','2026-06-28 09:37:28','2026-06-28 09:37:28'),('04712109-9ddb-4822-91eb-de9997ea8901','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-12 23:46:17','unread','2026-07-12 23:46:17','2026-07-12 23:46:17'),('04994485-be75-47ef-891d-e8756f2179a9','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 3 tagihan telah dibuat.','2026-06-28 01:57:51','unread','2026-06-28 01:57:51','2026-06-28 01:57:51'),('063b7610-b4cc-4693-89ee-a1750cf7d216','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','testsatu baru saja mendaftar sebagai Calon Anggota.','2026-07-25 00:29:52','unread','2026-07-25 00:29:52','2026-07-25 00:29:52'),('07148134-1113-4a1a-aa3f-a508ab957228','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Anggota Baru','Avhan Hadi Bijaksana telah mengirimkan data pendaftaran.','2026-07-12 22:40:49','unread','2026-07-12 22:40:49','2026-07-12 22:40:49'),('0714b47d-3709-4037-9876-c1255451776d','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-28 01:16:33','unread','2026-06-28 01:16:33','2026-06-28 01:16:33'),('0725795e-9254-45b9-9dd0-aabb976558d7','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testtiga.','2026-07-04 15:09:36','unread','2026-07-04 15:09:36','2026-07-04 15:09:36'),('076f7edd-dbfb-4aaa-b663-37a080dbbbf3','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','Budi Santoso baru saja mendaftar sebagai Calon Anggota.','2026-06-27 20:48:28','unread','2026-06-27 20:48:28','2026-06-27 20:48:28'),('07abb9d6-f9ba-4583-9963-c6a2a199ce6d','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 17:15:38','unread','2026-06-20 17:15:38','2026-06-20 17:15:38'),('07d4e162-da4b-4229-a3d0-2f4f16d1f590','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan member saving targets','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 06:39:15','unread','2026-06-27 06:39:15','2026-06-27 06:39:15'),('08078396-3137-4450-822d-a0b8c14ae61b','693e2950-6039-45d3-b8f6-6ed5b2983814','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 3 tagihan telah dibuat.','2026-07-21 15:58:06','unread','2026-07-21 15:58:06','2026-07-21 15:58:06'),('08247a53-85ae-48a4-b52d-f51b20d17d1e','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','Ade Sugianto baru saja mendaftar sebagai Calon Anggota.','2026-06-28 09:21:22','unread','2026-06-28 09:21:22','2026-06-28 09:21:22'),('082651f8-7e9b-46e3-862d-1ff4c478eb6b','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-10 05:28:31','unread','2026-07-10 05:28:31','2026-07-10 05:28:31'),('0831c653-5bbb-4e5d-9427-1df56ba6be87','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 19:30:11','unread','2026-06-20 19:30:11','2026-06-20 19:30:11'),('086159ae-4650-4e4a-883f-bb966ae45804','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 2.200.000 telah diterima via sinkronisasi otomatis.','2026-06-20 17:00:38','unread','2026-06-20 17:00:38','2026-06-20 17:00:38'),('086621ad-2558-4ea6-8d1f-a10b3515aa44','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:00:04','unread','2026-06-19 00:00:04','2026-06-19 00:00:04'),('08993bfa-8ade-4cee-aff1-f0134616deb9','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 23:16:09','unread','2026-06-27 23:16:09','2026-06-27 23:16:09'),('08aced1d-c2c3-4769-be1f-76a4c64da5a8','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 13:34:36','unread','2026-06-28 13:34:36','2026-06-28 13:34:36'),('08af6db4-9f8d-41df-ad58-8132d2c25ee4','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-10 05:44:24','unread','2026-07-10 05:44:24','2026-07-10 05:44:24'),('0938a377-d337-4f20-bfc5-2e1d89516571','8c6f7722-c817-40c7-ba80-982b224f08c2','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 11:25:18','unread','2026-06-28 11:25:18','2026-06-28 11:25:18'),('093dea8a-d863-4fba-8ed2-584d081c6372','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:28:23','unread','2026-06-18 23:28:23','2026-06-18 23:28:23'),('09677e89-59f7-4bb1-8c7a-ee9f17e132c4','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan Tabungan Berhasil','Pengajuan Tabungan Qurban senilai Rp 4.800.000 telah diproses.','2026-06-27 23:36:07','unread','2026-06-27 23:36:07','2026-06-27 23:36:07'),('0989918e-9848-41af-8cd1-64f154085175','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan savings withdrawal','Langkah \"Pencairan Bendahara\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 10:51:27','unread','2026-06-28 10:51:27','2026-06-28 10:51:27'),('0a0ce4be-a8b6-4d3b-82ad-e3cd6746c2f3','df603033-5528-4dde-885f-407c1015e488','Pendaftaran Berhasil','Data Anda sedang diverifikasi.','2026-07-25 01:17:08','unread','2026-07-25 01:17:08','2026-07-25 01:17:08'),('0a216fd8-42ee-4fd5-829e-1b295ccd3a46','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Pembiayaan','Pengajuan Darurat (Pinjaman Darurat) senilai Rp 3.000.000 telah berhasil dikirim.','2026-06-20 21:35:15','unread','2026-06-20 21:35:15','2026-06-20 21:35:15'),('0a4b817e-c11f-4184-8a6e-518c0f7f74f6','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-12 23:48:39','unread','2026-07-12 23:48:39','2026-07-12 23:48:39'),('0a956140-4dfb-4b1e-9dec-cf0d568d7575','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari hendrik saepudin.','2026-06-28 11:36:24','unread','2026-06-28 11:36:24','2026-06-28 11:36:24'),('0adbbff6-3f04-4064-849e-2803bed9382a','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan savings withdrawal','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-10 05:24:42','unread','2026-07-10 05:24:42','2026-07-10 05:24:42'),('0b5a873f-2c0e-4344-a149-5e4f6907b911','8c6f7722-c817-40c7-ba80-982b224f08c2','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 11:36:28','unread','2026-06-28 11:36:28','2026-06-28 11:36:28'),('0b6b9b54-45b9-46a6-a321-cf9ba17779c0','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-27 22:26:34','unread','2026-06-27 22:26:34','2026-06-27 22:26:34'),('0b75d5c4-cce9-43a1-a70d-deb4c59eec19','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembayaran Berhasil!','Setoran sebesar Rp 700.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-18 21:36:35','unread','2026-06-18 21:36:35','2026-06-18 21:36:35'),('0bb1d9be-f9ef-4195-aa54-b2012824e039','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-28 14:00:32','unread','2026-06-28 14:00:32','2026-06-28 14:00:32'),('0bf73a87-e27d-4368-9646-c9d0cbe27355','8bd8e1a5-ec5b-4963-922c-9a5c724fb906','Arisan Disetujui!','Selamat! Pengajuan arisan Anda telah disetujui. Silahkan cek tagihan untuk setoran pertama.','2026-06-28 14:04:09','unread','2026-06-28 14:04:09','2026-06-28 14:04:09'),('0c186b38-538d-4bd9-9b64-4ff572ae3e62','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari avhanhb.','2026-07-13 07:47:44','unread','2026-07-13 07:47:44','2026-07-13 07:47:44'),('0c1ca8a5-2af3-4281-8c1f-27e25639286d','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 22:30:27','unread','2026-06-18 22:30:27','2026-06-18 22:30:27'),('0c2d06cf-70e2-4af2-8fcd-481d9e594806','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Ade Sugianto.','2026-06-28 11:03:26','unread','2026-06-28 11:03:26','2026-06-28 11:03:26'),('0c35acb5-0edc-4f45-b580-5c7efc7b5f97','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','Septiawan Wijaya Kusuma baru saja mendaftar sebagai Calon Anggota.','2026-07-15 12:35:23','unread','2026-07-15 12:35:23','2026-07-15 12:35:23'),('0cdb0ed6-6ff8-4afa-94bc-82e92912516e','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari mohamadfahmyiqbal.','2026-07-22 13:24:02','unread','2026-07-22 13:24:02','2026-07-22 13:24:02'),('0ce712fe-da15-4efd-87ed-3c8138d90bfd','d7570642-5cd5-4403-8085-66bb3927b76b','Pengajuan financing applications Ditolak','Pengajuan ditolak. Alasan: karena batch sudah terisi penuh','2026-06-28 14:05:41','unread','2026-06-28 14:05:41','2026-06-28 14:05:41'),('0d23de5e-9556-4d1d-a6da-465e50a3949c','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 23:51:46','unread','2026-06-27 23:51:46','2026-06-27 23:51:46'),('0d522512-6935-4222-9097-7a3e5bb7fb33','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 01:02:05','unread','2026-06-28 01:02:05','2026-06-28 01:02:05'),('0dab59b6-9993-414f-af42-f44d9d34f48a','6c16df4e-6d44-45c4-b02b-05f022fdf1df','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-27 15:45:09','unread','2026-06-27 15:45:09','2026-06-27 15:45:09'),('0e00730a-b4e7-4e7a-b613-cb2addf37af2','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 3.928.000 telah diterima via sinkronisasi otomatis.','2026-06-20 19:23:12','unread','2026-06-20 19:23:12','2026-06-20 19:23:12'),('0e317325-ba8f-415b-a8cc-718fee7cdbec','f98594e5-d43c-4acb-8052-b108c36c79cc','Pemesanan Sukuk Disetujui','Pemesanan sukuk Anda telah disetujui sepenuhnya oleh seluruh pengurus.','2026-06-28 00:03:59','unread','2026-06-28 00:03:59','2026-06-28 00:03:59'),('0e8b1a60-c740-4561-a443-0b443f633d20','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testDua.','2026-07-20 10:55:56','unread','2026-07-20 10:55:56','2026-07-20 10:55:56'),('0ee6a596-8276-40e0-9692-79ca99febb7e','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:14:03','unread','2026-06-18 23:14:03','2026-06-18 23:14:03'),('0f197242-423b-4b6d-8131-8a81772540f1','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan savings withdrawal','Langkah \"Pencairan Bendahara\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 21:05:36','unread','2026-06-27 21:05:36','2026-06-27 21:05:36'),('0f58d216-e966-4d5d-984a-599ae48f4877','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembayaran Berhasil!','Setoran sebesar Rp 1.400.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 23:18:18','unread','2026-06-27 23:18:18','2026-06-27 23:18:18'),('0fa74cdc-d386-48c7-b103-7a03890a409a','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: Ade Sugianto','2026-06-28 09:37:27','read','2026-06-28 09:37:27','2026-06-28 10:48:23'),('0fd8d296-1226-4516-9e06-f24e0536ea99','693e2950-6039-45d3-b8f6-6ed5b2983814','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-21 15:58:06','unread','2026-07-21 15:58:06','2026-07-21 15:58:06'),('1032b959-8121-4239-a0b9-11999022cb53','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan exit requests','Langkah \"Verifikasi Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-23 09:38:17','unread','2026-07-23 09:38:17','2026-07-23 09:38:17'),('1072ab55-cce9-4320-998d-be664109d0ad','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 200.000 telah diterima via sinkronisasi otomatis.','2026-06-20 00:27:05','unread','2026-06-20 00:27:05','2026-06-20 00:27:05'),('10beb237-1d3b-4933-ad61-8f3740af8750','8c00e514-663c-4f3d-97ff-8520273d923e','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-20 10:43:48','unread','2026-07-20 10:43:48','2026-07-20 10:43:48'),('10dd61ca-ca05-4f89-b21a-23bc5d52ea18','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:39:56','unread','2026-06-18 23:39:56','2026-06-18 23:39:56'),('1121fb0d-34ea-453d-b8ba-3a84dd9dde06','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan member saving targets','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 18:06:51','unread','2026-06-27 18:06:51','2026-06-27 18:06:51'),('1127f4c7-7a6c-405a-a855-a3cef13323d7','f98594e5-d43c-4acb-8052-b108c36c79cc','Pendaftaran Berhasil','Data Anda sedang diverifikasi.','2026-06-18 21:35:23','unread','2026-06-18 21:35:23','2026-06-18 21:35:23'),('11427bf1-1cef-40fc-aa9e-4334760842b9','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-27 14:53:31','unread','2026-06-27 14:53:31','2026-06-27 14:53:31'),('11f1d9c3-babb-4cb5-8a6d-f3c3f3861717','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 16:38:52','unread','2026-06-16 16:38:52','2026-06-16 16:38:52'),('1203a868-71c3-4d8f-b570-172fe4a21b2b','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','Abdullah baru saja mendaftar sebagai Calon Anggota.','2026-06-28 09:11:45','read','2026-06-28 09:11:45','2026-06-28 10:48:23'),('124dfa3b-b776-41d0-89ce-2e5aeab0420f','d7570642-5cd5-4403-8085-66bb3927b76b','Pengajuan Pembiayaan','Pengajuan Darurat (Pinjaman Darurat) senilai Rp 3.000.000 telah berhasil dikirim.','2026-06-28 11:34:19','unread','2026-06-28 11:34:19','2026-06-28 11:34:19'),('126dbfcb-e0aa-4812-9578-023235a766d8','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 500.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 00:02:32','unread','2026-06-28 00:02:32','2026-06-28 00:02:32'),('1290f1cf-3c13-4dbb-b5ec-bf83b31e58c6','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 724.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-22 06:05:10','unread','2026-07-22 06:05:10','2026-07-22 06:05:10'),('13446ce9-ec3a-4777-86e3-90540518427b','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari Mohamad Fahmy Iqbal.','2026-06-28 10:48:17','unread','2026-06-28 10:48:17','2026-06-28 10:48:17'),('136ef50b-5a4b-47de-9db7-08b07b6eed50','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Pembiayaan','Pengajuan Pendanaan Syariah UMKM (sd) senilai Rp 5.000.000 telah berhasil dikirim.','2026-06-27 15:41:25','unread','2026-06-27 15:41:25','2026-06-27 15:41:25'),('1386f54a-e3df-49eb-b87d-f342e4dd4eca','d7570642-5cd5-4403-8085-66bb3927b76b','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 11:02:48','unread','2026-06-28 11:02:48','2026-06-28 11:02:48'),('14078ec0-7b74-4f09-8592-8ec8183c590c','d33889c0-4bf9-4745-909b-a9a726181785','Pembayaran Berhasil!','Setoran sebesar Rp 5.004.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-11 09:22:10','unread','2026-07-11 09:22:10','2026-07-11 09:22:10'),('14691eb2-e703-4cc6-812c-bbc89a73b5c1','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari avhanhb.','2026-07-12 23:29:25','unread','2026-07-12 23:29:25','2026-07-12 23:29:25'),('1474645a-a67c-4328-b3a9-40efcd6ff261','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-28 01:00:15','unread','2026-06-28 01:00:15','2026-06-28 01:00:15'),('14824e66-3f78-4b14-bf84-794857287cce','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan member saving targets Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-27 06:39:23','unread','2026-06-27 06:39:23','2026-06-27 06:39:23'),('149d1574-e254-45b8-b1e3-c12fa2e7eeeb','0a7fd51a-6494-4202-89b6-94641b105fbb','Dana Berhenti Keanggotaan Telah Ditransfer!','Pencairan dana telah dilakukan oleh Bendahara. Silakan konfirmasi penerimaan dana untuk menyelesaikan proses berhenti keanggotaan.','2026-07-23 09:42:52','unread','2026-07-23 09:42:52','2026-07-23 09:42:52'),('14a60921-e2e8-4dc3-8468-47d7283b8b98','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan tabungan withdrawals','Langkah \"Pencairan\" disetujui. Menunggu verifikasi berikutnya.','2026-07-11 13:09:44','unread','2026-07-11 13:09:44','2026-07-11 13:09:44'),('14d57cc9-9846-4ee6-ad71-9247509e31cf','5880c3cd-d403-40dd-997b-319629799cab','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 12 tagihan telah dibuat.','2026-06-27 14:53:31','unread','2026-06-27 14:53:31','2026-06-27 14:53:31'),('14e6dea6-a222-4265-adac-b4325bafd3b1','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-27 23:16:47','unread','2026-06-27 23:16:47','2026-06-27 23:16:47'),('1540ec95-04cd-4684-b5a3-2482780967a0','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testtiga.','2026-07-04 14:35:28','unread','2026-07-04 14:35:28','2026-07-04 14:35:28'),('1575c455-aa33-425f-9fde-82d5d17595cd','0a7fd51a-6494-4202-89b6-94641b105fbb','Pengajuan exit requests Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-23 09:42:52','unread','2026-07-23 09:42:52','2026-07-23 09:42:52'),('15c6ade8-afb1-4b4d-9fcf-26ce43b83218','d7570642-5cd5-4403-8085-66bb3927b76b','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 11:36:24','unread','2026-06-28 11:36:24','2026-06-28 11:36:24'),('161e611b-e9e1-4288-b467-af43441fda25','d7570642-5cd5-4403-8085-66bb3927b76b','Pembayaran Berhasil!','Setoran sebesar Rp 2.000.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 12:54:36','unread','2026-06-28 12:54:36','2026-06-28 12:54:36'),('164d9860-361b-4d1a-a6ae-e2a5c504e139','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 16:18:33','unread','2026-06-16 16:18:33','2026-06-16 16:18:33'),('16a39340-cb65-4908-9881-767fcd987111','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 00:47:05','unread','2026-06-20 00:47:05','2026-06-20 00:47:05'),('16b014a2-3b8e-4a43-b70f-ea9085fe45b7','d33889c0-4bf9-4745-909b-a9a726181785','Penarikan Disetujui!','Penarikan sebesar Rp 6.000.000 telah disetujui dan sedang diproses.','2026-07-11 13:09:44','unread','2026-07-11 13:09:44','2026-07-11 13:09:44'),('16de470d-ad39-4da8-89ef-163e8f687600','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan Sukuk','Langkah persetujuan oleh Ketua telah berhasil. Menunggu verifikasi lainnya.','2026-06-27 17:47:15','unread','2026-06-27 17:47:15','2026-06-27 17:47:15'),('16f073aa-f135-4a1d-be3f-e50568435384','8c00e514-663c-4f3d-97ff-8520273d923e','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-20 10:48:07','unread','2026-07-20 10:48:07','2026-07-20 10:48:07'),('17297e8b-8b42-4538-858a-7d1005520469','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan savings withdrawal','Langkah \"Pencairan Bendahara\" disetujui. Menunggu verifikasi berikutnya.','2026-07-04 18:22:17','unread','2026-07-04 18:22:17','2026-07-04 18:22:17'),('1799dc77-3bfd-4bc6-93c0-d5220894cffc','8c6f7722-c817-40c7-ba80-982b224f08c2','Update Persetujuan savings withdrawal','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 10:30:25','unread','2026-06-28 10:30:25','2026-06-28 10:30:25'),('181bd5bc-b1ff-4119-9f9a-95e3ce5e1be9','d33889c0-4bf9-4745-909b-a9a726181785','Pembayaran Berhasil!','Setoran sebesar Rp 4.036.004 telah diterima via sinkronisasi otomatis.','2026-07-10 05:45:19','unread','2026-07-10 05:45:19','2026-07-10 05:45:19'),('1827fb61-18cc-4f34-9252-9aca5ba55af5','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pengajuan Tabungan Disetujui!','Pengajuan Tabungan Anda telah disetujui.','2026-07-13 07:53:15','unread','2026-07-13 07:53:15','2026-07-13 07:53:15'),('1846f459-5b63-4d27-985a-88237d587916','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','avhan hadi bijaksana telah mengirimkan data pendaftaran.','2026-07-23 21:10:33','unread','2026-07-23 21:10:33','2026-07-23 21:10:33'),('18794128-0a39-4197-bde8-aae5172cb286','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 54.004.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-12 23:50:34','unread','2026-07-12 23:50:34','2026-07-12 23:50:34'),('1899bd4c-337d-4b09-b9f0-6de450be96f0','0a7fd51a-6494-4202-89b6-94641b105fbb','Arisan Disetujui!','Selamat! Pengajuan arisan Anda telah disetujui. Silahkan cek tagihan untuk setoran pertama.','2026-07-22 13:45:42','unread','2026-07-22 13:45:42','2026-07-22 13:45:42'),('190436f0-ade0-491a-805b-452dddd0d283','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Ade Sugianto.','2026-06-28 14:01:08','unread','2026-06-28 14:01:08','2026-06-28 14:01:08'),('1915ea71-ae45-4b4f-9614-cb32e0936e12','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari testsatu.','2026-06-16 14:06:11','unread','2026-06-16 14:06:11','2026-06-16 14:06:11'),('195464b5-c29c-48c6-9395-733652e22825','693e2950-6039-45d3-b8f6-6ed5b2983814','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-21 16:13:47','unread','2026-07-21 16:13:47','2026-07-21 16:13:47'),('197da960-03a2-47df-85c6-3f285e479e1e','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 16:59:24','unread','2026-06-20 16:59:24','2026-06-20 16:59:24'),('199fc2ac-37d9-47a8-ba9f-865b1416b176','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 23:59:23','unread','2026-06-20 23:59:23','2026-06-20 23:59:23'),('1a2d540c-f567-4fe4-9336-e78ce8956003','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 16:38:35','unread','2026-06-16 16:38:35','2026-06-16 16:38:35'),('1aa60bc0-ae66-432b-a1e5-e29ba28ba4f8','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan tabungan withdrawals','Langkah \"Pencairan\" disetujui. Menunggu verifikasi berikutnya.','2026-07-11 11:41:14','unread','2026-07-11 11:41:14','2026-07-11 11:41:14'),('1ab766d9-a6bc-4eb7-a59c-7bbf7ef9308a','d7570642-5cd5-4403-8085-66bb3927b76b','Pengajuan Pembiayaan','Pengajuan Pelunasan Jual Beli (Pelunasan molis omoway) senilai Rp 19.627.200 telah berhasil dikirim.','2026-06-28 11:17:04','unread','2026-06-28 11:17:04','2026-06-28 11:17:04'),('1abd398d-0dcc-41ab-b000-b2cc8fa2706a','8c00e514-663c-4f3d-97ff-8520273d923e','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 13 tagihan telah dibuat.','2026-07-20 10:45:07','unread','2026-07-20 10:45:07','2026-07-20 10:45:07'),('1aea0206-877e-4a0c-b1e3-5a4d3b508122','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan tabungan withdrawals','Menunggu verifikasi Anda: Pengajuan tabungan withdrawals dari testtiga.','2026-07-11 11:34:28','unread','2026-07-11 11:34:28','2026-07-11 11:34:28'),('1b52c46d-443e-4040-8bf6-27da40ddb85a','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','testsatu baru saja mendaftar sebagai Calon Anggota.','2026-07-23 09:16:50','unread','2026-07-23 09:16:50','2026-07-23 09:16:50'),('1bd379ec-4465-42ad-9385-0665d06b43e4','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-12 23:44:51','unread','2026-07-12 23:44:51','2026-07-12 23:44:51'),('1c62116c-51c2-432a-bd17-d235fa84ef90','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari Mohamad Fahmy Iqbal.','2026-06-27 06:38:59','unread','2026-06-27 06:38:59','2026-06-27 06:38:59'),('1c7bdc00-791a-4588-a69c-a826fd2be548','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari avhanhb.','2026-07-13 07:48:02','unread','2026-07-13 07:48:02','2026-07-13 07:48:02'),('1c8e181d-e6f4-41be-be3d-4431134d9117','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan savings withdrawal','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 00:28:49','unread','2026-06-20 00:28:49','2026-06-20 00:28:49'),('1c961582-5dff-460e-8293-514a6a6c88f2','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 16:44:49','unread','2026-06-16 16:44:49','2026-06-16 16:44:49'),('1ccadbcd-8918-4625-b4ea-4695f3e81858','d33889c0-4bf9-4745-909b-a9a726181785','Pembayaran Berhasil!','Setoran sebesar Rp 3.004.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-10 05:56:00','unread','2026-07-10 05:56:00','2026-07-10 05:56:00'),('1d4c9fc1-796d-40fa-89d4-1d462f000bb5','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan member saving targets','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 06:03:30','unread','2026-06-27 06:03:30','2026-06-27 06:03:30'),('1d712d31-ca0a-4d43-95e4-80a9ba8105b9','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 19:30:11','unread','2026-06-20 19:30:11','2026-06-20 19:30:11'),('1dbae911-b741-4617-9d0d-d4408db30d6a','693e2950-6039-45d3-b8f6-6ed5b2983814','Pendaftaran Berhasil','Data Anda sedang diverifikasi.','2026-07-21 15:06:32','unread','2026-07-21 15:06:32','2026-07-21 15:06:32'),('1e1acbb0-3e10-4d78-a0b7-94baebc10309','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-27 23:17:25','unread','2026-06-27 23:17:25','2026-06-27 23:17:25'),('1e2d9f0f-d0aa-4bfa-9c4b-6746eb78d7b7','df603033-5528-4dde-885f-407c1015e488','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-25 01:28:19','unread','2026-07-25 01:28:19','2026-07-25 01:28:19'),('1e2e2753-b6d4-43ec-9db2-080921af7ce3','8c00e514-663c-4f3d-97ff-8520273d923e','Pembayaran Berhasil!','Setoran sebesar Rp 3.004.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-20 12:06:05','unread','2026-07-20 12:06:05','2026-07-20 12:06:05'),('1e71ef32-cdc8-4761-92aa-bc58be870754','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testtiga.','2026-07-04 14:02:59','unread','2026-07-04 14:02:59','2026-07-04 14:02:59'),('1ee3d9cb-4b40-40fa-a686-5e754cd9be23','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testDua.','2026-07-20 10:44:26','unread','2026-07-20 10:44:26','2026-07-20 10:44:26'),('1ee7ab1f-c7a1-470f-a68d-fad06887b7c6','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari Ade Sugianto.','2026-06-28 10:30:51','unread','2026-06-28 10:30:51','2026-06-28 10:30:51'),('1f0bc08e-11a3-4f0e-b740-007345e057c9','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 17:16:02','unread','2026-06-20 17:16:02','2026-06-20 17:16:02'),('1f2704f1-4544-4cbd-bb2f-27e580afcac4','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 16:43:18','unread','2026-06-16 16:43:18','2026-06-16 16:43:18'),('2047d941-8af5-428d-8f9a-2689dd0825a9','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','testsatu baru saja mendaftar sebagai Calon Anggota.','2026-07-25 00:29:52','unread','2026-07-25 00:29:52','2026-07-25 00:29:52'),('20517501-cf71-4b3f-9076-c321a9c3f6c7','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-27 23:17:36','unread','2026-06-27 23:17:36','2026-06-27 23:17:36'),('2078ced8-dd16-4e60-aed8-ed9bf3509d0e','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 12:58:29','unread','2026-06-28 12:58:29','2026-06-28 12:58:29'),('20d595f9-16f7-4d23-8d3e-f64bd9be53dd','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: iqbal fahmy','2026-07-25 00:40:16','unread','2026-07-25 00:40:16','2026-07-25 00:40:16'),('20e84642-ac50-4229-92a9-af12809033d2','693e2950-6039-45d3-b8f6-6ed5b2983814','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-21 15:57:00','unread','2026-07-21 15:57:00','2026-07-21 15:57:00'),('2124636a-cc1c-4fa0-bff3-668fb7787fb8','8c6f7722-c817-40c7-ba80-982b224f08c2','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 11:26:54','unread','2026-06-28 11:26:54','2026-06-28 11:26:54'),('216e417e-5806-4320-a0b1-be45dc3623ba','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-24 14:06:40','unread','2026-06-24 14:06:40','2026-06-24 14:06:40'),('21e89975-8154-403a-be57-3c23e708efdf','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari Mohamad Fahmy Iqbal.','2026-06-19 22:18:18','unread','2026-06-19 22:18:18','2026-06-19 22:18:18'),('220acd28-151a-4c94-9145-4a29a05af546','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-27 22:18:44','unread','2026-06-27 22:18:44','2026-06-27 22:18:44'),('22b8db4f-186c-4f7d-b4aa-155dc75110f3','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 220.000 telah diterima via sinkronisasi otomatis.','2026-07-22 06:12:44','unread','2026-07-22 06:12:44','2026-07-22 06:12:44'),('22c51ec1-d0ab-4794-9ae6-1863b95122c5','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-27 17:01:44','unread','2026-06-27 17:01:44','2026-06-27 17:01:44'),('22f3f79f-109d-4b1a-9be9-9cc67ebe3e21','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 640.000 telah diterima via sinkronisasi otomatis.','2026-06-20 00:49:22','unread','2026-06-20 00:49:22','2026-06-20 00:49:22'),('23757f42-b5c5-471e-81c2-9684fe527682','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari Mohamad Fahmy Iqbal.','2026-06-20 00:29:01','unread','2026-06-20 00:29:01','2026-06-20 00:29:01'),('23887e74-4719-46fa-bbf2-5400bac9eef8','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan member saving targets Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-27 23:38:28','unread','2026-06-27 23:38:28','2026-06-27 23:38:28'),('24125fda-4fa2-40e9-be4c-ef8012aaa453','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 16:50:56','unread','2026-06-20 16:50:56','2026-06-20 16:50:56'),('24157f0a-8e89-4c18-b638-ae148423efb1','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testsatu.','2026-06-16 11:59:06','unread','2026-06-16 11:59:06','2026-06-16 11:59:06'),('24c39de8-2826-4e9b-bdb5-4d529150e09f','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan savings withdrawal','Langkah \"Pencairan Bendahara\" disetujui. Menunggu verifikasi berikutnya.','2026-07-10 05:25:12','unread','2026-07-10 05:25:12','2026-07-10 05:25:12'),('25086b95-b3d1-4b38-97c5-186bd515337e','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 19:22:13','unread','2026-06-20 19:22:13','2026-06-20 19:22:13'),('25133256-9740-4b80-838b-a1c48ba5fdcd','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: iqbal fahmy','2026-07-25 01:17:08','unread','2026-07-25 01:17:08','2026-07-25 01:17:08'),('258f791e-8aaf-4b66-95be-c45e29f8f064','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari Budi Santoso.','2026-06-27 23:39:36','unread','2026-06-27 23:39:36','2026-06-27 23:39:36'),('25b683c7-429d-448f-aa0e-23ef9da9dcae','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testsatu.','2026-06-16 12:50:44','unread','2026-06-16 12:50:44','2026-06-16 12:50:44'),('25c11a27-173c-48e2-9848-10d6d77163a0','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pengajuan Pembiayaan','Pengajuan Kendaraan (byd) senilai Rp 700.000.000 telah berhasil dikirim.','2026-07-13 07:36:28','unread','2026-07-13 07:36:28','2026-07-13 07:36:28'),('25cb6265-685c-48ff-a0da-ef1f274e5bfd','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','Avhan Hadi Bijaksa a baru saja mendaftar sebagai Calon Anggota.','2026-07-23 21:06:03','unread','2026-07-23 21:06:03','2026-07-23 21:06:03'),('25d2e405-9ea5-432c-b73d-f7d53ec01004','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-18 21:36:09','unread','2026-06-18 21:36:09','2026-06-18 21:36:09'),('262e882c-9ef9-4eca-a903-7f77a7f80ad2','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Ade Sugianto.','2026-06-28 14:03:16','unread','2026-06-28 14:03:16','2026-06-28 14:03:16'),('267dbe2a-9708-4ba7-b544-6ab4bd5b8e92','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pengajuan Arisan','Pengajuan bergabung grup arisan Arisan umrah  (batch 6) berhasil dikirim dan sedang menunggu persetujuan.','2026-07-12 23:44:21','unread','2026-07-12 23:44:21','2026-07-12 23:44:21'),('26c98740-ed16-4dea-ab98-9bba66a5ca1d','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-28 00:19:54','unread','2026-06-28 00:19:54','2026-06-28 00:19:54'),('26e3714f-cbe8-405a-b1ec-cbf7256ee096','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 17:54:20','unread','2026-06-20 17:54:20','2026-06-20 17:54:20'),('27c8efa0-d0a3-42e5-8a79-a5fda367116e','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 18:00:29','unread','2026-06-20 18:00:29','2026-06-20 18:00:29'),('27d2f418-0c42-4e67-9982-99a67c0871a5','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan savings withdrawal','Langkah \"Pencairan Bendahara\" disetujui. Menunggu verifikasi berikutnya.','2026-07-22 06:24:59','unread','2026-07-22 06:24:59','2026-07-22 06:24:59'),('27f20953-379b-46ef-a0bb-0348a67a51c0','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 21:35:40','unread','2026-06-20 21:35:40','2026-06-20 21:35:40'),('28a99e4d-0b9f-4c93-9d64-ab4058ad32b4','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pembayaran Berhasil!','Setoran sebesar Rp 4.940.000 telah diterima via sinkronisasi otomatis.','2026-07-12 23:48:58','unread','2026-07-12 23:48:58','2026-07-12 23:48:58'),('28d2ddde-10d3-4194-ade2-f9130d5ac444','8c00e514-663c-4f3d-97ff-8520273d923e','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-20 10:44:25','unread','2026-07-20 10:44:25','2026-07-20 10:44:25'),('297e2b7c-3fc7-4ad9-a4cd-545a4d7295e9','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-04 15:11:58','unread','2026-07-04 15:11:58','2026-07-04 15:11:58'),('29aa267e-430f-4d29-b02f-5e08265db079','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:42:41','unread','2026-06-18 23:42:41','2026-06-18 23:42:41'),('29d3e909-cb13-420a-8b92-194106101046','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembayaran Berhasil!','Setoran sebesar Rp 373.334 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 00:14:15','unread','2026-06-28 00:14:15','2026-06-28 00:14:15'),('2a304b14-40bd-45df-a8dd-b604a5bcfed3','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:10:35','unread','2026-06-19 00:10:35','2026-06-19 00:10:35'),('2a349f43-10de-41dc-b929-f0a1d5f4bc59','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Ade Sugianto.','2026-06-28 11:35:13','unread','2026-06-28 11:35:13','2026-06-28 11:35:13'),('2a36ad09-0077-4c01-8280-1d9d3658773a','d33889c0-4bf9-4745-909b-a9a726181785','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 3 tagihan telah dibuat.','2026-07-10 06:00:20','unread','2026-07-10 06:00:20','2026-07-10 06:00:20'),('2a4ae293-8128-49cf-9d49-3dc0a340ed82','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:21:24','unread','2026-06-18 23:21:24','2026-06-18 23:21:24'),('2a4b1b0d-71d6-4b08-a217-8a111f70db16','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan member saving targets','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-11 13:02:23','unread','2026-07-11 13:02:23','2026-07-11 13:02:23'),('2a609299-c333-479a-8673-425e4d5e48cc','8c00e514-663c-4f3d-97ff-8520273d923e','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-19 08:15:47','unread','2026-07-19 08:15:47','2026-07-19 08:15:47'),('2ac4d831-015a-4f0d-bb81-7b9b2f9ddc82','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pemesanan Sukuk Disetujui','Pemesanan sukuk Anda telah disetujui sepenuhnya oleh seluruh pengurus.','2026-07-13 07:52:59','unread','2026-07-13 07:52:59','2026-07-13 07:52:59'),('2b2ea2ab-59bf-473a-b12a-f47247a2d27d','8bd8e1a5-ec5b-4963-922c-9a5c724fb906','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 14:03:00','unread','2026-06-28 14:03:00','2026-06-28 14:03:00'),('2b5dd455-26e3-4997-87b3-0b1f4a259dfd','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 17:39:37','unread','2026-06-20 17:39:37','2026-06-20 17:39:37'),('2bffa526-dbbd-4962-a73d-eb3306810f4d','8c6f7722-c817-40c7-ba80-982b224f08c2','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 11:35:57','unread','2026-06-28 11:35:57','2026-06-28 11:35:57'),('2c5f614f-2d5d-448b-b1e1-6706936a5cdc','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari avhanhb.','2026-07-12 22:51:41','unread','2026-07-12 22:51:41','2026-07-12 22:51:41'),('2c99fa52-5136-4f48-9f9c-ea9639a168bf','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembayaran Berhasil!','Setoran sebesar Rp 500.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 10:22:37','unread','2026-06-28 10:22:37','2026-06-28 10:22:37'),('2c9a5565-6119-4ef1-82c0-59535587dc1b','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Pembiayaan','Pengajuan Pendanaan Syariah UMKM (tambah modal) senilai Rp 20.000.000 telah berhasil dikirim.','2026-06-28 14:42:45','unread','2026-06-28 14:42:45','2026-06-28 14:42:45'),('2cd9b5b2-def4-4c25-a3dd-6d12741a2687','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','iqbal fahmy telah mengirimkan data pendaftaran.','2026-07-22 06:03:10','unread','2026-07-22 06:03:10','2026-07-22 06:03:10'),('2d46b9b3-aea1-440e-aa44-81c346810d15','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','testsatu baru saja mendaftar sebagai Calon Anggota.','2026-07-25 01:16:00','unread','2026-07-25 01:16:00','2026-07-25 01:16:00'),('2d64a578-3d12-43e2-94f5-fa8c466a35b3','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','avhanhb baru saja mendaftar sebagai Calon Anggota.','2026-07-12 22:35:34','unread','2026-07-12 22:35:34','2026-07-12 22:35:34'),('2d7d49db-182f-4e83-81ca-d49002f37322','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 16:59:40','unread','2026-06-20 16:59:40','2026-06-20 16:59:40'),('2e966dd6-24c3-47e8-87d1-eb77c14086ec','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 50.000 telah diterima via sinkronisasi otomatis.','2026-07-22 06:16:36','unread','2026-07-22 06:16:36','2026-07-22 06:16:36'),('2e97a097-6dbd-43a6-a2ae-7b72d58ea1fe','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan savings withdrawal','Langkah \"Pencairan Bendahara\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 21:28:37','unread','2026-06-27 21:28:37','2026-06-27 21:28:37'),('2eae5c02-ef86-4263-8531-7d9bf1e085fe','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testtiga.','2026-07-04 14:43:31','unread','2026-07-04 14:43:31','2026-07-04 14:43:31'),('2eca3b6e-f787-4933-9304-4399443157ee','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 00:20:39','unread','2026-06-28 00:20:39','2026-06-28 00:20:39'),('2ee7b1d3-5923-4d1e-98d6-3d1d7f2089d2','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','Budi Santoso baru saja mendaftar sebagai Calon Anggota.','2026-07-23 10:40:52','unread','2026-07-23 10:40:52','2026-07-23 10:40:52'),('2f0b8855-7ef6-4f5b-899c-a53e375c81c6','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari Mohamad Fahmy Iqbal.','2026-06-27 23:37:16','unread','2026-06-27 23:37:16','2026-06-27 23:37:16'),('2f1bfc7b-2219-40ab-bcdb-0bc5ffbadb84','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-27 22:51:08','unread','2026-06-27 22:51:08','2026-06-27 22:51:08'),('2f20f23b-98bf-41d7-8c1e-2755d499379c','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan savings withdrawal','Langkah \"Pencairan Bendahara\" disetujui. Menunggu verifikasi berikutnya.','2026-07-22 10:42:30','unread','2026-07-22 10:42:30','2026-07-22 10:42:30'),('2f3127f8-d4f6-4581-980c-2c9f09714e96','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 16.800.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 23:24:36','unread','2026-06-27 23:24:36','2026-06-27 23:24:36'),('2fbd4937-4206-4721-95c8-fe454a398c5b','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:04:08','unread','2026-06-18 23:04:08','2026-06-18 23:04:08'),('2fe86e10-001f-4a16-857f-88429b1fd02f','f22655cd-851a-4dfc-913f-f27dc21327c0','Selamat Datang!','Halo Septiawan Wijaya Kusuma, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-07-15 12:35:23','unread','2026-07-15 12:35:23','2026-07-15 12:35:23'),('3001e860-acef-4398-8276-d4fb9ca5c42b','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','TestDua baru saja mendaftar sebagai Calon Anggota.','2026-07-20 16:35:57','unread','2026-07-20 16:35:57','2026-07-20 16:35:57'),('3019cadb-4f75-4159-b1bb-603111bc9d16','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testtiga.','2026-07-04 14:30:27','unread','2026-07-04 14:30:27','2026-07-04 14:30:27'),('3093e1c1-56f2-40e9-8d06-01868a25b6f5','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Pembiayaan','Pengajuan Pendanaan Syariah UMKM (asdasd) senilai Rp 5.000.000 telah berhasil dikirim.','2026-06-27 14:46:03','unread','2026-06-27 14:46:03','2026-06-27 14:46:03'),('317b5ae9-49ed-4f65-95de-c6149b109a8f','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testtiga.','2026-07-10 05:43:43','unread','2026-07-10 05:43:43','2026-07-10 05:43:43'),('31938d1a-8350-4b43-a4ec-dd0bbc386e28','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan Tabungan Berhasil','Pengajuan Tabungan Qurban senilai Rp 4.800.000 telah diproses.','2026-06-27 23:36:46','unread','2026-06-27 23:36:46','2026-06-27 23:36:46'),('31e48c99-e6c1-443c-8f2e-3a0e5b080608','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 15:42:03','unread','2026-06-16 15:42:03','2026-06-16 15:42:03'),('31f33a5d-1f85-41c6-8329-1f9b641ea08f','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-10 06:00:22','unread','2026-07-10 06:00:22','2026-07-10 06:00:22'),('323e648d-db7f-4326-a06c-6527233395b9','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-07-20 16:15:55','unread','2026-07-20 16:15:55','2026-07-20 16:15:55'),('324aa2b9-6937-4c5f-abf8-3ae3149133ec','693e2950-6039-45d3-b8f6-6ed5b2983814','Pembayaran Berhasil!','Setoran sebesar Rp 54.004.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-21 16:16:07','unread','2026-07-21 16:16:07','2026-07-21 16:16:07'),('327319c6-9f38-457e-86d6-2df21999f09b','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-10 05:37:03','unread','2026-07-10 05:37:03','2026-07-10 05:37:03'),('328bc69b-978e-4d49-b2fd-0870c74101a8','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan tabungan withdrawals','Langkah \"Verifikasi\" disetujui. Menunggu verifikasi berikutnya.','2026-07-11 13:08:56','unread','2026-07-11 13:08:56','2026-07-11 13:08:56'),('32cab2a4-cdaa-4d50-ac26-50f09ec7bc7f','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','Mohamad Fahmy Iqbal telah mengirimkan data pendaftaran.','2026-06-19 22:12:10','unread','2026-06-19 22:12:10','2026-06-19 22:12:10'),('32e76245-caf5-4d29-bec5-0dfc10e4ebab','693e2950-6039-45d3-b8f6-6ed5b2983814','Update Persetujuan Sukuk','Langkah persetujuan oleh Pengawas telah berhasil. Menunggu verifikasi lainnya.','2026-07-21 16:20:06','unread','2026-07-21 16:20:06','2026-07-21 16:20:06'),('330c3030-8569-4963-8a9d-183746ec8dd2','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 16:34:53','unread','2026-06-16 16:34:53','2026-06-16 16:34:53'),('338035a6-1856-4131-8df9-6ed75efa6581','8c00e514-663c-4f3d-97ff-8520273d923e','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-20 10:48:43','unread','2026-07-20 10:48:43','2026-07-20 10:48:43'),('33af42f4-ac32-4f5b-9b7b-f8f78782074a','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: avhan hadi bijaksana','2026-07-23 21:10:33','unread','2026-07-23 21:10:33','2026-07-23 21:10:33'),('33bc9cd3-46a7-483f-84a1-52e59b31fe18','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 16:58:53','unread','2026-06-20 16:58:53','2026-06-20 16:58:53'),('33cc821b-ae4e-4d87-8394-9abaab51936c','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testtiga.','2026-07-04 14:53:20','unread','2026-07-04 14:53:20','2026-07-04 14:53:20'),('33fb1cd9-f9d8-4318-ab41-523da1f88882','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testsatu.','2026-06-16 11:37:27','unread','2026-06-16 11:37:27','2026-06-16 11:37:27'),('3427873f-2ae1-43a0-9cc1-17a830d32636','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 13:34:53','unread','2026-06-28 13:34:53','2026-06-28 13:34:53'),('344ff8e6-22cc-4d9d-b14a-2f11c410cc3f','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-22 13:24:41','unread','2026-07-22 13:24:41','2026-07-22 13:24:41'),('3488deb5-afcb-4d63-ba4b-dd61d2ccce76','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','testDua baru saja mendaftar sebagai Calon Anggota.','2026-06-19 21:42:27','unread','2026-06-19 21:42:27','2026-06-19 21:42:27'),('349e040e-40bb-4898-946e-beb4b79ac0de','d7570642-5cd5-4403-8085-66bb3927b76b','Pembayaran Berhasil!','Setoran sebesar Rp 20.084.800 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 11:16:14','unread','2026-06-28 11:16:14','2026-06-28 11:16:14'),('3545845b-20bf-42da-9d6d-2779b557ec66','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembayaran Berhasil!','Setoran sebesar Rp 2.100.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 14:08:57','unread','2026-06-28 14:08:57','2026-06-28 14:08:57'),('36618b05-48e4-45e3-b234-e053e1a1a18c','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari avhanhb.','2026-07-12 23:44:51','unread','2026-07-12 23:44:51','2026-07-12 23:44:51'),('3700dbf5-d355-4026-af59-effe5320187d','8c6f7722-c817-40c7-ba80-982b224f08c2','Penarikan Disetujui!','Penarikan sebesar Rp 300.000 telah disetujui dan sedang diproses.','2026-06-28 10:32:33','unread','2026-06-28 10:32:33','2026-06-28 10:32:33'),('372c70d4-4fb7-4684-b0b6-61dd5f560763','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-28 00:12:55','unread','2026-06-28 00:12:55','2026-06-28 00:12:55'),('374ea570-84fc-4e58-85d1-e79b2c47af97','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan Pembiayaan','Pengajuan Darurat (Pinjaman Darurat) senilai Rp 3.000.000 telah berhasil dikirim.','2026-06-28 01:15:53','unread','2026-06-28 01:15:53','2026-06-28 01:15:53'),('375c1e09-c410-44ca-89b4-c50c616ac1ef','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari Avhan Hadi Bijaksa a.','2026-07-23 21:50:30','unread','2026-07-23 21:50:30','2026-07-23 21:50:30'),('37aab553-7b8b-443b-a49a-b9746f311442','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 19:22:24','unread','2026-06-20 19:22:24','2026-06-20 19:22:24'),('37caf34d-782e-4618-879e-2a4551b421c1','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 01:00:26','unread','2026-06-28 01:00:26','2026-06-28 01:00:26'),('37d67cdf-01de-483c-962a-994885996f71','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari avhanhb.','2026-07-12 23:31:25','unread','2026-07-12 23:31:25','2026-07-12 23:31:25'),('37ecbf8b-81a5-43ee-89ef-417cb63c74f2','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 00:19:32','unread','2026-06-28 00:19:32','2026-06-28 00:19:32'),('37efad2e-d0d7-4125-8b75-0589247a8500','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:12:58','unread','2026-06-18 23:12:58','2026-06-18 23:12:58'),('38d1a5ba-4510-48ac-828e-637f62d103d5','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 22:26:01','unread','2026-06-27 22:26:01','2026-06-27 22:26:01'),('3962641b-20d8-4334-804a-b18ae80dbc7a','d7570642-5cd5-4403-8085-66bb3927b76b','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 11:36:37','unread','2026-06-28 11:36:37','2026-06-28 11:36:37'),('398b3881-e166-467d-b832-467104d746e4','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan member saving targets','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 23:37:49','unread','2026-06-27 23:37:49','2026-06-27 23:37:49'),('398da088-5f20-4fe7-8187-db17ad55e29f','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 16:42:35','unread','2026-06-27 16:42:35','2026-06-27 16:42:35'),('39f4c6a9-f7db-44c0-aef8-b182f15f4fd5','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-12 23:31:49','unread','2026-07-12 23:31:49','2026-07-12 23:31:49'),('3a06eb55-8cb8-48ea-a2ff-e16e7aba4fa2','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 16:50:27','unread','2026-06-20 16:50:27','2026-06-20 16:50:27'),('3a6d7b0c-1a3b-495e-a9c4-761ebd9f9788','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testtiga.','2026-07-10 05:36:33','unread','2026-07-10 05:36:33','2026-07-10 05:36:33'),('3aa5f863-f5da-4697-994b-ef6244abeefc','693e2950-6039-45d3-b8f6-6ed5b2983814','Pembayaran Berhasil!','Setoran sebesar Rp 724.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-21 15:22:11','unread','2026-07-21 15:22:11','2026-07-21 15:22:11'),('3b03b7c3-1ca4-430a-84e9-6b48a0d91bec','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 01:26:05','unread','2026-06-28 01:26:05','2026-06-28 01:26:05'),('3b11deba-bdad-49b1-b3e1-c88353bd81c4','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 3.000.000 telah diterima via sinkronisasi otomatis.','2026-07-22 13:29:44','unread','2026-07-22 13:29:44','2026-07-22 13:29:44'),('3b1722e5-c858-4fc1-b878-bbbf668f18ba','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Anggota Baru','Hendrik Saepudin telah mengirimkan data pendaftaran.','2026-06-28 09:18:16','unread','2026-06-28 09:18:16','2026-06-28 09:18:16'),('3b41c90e-6c26-438f-93b6-edcc39283a22','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-07-20 16:15:25','unread','2026-07-20 16:15:25','2026-07-20 16:15:25'),('3bb2e90f-afb6-49d7-a285-d698eb7b48d0','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-27 22:19:35','unread','2026-06-27 22:19:35','2026-06-27 22:19:35'),('3be7683b-49af-4540-a007-7c26dbcf9268','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembayaran Berhasil!','Setoran sebesar Rp 23.100.000 telah diterima via sinkronisasi otomatis.','2026-06-28 14:19:08','unread','2026-06-28 14:19:08','2026-06-28 14:19:08'),('3bebc8ff-18d7-420a-be06-a998db3dbe0c','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 14:51:09','unread','2026-06-16 14:51:09','2026-06-16 14:51:09'),('3c0a3fc0-0452-47bd-8ba0-e108cefa9329','7731a0b6-62b3-4235-80d7-4294957b9ab6','Selamat Datang!','Halo testsatu, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-07-23 09:16:50','unread','2026-07-23 09:16:50','2026-07-23 09:16:50'),('3c4897b2-1d64-4af0-a229-c6807bac4e40','d7570642-5cd5-4403-8085-66bb3927b76b','Pengajuan Arisan','Pengajuan bergabung grup arisan Arisan Umrah (7) berhasil dikirim dan sedang menunggu persetujuan.','2026-06-28 14:07:19','unread','2026-06-28 14:07:19','2026-06-28 14:07:19'),('3c653320-414c-4063-9e8f-762b2d3b2c16','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan Tabungan Disetujui!','Pengajuan Tabungan Anda telah disetujui.','2026-07-11 13:03:09','unread','2026-07-11 13:03:09','2026-07-11 13:03:09'),('3c6d6c37-bfd5-4899-954b-6edba3bc3f03','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-27 22:42:02','unread','2026-06-27 22:42:02','2026-06-27 22:42:02'),('3caaf85b-5a4d-4649-93c1-53102312b30c','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Ade Sugianto.','2026-06-28 11:26:54','unread','2026-06-28 11:26:54','2026-06-28 11:26:54'),('3da82322-7e2c-4dca-ac0a-1cfbd5c02f24','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan savings withdrawal','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-22 10:46:59','unread','2026-07-22 10:46:59','2026-07-22 10:46:59'),('3df87974-1b6e-4cfd-882a-a483ae4cdfec','8c6f7722-c817-40c7-ba80-982b224f08c2','Update Persetujuan savings withdrawal','Langkah \"Pencairan Bendahara\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 10:32:33','unread','2026-06-28 10:32:33','2026-06-28 10:32:33'),('3e13903d-ce01-4d1c-8d60-bb0766e2354f','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 14:21:02','unread','2026-06-28 14:21:02','2026-06-28 14:21:02'),('3e69dc12-a6b9-4bee-ac93-e1df123e53ee','5e714c26-43e6-44a0-8a1e-def3f3290190','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-23 21:50:30','unread','2026-07-23 21:50:30','2026-07-23 21:50:30'),('3e8abf9b-72ed-42b9-a82d-ae1fedbd19e2','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan tabungan withdrawals','Langkah \"Persetujuan\" disetujui. Menunggu verifikasi berikutnya.','2026-07-11 11:34:28','unread','2026-07-11 11:34:28','2026-07-11 11:34:28'),('3e963ddf-fcbc-4cb0-afe3-4723c1295091','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembayaran Berhasil!','Setoran sebesar Rp 373.334 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 00:17:39','unread','2026-06-28 00:17:39','2026-06-28 00:17:39'),('3ed66127-367c-4568-99ae-f475191f8484','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari testtiga.','2026-07-11 09:06:44','unread','2026-07-11 09:06:44','2026-07-11 09:06:44'),('3ef95fda-19ee-47c9-9e12-c089c4d2e545','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 23:59:23','unread','2026-06-20 23:59:23','2026-06-20 23:59:23'),('3f24779b-cc58-4dd8-aaf9-a83639f6b65f','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 16:18:44','unread','2026-06-16 16:18:44','2026-06-16 16:18:44'),('3fbd9cd6-d1b1-407e-b70c-ce354ecdf5a6','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:05:35','unread','2026-06-19 00:05:35','2026-06-19 00:05:35'),('3fdd74e3-ca44-4506-8453-9968d125e7b3','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 14:53:23','unread','2026-06-27 14:53:23','2026-06-27 14:53:23'),('3ff35b58-fa93-44d0-95ed-b0202ab32075','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-10 05:28:08','unread','2026-07-10 05:28:08','2026-07-10 05:28:08'),('400dc0fe-3337-497a-911e-1f49708ce9cb','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:04:00','unread','2026-06-19 00:04:00','2026-06-19 00:04:00'),('4016051d-d6a8-437f-815b-f401434f078a','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 16 tagihan telah dibuat.','2026-06-28 11:07:59','unread','2026-06-28 11:07:59','2026-06-28 11:07:59'),('4035c3a6-af6f-45f5-839b-7b21ea2fc92e','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testsatu.','2026-06-16 12:57:19','unread','2026-06-16 12:57:19','2026-06-16 12:57:19'),('4146e178-0498-4296-91a4-3b27cfe968ad','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-27 23:54:13','unread','2026-06-27 23:54:13','2026-06-27 23:54:13'),('414cadc4-2517-4873-80ed-3103cdc761a8','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari testtiga.','2026-07-04 17:56:51','unread','2026-07-04 17:56:51','2026-07-04 17:56:51'),('41743b98-6e64-4794-9b15-e7be28a99c2e','d33889c0-4bf9-4745-909b-a9a726181785','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 3 tagihan telah dibuat.','2026-07-10 05:54:00','unread','2026-07-10 05:54:00','2026-07-10 05:54:00'),('41b05fd4-27b3-43f4-9a3f-c9a9ff5f160e','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-27 16:41:16','unread','2026-06-27 16:41:16','2026-06-27 16:41:16'),('41cc0f84-b8f8-4404-88ae-53075435207a','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembayaran Berhasil!','Setoran sebesar Rp 4.309.334 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 22:14:41','unread','2026-06-27 22:14:41','2026-06-27 22:14:41'),('41daef90-12f5-4111-bb60-47c52b10e49c','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: Avhan Hadi Bijaksana','2026-07-12 22:40:48','unread','2026-07-12 22:40:48','2026-07-12 22:40:48'),('422743d3-ee58-4b7b-bb17-520808b759b8','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-07-12 23:49:04','unread','2026-07-12 23:49:04','2026-07-12 23:49:04'),('422824e0-954f-4d7e-ae67-359c9f3e39fa','8bd8e1a5-ec5b-4963-922c-9a5c724fb906','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 09:52:55','read','2026-06-28 09:52:55','2026-06-28 09:58:30'),('4245664c-0423-4ae3-b675-d26bd84d93e7','8c6f7722-c817-40c7-ba80-982b224f08c2','Pengajuan Arisan','Pengajuan bergabung grup arisan Arisan Umrah 2 (9) berhasil dikirim dan sedang menunggu persetujuan.','2026-06-28 13:59:19','unread','2026-06-28 13:59:19','2026-06-28 13:59:19'),('42bdac46-eba5-4f79-8d9c-fe3db2065985','8c00e514-663c-4f3d-97ff-8520273d923e','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-20 10:55:55','unread','2026-07-20 10:55:55','2026-07-20 10:55:55'),('43841f63-c409-47ef-814a-038dd9299049','5880c3cd-d403-40dd-997b-319629799cab','Penarikan Disetujui!','Penarikan sebesar Rp 50.000 telah disetujui dan sedang diproses.','2026-06-20 00:29:39','unread','2026-06-20 00:29:39','2026-06-20 00:29:39'),('441366cc-b945-48d0-8a99-e95d7389c725','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: Hendrik Saepudin','2026-06-28 09:18:15','read','2026-06-28 09:18:15','2026-06-28 10:48:23'),('4490207e-b413-478c-8e3d-e1ad7736acda','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pembayaran Berhasil!','Setoran sebesar Rp 51.484.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-12 23:49:57','unread','2026-07-12 23:49:57','2026-07-12 23:49:57'),('44e012cc-7c0d-4824-b2e1-139d3d0b542e','693e2950-6039-45d3-b8f6-6ed5b2983814','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-21 15:11:55','unread','2026-07-21 15:11:55','2026-07-21 15:11:55'),('452fafe8-f26a-46f9-ab1c-54abdc0ccbef','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','Abdullah baru saja mendaftar sebagai Calon Anggota.','2026-06-28 09:11:45','unread','2026-06-28 09:11:45','2026-06-28 09:11:45'),('454472fc-2db2-4263-aafa-6863f9c231ee','d7570642-5cd5-4403-8085-66bb3927b76b','Pembayaran Berhasil!','Setoran sebesar Rp 19.027.200 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 11:23:08','unread','2026-06-28 11:23:08','2026-06-28 11:23:08'),('45776ddb-d804-41c6-b550-9e2ab1c665c5','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pembayaran Berhasil!','Setoran sebesar Rp 1.004.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-12 23:34:40','unread','2026-07-12 23:34:40','2026-07-12 23:34:40'),('458d40c4-c25e-4bc2-9472-cafff499dec9','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari Mohamad Fahmy Iqbal.','2026-06-27 23:37:59','unread','2026-06-27 23:37:59','2026-06-27 23:37:59'),('45c567a0-8ab2-4c1f-aadd-ec051d8d3d3b','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan member saving targets','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 06:38:59','unread','2026-06-27 06:38:59','2026-06-27 06:38:59'),('45dd8397-07af-40b3-86dc-9f7068e2ab6b','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari Mohamad Fahmy Iqbal.','2026-06-27 06:03:47','unread','2026-06-27 06:03:47','2026-06-27 06:03:47'),('45e3d2f3-9a8a-475d-b60b-1f32e1f8de49','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 17:44:51','unread','2026-06-20 17:44:51','2026-06-20 17:44:51'),('45f26985-7522-4806-bcf8-eba6d85a33af','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:31:22','unread','2026-06-18 23:31:22','2026-06-18 23:31:22'),('4625a383-a317-4d7b-9f3c-abdec9e2c682','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan Tabungan Berhasil','Pengajuan Tabungan Qurban senilai Rp 6.000.000 telah diproses.','2026-07-11 08:59:28','unread','2026-07-11 08:59:28','2026-07-11 08:59:28'),('464c404a-4cdd-4716-8a1d-cd04b8bd6944','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Anggota Baru','Mohamad Fahmy Iqbal  telah mengirimkan data pendaftaran.','2026-07-21 15:06:33','unread','2026-07-21 15:06:33','2026-07-21 15:06:33'),('469087b8-518a-47e9-9306-9ca7f5f126b5','8c00e514-663c-4f3d-97ff-8520273d923e','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-20 11:11:04','unread','2026-07-20 11:11:04','2026-07-20 11:11:04'),('46d503d0-ac7c-4624-b4e2-17d99a82b8f6','8c00e514-663c-4f3d-97ff-8520273d923e','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-19 08:14:29','unread','2026-07-19 08:14:29','2026-07-19 08:14:29'),('46ebee00-604c-4384-a985-aa6ceae2d46a','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 21:35:29','unread','2026-06-20 21:35:29','2026-06-20 21:35:29'),('47031d91-a7b8-4676-87f2-c8c4658c293f','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-27 23:51:46','unread','2026-06-27 23:51:46','2026-06-27 23:51:46'),('47153470-96ad-4031-b220-a06502279347','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan member saving targets','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 23:37:59','unread','2026-06-27 23:37:59','2026-06-27 23:37:59'),('47847016-50c0-4af1-9927-e6c1f0e80fac','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 54.884.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-22 13:50:51','unread','2026-07-22 13:50:51','2026-07-22 13:50:51'),('4821f7c5-3ef1-4cc7-a7ec-e853068b142d','d33889c0-4bf9-4745-909b-a9a726181785','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 0 tagihan telah dibuat.','2026-07-10 05:37:35','unread','2026-07-10 05:37:35','2026-07-10 05:37:35'),('484fc18b-49be-4c81-aa9c-a5a17a5d0570','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-28 14:43:25','unread','2026-06-28 14:43:25','2026-06-28 14:43:25'),('48a34863-4449-4e5e-898e-e18032a5edbc','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 504.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-22 06:18:31','unread','2026-07-22 06:18:31','2026-07-22 06:18:31'),('48b8636d-b367-4c31-9355-1a75c00f92f8','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','testsatu baru saja mendaftar sebagai Calon Anggota.','2026-06-16 11:35:02','unread','2026-06-16 11:35:02','2026-06-16 11:35:02'),('48dec2d6-a3f1-4f33-8d52-4a07884176a6','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari TestDua.','2026-07-21 16:12:58','unread','2026-07-21 16:12:58','2026-07-21 16:12:58'),('48f4b71d-d4ab-4424-9b20-e8d6107adc08','633dbe95-529e-4e42-9f09-a847c008f014','Selamat Datang!','Halo Ade Sugianto, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-06-17 18:56:46','unread','2026-06-17 18:56:46','2026-06-17 18:56:46'),('48fda0d5-20c0-4c5c-a806-311e0f89b746','ba11bf65-152a-4d87-b950-401fafabc2ff','Selamat Datang!','Halo mohamadfahmyiqbal, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-07-22 05:59:07','unread','2026-07-22 05:59:07','2026-07-22 05:59:07'),('49063010-aa8c-4e65-926c-eb82a6eb9600','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan exit requests','Menunggu verifikasi Anda: Pengajuan exit requests dari mohamadfahmyiqbal.','2026-07-23 09:38:18','unread','2026-07-23 09:38:18','2026-07-23 09:38:18'),('4950594f-1518-48c1-bbdf-4bc3100d0489','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan member saving targets Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-27 06:04:21','unread','2026-06-27 06:04:21','2026-06-27 06:04:21'),('49559255-bd44-4723-b70d-9a24242970fc','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 224.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-22 06:07:41','unread','2026-07-22 06:07:41','2026-07-22 06:07:41'),('49b12762-9fdf-4db9-bb61-4554d22a87b2','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-22 06:03:57','unread','2026-07-22 06:03:57','2026-07-22 06:03:57'),('49b60a90-f659-4b8d-88c9-01213be53abc','8c6f7722-c817-40c7-ba80-982b224f08c2','Update Persetujuan savings withdrawal','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 10:30:51','unread','2026-06-28 10:30:51','2026-06-28 10:30:51'),('4a2d39df-ab26-4d31-9b0b-0085c727a22e','d7570642-5cd5-4403-8085-66bb3927b76b','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 09:58:01','unread','2026-06-28 09:58:01','2026-06-28 09:58:01'),('4a64d5dc-5a33-4ee6-95b0-558d2e4c9591','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-27 23:16:09','unread','2026-06-27 23:16:09','2026-06-27 23:16:09'),('4ac2b7ad-f04a-4d80-8e84-7bde2887bcbd','693e2950-6039-45d3-b8f6-6ed5b2983814','Pembayaran Berhasil!','Setoran sebesar Rp 504.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-21 15:23:04','unread','2026-07-21 15:23:04','2026-07-21 15:23:04'),('4b391111-c908-4ba2-adc0-31b91822da79','0a7fd51a-6494-4202-89b6-94641b105fbb','Pengajuan Pembiayaan','Pengajuan Darurat (Pinjaman Darurat) senilai Rp 3.000.000 telah berhasil dikirim.','2026-07-22 13:17:33','unread','2026-07-22 13:17:33','2026-07-22 13:17:33'),('4b8b7259-16ad-41d1-a330-1a54b51d1625','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.000.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-20 17:40:22','unread','2026-06-20 17:40:22','2026-06-20 17:40:22'),('4be00360-d885-4084-8d40-b74d17462fd5','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','Avhan Hadi Bijaksana telah mengirimkan data pendaftaran.','2026-07-12 22:40:48','unread','2026-07-12 22:40:48','2026-07-12 22:40:48'),('4c66a68c-ad16-466e-aeff-29594c08bc30','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:22:25','unread','2026-06-19 00:22:25','2026-06-19 00:22:25'),('4c914654-de54-4b08-8ae0-f7b9dae48980','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 17:01:54','unread','2026-06-27 17:01:54','2026-06-27 17:01:54'),('4c9253c5-0c6b-471e-a4f6-5f59841478aa','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 22:58:22','unread','2026-06-18 22:58:22','2026-06-18 22:58:22'),('4caf4ea2-2f9f-40b6-bdd7-b0e685b91538','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-27 23:16:26','unread','2026-06-27 23:16:26','2026-06-27 23:16:26'),('4cc1f558-c1e9-4a2d-b608-a26bb6031fa2','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari hendrik saepudin.','2026-06-28 11:02:08','unread','2026-06-28 11:02:08','2026-06-28 11:02:08'),('4d8fbf43-a63c-490b-9a53-53bd978d16fa','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:52:37','unread','2026-06-18 23:52:37','2026-06-18 23:52:37'),('4eb9460a-e2b1-4cb3-846a-70f82a674cb2','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-22 13:40:31','unread','2026-07-22 13:40:31','2026-07-22 13:40:31'),('4ec282af-b66d-4443-b228-ad841ac9a4fe','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','testDua baru saja mendaftar sebagai Calon Anggota.','2026-06-19 21:42:27','unread','2026-06-19 21:42:27','2026-06-19 21:42:27'),('4ecbf610-9a9e-4b2f-a152-8c6b0ec2fe87','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:42:21','unread','2026-06-18 23:42:21','2026-06-18 23:42:21'),('4eefa7d7-58ac-43e3-81d3-f6b5990896e2','8c6f7722-c817-40c7-ba80-982b224f08c2','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 10:07:52','unread','2026-06-28 10:07:52','2026-06-28 10:07:52'),('4fe98ca5-bc98-47fa-855b-aecc43033840','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembayaran Berhasil!','Setoran sebesar Rp 5.000.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 00:04:30','unread','2026-06-28 00:04:30','2026-06-28 00:04:30'),('50134ce0-ddfd-4dee-bd96-c44a565d22c3','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 3.000.000 telah diterima via sinkronisasi otomatis.','2026-07-22 13:29:45','unread','2026-07-22 13:29:45','2026-07-22 13:29:45'),('509d850b-bc7e-4bbd-8d40-4c87dd7caa7f','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 14:00:32','unread','2026-06-28 14:00:32','2026-06-28 14:00:32'),('513c4aa0-4045-4643-8ca1-55458537dcf9','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testDua.','2026-07-20 10:48:08','unread','2026-07-20 10:48:08','2026-07-20 10:48:08'),('515aa153-e6aa-43bf-9130-242942bd8d10','6c16df4e-6d44-45c4-b02b-05f022fdf1df','Pembayaran Berhasil!','Setoran sebesar Rp 700.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 15:45:59','unread','2026-06-27 15:45:59','2026-06-27 15:45:59'),('518d95a3-622e-4ca6-9bca-730ee12a80b8','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan savings withdrawal','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-22 07:44:24','unread','2026-07-22 07:44:24','2026-07-22 07:44:24'),('51a475ed-350d-4942-bdea-9ac403990a1e','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan member saving targets','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 06:03:47','unread','2026-06-27 06:03:47','2026-06-27 06:03:47'),('51dbcd49-7f2c-437e-9aa4-c49208dd8d0c','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Anggota Baru','iqbal fahmy telah mengirimkan data pendaftaran.','2026-07-22 06:03:10','unread','2026-07-22 06:03:10','2026-07-22 06:03:10'),('525b4705-f967-4e49-95b2-d9687253e610','f98594e5-d43c-4acb-8052-b108c36c79cc','Penarikan Disetujui!','Penarikan sebesar Rp 200.000 telah disetujui dan sedang diproses.','2026-06-27 21:05:36','unread','2026-06-27 21:05:36','2026-06-27 21:05:36'),('527eded8-363c-4adf-999b-9455a24ab854','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan Sukuk','Langkah persetujuan oleh Pengawas telah berhasil. Menunggu verifikasi lainnya.','2026-06-28 00:02:58','unread','2026-06-28 00:02:58','2026-06-28 00:02:58'),('52af1f5a-d117-43a0-b7fd-c0dc7e2b4cc2','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari avhanhb.','2026-07-13 07:44:18','unread','2026-07-13 07:44:18','2026-07-13 07:44:18'),('52b8351c-a651-49e4-825c-7f0edd014e5a','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','iqbal fahmy telah mengirimkan data pendaftaran.','2026-07-25 00:40:17','unread','2026-07-25 00:40:17','2026-07-25 00:40:17'),('531cb0fa-cb5d-4f9b-8d50-47bfff2d0b5e','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 14.170.444 telah diterima. Keanggotaan Anda kini aktif.','2026-07-20 16:17:32','unread','2026-07-20 16:17:32','2026-07-20 16:17:32'),('53912b65-40f2-43e6-be11-ddd9d1e77c0f','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','mohamadfahmyiqbal baru saja mendaftar sebagai Calon Anggota.','2026-07-22 06:01:23','unread','2026-07-22 06:01:23','2026-07-22 06:01:23'),('53baf3fc-5cb6-4072-bf7c-f8cda98acc44','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembayaran Berhasil!','Setoran sebesar Rp 500.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 01:03:11','unread','2026-06-28 01:03:11','2026-06-28 01:03:11'),('54025c26-0622-4a17-85be-519fa596fd05','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 16:06:59','unread','2026-06-16 16:06:59','2026-06-16 16:06:59'),('5427cc9c-490b-43af-b1d0-47193efe90b1','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-22 11:32:00','unread','2026-07-22 11:32:00','2026-07-22 11:32:00'),('5466fcfa-47cf-4780-ad01-2185d1a3e01e','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:47:14','unread','2026-06-18 23:47:14','2026-06-18 23:47:14'),('54b20323-4f64-4c3b-a5bb-cc48e1f312dd','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 16:41:16','unread','2026-06-27 16:41:16','2026-06-27 16:41:16'),('54c260b2-99aa-4f81-aaa1-42fb1f954b70','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan tabungan withdrawals','Menunggu verifikasi Anda: Pengajuan tabungan withdrawals dari testtiga.','2026-07-11 13:09:15','unread','2026-07-11 13:09:15','2026-07-11 13:09:15'),('54e5ebf5-5494-4bc9-ad30-006a1839ff9f','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 21:33:30','unread','2026-06-18 21:33:30','2026-06-18 21:33:30'),('55e0b3d7-202c-42fe-b4b9-d5d48f521c57','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testtiga.','2026-07-10 05:58:53','unread','2026-07-10 05:58:53','2026-07-10 05:58:53'),('55e36d3f-a998-4d27-a2fe-8a269ae796bd','0900ac2d-4515-43c8-ae46-2bb1b27d5758','Selamat Datang!','Halo Budi Santoso, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-07-23 10:33:42','unread','2026-07-23 10:33:42','2026-07-23 10:33:42'),('56197d1a-6246-4af1-b42f-7286cb922372','8bd8e1a5-ec5b-4963-922c-9a5c724fb906','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 14:00:52','unread','2026-06-28 14:00:52','2026-06-28 14:00:52'),('562bb1c4-83bb-4f0a-9b72-cfc9dc44956f','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembayaran Berhasil!','Setoran sebesar Rp 1.000.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 12:57:12','unread','2026-06-28 12:57:12','2026-06-28 12:57:12'),('56a33606-98d1-4836-b1b6-c5abafa5aaac','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembayaran Berhasil!','Setoran sebesar Rp 5.000.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 21:37:26','unread','2026-06-27 21:37:26','2026-06-27 21:37:26'),('56a6b351-40f1-4680-a42e-8a9fb579c461','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan savings withdrawal','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 21:28:02','unread','2026-06-27 21:28:02','2026-06-27 21:28:02'),('56cee2f5-d278-42c1-a91a-c6135c0e3aa5','8c6f7722-c817-40c7-ba80-982b224f08c2','Arisan Disetujui!','Selamat! Pengajuan arisan Anda telah disetujui. Silahkan cek tagihan untuk setoran pertama.','2026-06-28 14:03:50','unread','2026-06-28 14:03:50','2026-06-28 14:03:50'),('56d107cb-7e4d-4a2a-8e8b-46f8778fffe0','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testsatu.','2026-06-16 12:25:06','unread','2026-06-16 12:25:06','2026-06-16 12:25:06'),('577ae3ed-92f1-4e09-91ae-cd9501075f43','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan Tabungan Disetujui!','Pengajuan Tabungan Anda telah disetujui.','2026-06-27 23:38:37','unread','2026-06-27 23:38:37','2026-06-27 23:38:37'),('584a34bf-1849-4bfd-a929-3bc8f8abed60','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 18:15:49','unread','2026-06-20 18:15:49','2026-06-20 18:15:49'),('586ec516-b387-4f9f-ac43-4d8c2c3eec8e','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 933.334 telah diterima via sinkronisasi otomatis.','2026-06-20 18:43:31','unread','2026-06-20 18:43:31','2026-06-20 18:43:31'),('58afc1ad-a200-4ada-a196-9d5ea253e9a8','43643359-0f59-4ea4-bb6d-e93505733d4a','Selamat Datang!','Halo testsatu, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-07-25 00:29:52','unread','2026-07-25 00:29:52','2026-07-25 00:29:52'),('5926121e-3cb0-4321-a57a-bbeb6d7d0771','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-28 01:01:07','unread','2026-06-28 01:01:07','2026-06-28 01:01:07'),('5928e433-f951-46a5-ab37-5b61da3cc4b1','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 54.880.000 telah diterima via sinkronisasi otomatis.','2026-07-22 13:50:43','unread','2026-07-22 13:50:43','2026-07-22 13:50:43'),('594ce40d-0c6e-4672-a8e3-e9caf87365a2','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pengajuan Tabungan Berhasil','Pengajuan Tabungan Qurban 2 senilai Rp 6.000.000 telah diproses.','2026-07-13 07:21:37','unread','2026-07-13 07:21:37','2026-07-13 07:21:37'),('59755883-2ebf-4474-9837-56914352653d','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan exit requests','Langkah \"Persetujuan Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-23 09:39:07','unread','2026-07-23 09:39:07','2026-07-23 09:39:07'),('59c23b1a-dbf0-4b83-a96d-52b7dbcb81b4','8c6f7722-c817-40c7-ba80-982b224f08c2','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 11:03:26','unread','2026-06-28 11:03:26','2026-06-28 11:03:26'),('59f7b44c-97e0-47aa-9610-3eca87c084df','693e2950-6039-45d3-b8f6-6ed5b2983814','Penarikan Disetujui!','Penarikan sebesar Rp 50.000 telah disetujui dan sedang diproses.','2026-07-21 15:37:18','unread','2026-07-21 15:37:18','2026-07-21 15:37:18'),('5a121b3b-489c-40ef-abce-6f08c3f037de','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pembayaran Berhasil!','Setoran sebesar Rp 724.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-12 22:58:45','unread','2026-07-12 22:58:45','2026-07-12 22:58:45'),('5a2c8122-8aa5-48fe-aa72-234b4508c281','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 18:05:47','unread','2026-06-20 18:05:47','2026-06-20 18:05:47'),('5a48768a-6f09-4d82-a9d0-e5666312cb5d','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 21:52:28','unread','2026-06-18 21:52:28','2026-06-18 21:52:28'),('5a5f0963-6170-4964-9b21-8ed15097e23f','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:06:50','unread','2026-06-18 23:06:50','2026-06-18 23:06:50'),('5ab1b662-1b8b-4d27-8826-9806520063c9','0a7fd51a-6494-4202-89b6-94641b105fbb','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-22 13:25:45','unread','2026-07-22 13:25:45','2026-07-22 13:25:45'),('5abe4851-5493-4823-bdff-c044b7a304f0','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.000.000 telah diterima via sinkronisasi otomatis.','2026-06-20 00:27:51','unread','2026-06-20 00:27:51','2026-06-20 00:27:51'),('5adc5cb1-1d8d-47c0-aa8d-c91fa111a509','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 21:13:39','unread','2026-06-18 21:13:39','2026-06-18 21:13:39'),('5b33c823-92ed-4568-acc7-3601b0012295','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-24 14:07:17','unread','2026-06-24 14:07:17','2026-06-24 14:07:17'),('5bb983bb-6b9c-4cc9-aea8-e9d8fbb0993a','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-12 22:50:17','unread','2026-07-12 22:50:17','2026-07-12 22:50:17'),('5bec12b7-f2f4-4948-aeec-cf546a575ae9','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari Budi Santoso.','2026-06-27 23:39:17','unread','2026-06-27 23:39:17','2026-06-27 23:39:17'),('5c1ba271-fefe-4689-9c15-27f80e2647cc','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 500.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 06:05:17','unread','2026-06-27 06:05:17','2026-06-27 06:05:17'),('5c2daf63-1586-428f-a246-dc1fb0b829c9','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testDua.','2026-07-19 08:14:29','unread','2026-07-19 08:14:29','2026-07-19 08:14:29'),('5c530a3d-df40-4637-aa0e-01821adfea0d','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 22:54:32','unread','2026-06-18 22:54:32','2026-06-18 22:54:32'),('5cb8b891-de50-430c-94be-0e8f08747c4d','8c6f7722-c817-40c7-ba80-982b224f08c2','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 14:01:08','unread','2026-06-28 14:01:08','2026-06-28 14:01:08'),('5cba36c4-c169-4049-a8d1-3863c70485d0','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.000.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 17:50:51','unread','2026-06-27 17:50:51','2026-06-27 17:50:51'),('5cc2c086-7a5d-44c8-b05d-110363befcd6','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 640.000 telah diterima via sinkronisasi otomatis.','2026-06-20 00:49:19','unread','2026-06-20 00:49:19','2026-06-20 00:49:19'),('5cfd7e1c-6486-4778-966c-7a8057a5496c','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','Avhan hadi baru saja mendaftar sebagai Calon Anggota.','2026-06-18 21:31:33','read','2026-06-18 21:31:33','2026-06-28 09:06:46'),('5d9d8b3d-5b31-4229-8cee-bba317a66a5f','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 720.000 telah diterima via sinkronisasi otomatis.','2026-07-22 06:05:15','unread','2026-07-22 06:05:15','2026-07-22 06:05:15'),('5e0c3605-f1bb-4c47-8556-17438bbca452','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 00:47:46','unread','2026-06-20 00:47:46','2026-06-20 00:47:46'),('5e14ff1d-1fa1-4f83-b06d-34034be9c1fe','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan savings withdrawal','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-04 18:23:36','unread','2026-07-04 18:23:36','2026-07-04 18:23:36'),('5e206a6c-7f26-4f08-85bb-1d46e8b0224b','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari avhanhb.','2026-07-12 22:43:31','unread','2026-07-12 22:43:31','2026-07-12 22:43:31'),('5e3c64ac-8ec8-4d9e-8c36-c67e376f78b1','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari Mohamad Fahmy Iqbal.','2026-06-20 00:28:49','unread','2026-06-20 00:28:49','2026-06-20 00:28:49'),('5e44bfb9-7dfe-4ac9-bd04-1c36a974f114','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan member saving targets','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-11 09:06:43','unread','2026-07-11 09:06:43','2026-07-11 09:06:43'),('5e68d8b5-cd68-4e93-8328-42cf5a5f09b5','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testsatu.','2026-06-16 12:36:35','unread','2026-06-16 12:36:35','2026-06-16 12:36:35'),('5ef4479e-2668-45c1-98eb-8c3c66246bc8','d33889c0-4bf9-4745-909b-a9a726181785','Pembayaran Berhasil!','Setoran sebesar Rp 700.000 telah diterima via sinkronisasi otomatis.','2026-07-04 15:30:46','unread','2026-07-04 15:30:46','2026-07-04 15:30:46'),('5f09b439-1d7e-4f03-bfcb-e1b9218ea04b','5e714c26-43e6-44a0-8a1e-def3f3290190','Pendaftaran Berhasil','Data Anda sedang diverifikasi.','2026-07-23 21:10:33','unread','2026-07-23 21:10:33','2026-07-23 21:10:33'),('5f4231f7-bf59-430b-8b04-72a5e3b89f8f','8c00e514-663c-4f3d-97ff-8520273d923e','Pembayaran Berhasil!','Setoran sebesar Rp 4.236.004 telah diterima via sinkronisasi otomatis.','2026-07-20 10:49:17','unread','2026-07-20 10:49:17','2026-07-20 10:49:17'),('5f44b945-dd4f-4120-8d8f-8cff73259176','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-24 14:05:28','unread','2026-06-24 14:05:28','2026-06-24 14:05:28'),('5f54a5f3-e7a4-48ac-a7bb-a83595cd3a2d','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','mohamadfahmyiqbal baru saja mendaftar sebagai Calon Anggota.','2026-07-22 05:59:07','unread','2026-07-22 05:59:07','2026-07-22 05:59:07'),('5ffc08d9-4d70-4c57-a4cf-da3907f859c5','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan Tabungan Disetujui!','Pengajuan Tabungan Anda telah disetujui.','2026-07-11 09:15:43','unread','2026-07-11 09:15:43','2026-07-11 09:15:43'),('602d7be4-e02b-46c0-9365-37caa8764d5c','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','Budi Santoso baru saja mendaftar sebagai Calon Anggota.','2026-07-23 10:33:42','unread','2026-07-23 10:33:42','2026-07-23 10:33:42'),('60833200-e854-4fdb-af90-94945d984b14','8bd8e1a5-ec5b-4963-922c-9a5c724fb906','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 09:54:47','read','2026-06-28 09:54:47','2026-06-28 09:58:30'),('608f22f2-cc66-4ddb-af00-879a88612178','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Tabungan Berhasil','Pengajuan Tabungan Haji 2026 senilai Rp 25.000.000 telah diproses.','2026-06-27 06:38:48','unread','2026-06-27 06:38:48','2026-06-27 06:38:48'),('60cb85f5-8eb8-4388-b87c-18d5bda6db2c','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','Avhan hadi baru saja mendaftar sebagai Calon Anggota.','2026-06-18 21:31:33','unread','2026-06-18 21:31:33','2026-06-18 21:31:33'),('6129188b-9081-4759-93f3-710b7bdae921','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Anggota Baru','Mohamad Fahmy Iqbal  telah mengirimkan data pendaftaran.','2026-07-19 08:12:48','unread','2026-07-19 08:12:48','2026-07-19 08:12:48'),('6141cdfd-146a-4152-9a0e-9e0839293df5','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembayaran Berhasil!','Setoran sebesar Rp 23.100.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 14:15:04','unread','2026-06-28 14:15:04','2026-06-28 14:15:04'),('614aab19-da6e-4eed-b9d7-5c8b286e92b7','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-28 01:26:05','unread','2026-06-28 01:26:05','2026-06-28 01:26:05'),('614baef8-a1c9-4618-9007-c153fec6118b','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 3 tagihan telah dibuat.','2026-07-12 23:31:48','unread','2026-07-12 23:31:48','2026-07-12 23:31:48'),('615d9a32-f0c1-4d27-8b7c-7586896cb2cc','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan savings withdrawal','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 21:04:39','unread','2026-06-27 21:04:39','2026-06-27 21:04:39'),('616206b5-7013-4804-8e90-158c3094ef1a','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-10 05:29:29','unread','2026-07-10 05:29:29','2026-07-10 05:29:29'),('616a323b-28d0-4191-a907-abac55884de5','d7570642-5cd5-4403-8085-66bb3927b76b','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 09:58:37','unread','2026-06-28 09:58:37','2026-06-28 09:58:37'),('617ec5fd-06f2-43d5-92c5-c5a2fd978c60','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testtiga.','2026-07-04 14:23:11','unread','2026-07-04 14:23:11','2026-07-04 14:23:11'),('61966218-48d5-4fc7-a49d-ba2f4c4f1ee3','d7570642-5cd5-4403-8085-66bb3927b76b','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 6 tagihan telah dibuat.','2026-06-28 11:05:41','unread','2026-06-28 11:05:41','2026-06-28 11:05:41'),('61aeef98-2340-42e4-895b-2f16f9e7eb6d','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 22:01:53','unread','2026-06-18 22:01:53','2026-06-18 22:01:53'),('61c02290-5827-4152-9479-f3edc25abc45','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 18:05:47','unread','2026-06-20 18:05:47','2026-06-20 18:05:47'),('622f123b-2ca1-4856-ab96-b852e4211b3c','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan Sukuk','Langkah persetujuan oleh Pengawas telah berhasil. Menunggu verifikasi lainnya.','2026-06-28 14:31:20','unread','2026-06-28 14:31:20','2026-06-28 14:31:20'),('626480cc-e95c-4428-8a85-1f8638e19fcd','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.500.000 telah diterima via sinkronisasi otomatis.','2026-06-20 00:48:17','unread','2026-06-20 00:48:17','2026-06-20 00:48:17'),('62782c95-3900-466f-988b-d41b24e1a65e','8c00e514-663c-4f3d-97ff-8520273d923e','Pembayaran Berhasil!','Setoran sebesar Rp 4.240.444 telah diterima. Keanggotaan Anda kini aktif.','2026-07-20 10:49:17','unread','2026-07-20 10:49:17','2026-07-20 10:49:17'),('628225aa-fd9f-4003-a5e7-06e8da8a7de4','d33889c0-4bf9-4745-909b-a9a726181785','Pembayaran Berhasil!','Setoran sebesar Rp 3.000.000 telah diterima via sinkronisasi otomatis.','2026-07-10 06:01:28','unread','2026-07-10 06:01:28','2026-07-10 06:01:28'),('62bf4214-fa7d-4024-8977-b88316312b0b','8c00e514-663c-4f3d-97ff-8520273d923e','Pengajuan Pembiayaan','Pengajuan Darurat (Pinjaman Darurat) senilai Rp 3.000.000 telah berhasil dikirim.','2026-07-20 10:54:47','unread','2026-07-20 10:54:47','2026-07-20 10:54:47'),('62c6f2a6-cec2-49b1-9763-8367abbb4764','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 17:01:43','unread','2026-06-27 17:01:43','2026-06-27 17:01:43'),('636b0d87-1e3d-4fda-a8cf-8f5224dfdaa6','8c6f7722-c817-40c7-ba80-982b224f08c2','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 11:01:44','unread','2026-06-28 11:01:44','2026-06-28 11:01:44'),('637500ad-c642-42ec-99be-52f72ce93fc1','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 21:43:43','unread','2026-06-18 21:43:43','2026-06-18 21:43:43'),('63981c28-605a-4cfa-aa7d-95a25807cc77','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 01:00:15','unread','2026-06-28 01:00:15','2026-06-28 01:00:15'),('63a1928d-f76b-42a6-97a1-8289d174eda0','d7570642-5cd5-4403-8085-66bb3927b76b','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 11:02:08','unread','2026-06-28 11:02:08','2026-06-28 11:02:08'),('63e9b966-d48c-4f47-910d-2379776f8f11','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','Agus Riyanta baru saja mendaftar sebagai Calon Anggota.','2026-06-17 19:01:54','read','2026-06-17 19:01:54','2026-06-28 09:06:46'),('64805ad6-0050-46b1-bb71-10dbf00ff37d','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','testsatu baru saja mendaftar sebagai Calon Anggota.','2026-07-23 09:16:50','unread','2026-07-23 09:16:50','2026-07-23 09:16:50'),('64b87cc5-620a-42f8-88c3-f18b1f5655a2','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:59:47','unread','2026-06-18 23:59:47','2026-06-18 23:59:47'),('64d506fb-2edd-4f66-a493-ce36df95e4e0','df603033-5528-4dde-885f-407c1015e488','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-25 01:27:16','unread','2026-07-25 01:27:16','2026-07-25 01:27:16'),('6546fe31-d7af-4fe6-a89d-5730d01937fa','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','Ade Sugianto baru saja mendaftar sebagai Calon Anggota.','2026-06-28 09:21:22','unread','2026-06-28 09:21:22','2026-06-28 09:21:22'),('65ab1c8b-3487-4138-b71b-2ea08e8445c3','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 14:06:35','unread','2026-06-28 14:06:35','2026-06-28 14:06:35'),('65e87990-0571-4617-b105-2454d2d5b06b','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','Budi Santoso baru saja mendaftar sebagai Calon Anggota.','2026-06-27 20:48:28','read','2026-06-27 20:48:28','2026-06-28 09:06:46'),('6633b98f-943f-4b4f-99c5-5763d9f9f72e','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 16:43:01','unread','2026-06-16 16:43:01','2026-06-16 16:43:01'),('665c78f7-57af-4ea4-ac18-57a9060ecf0c','8bd8e1a5-ec5b-4963-922c-9a5c724fb906','Pembayaran Berhasil!','Setoran sebesar Rp 23.100.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 14:12:13','unread','2026-06-28 14:12:13','2026-06-28 14:12:13'),('67307ca3-ccec-494e-87f0-f0d741187d84','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-27 16:42:35','unread','2026-06-27 16:42:35','2026-06-27 16:42:35'),('6761231d-a2c3-4cbc-929b-4733541a197d','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 16:21:00','unread','2026-06-16 16:21:00','2026-06-16 16:21:00'),('676510a3-32bb-4a9a-b43d-5af842fddfe3','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari testsatu.','2026-06-16 14:05:46','unread','2026-06-16 14:05:46','2026-06-16 14:05:46'),('6783fe91-865d-4101-9851-6432cf7747b7','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','Mohamad Fahmy Iqbal  telah mengirimkan data pendaftaran.','2026-07-21 15:06:33','unread','2026-07-21 15:06:33','2026-07-21 15:06:33'),('687e45c0-8d3f-4129-a2a6-9b551485a08f','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-04 15:09:36','unread','2026-07-04 15:09:36','2026-07-04 15:09:36'),('68bf2245-190b-457b-9d37-f498a627ef4a','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 19:18:29','unread','2026-06-20 19:18:29','2026-06-20 19:18:29'),('68d24fcd-5701-46c6-be9e-be8415ceef67','8bd8e1a5-ec5b-4963-922c-9a5c724fb906','Pendaftaran Akun Baru','TestDua baru saja mendaftar sebagai Calon Anggota.','2026-07-20 16:35:57','unread','2026-07-20 16:35:57','2026-07-20 16:35:57'),('68eb00c4-1cb9-48d7-b117-732757c67c12','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-10 05:43:23','unread','2026-07-10 05:43:23','2026-07-10 05:43:23'),('69128016-c132-4cc2-aa11-5224a25808d6','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.400.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 13:35:23','unread','2026-06-28 13:35:23','2026-06-28 13:35:23'),('6939a5b7-5caf-43e9-b519-40bdeb382b38','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 16:59:40','unread','2026-06-20 16:59:40','2026-06-20 16:59:40'),('695e7221-2704-416a-96ac-aab893c6a51d','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 16:35:06','unread','2026-06-16 16:35:06','2026-06-16 16:35:06'),('69908b64-4efe-40ac-8ae4-cb0566564b6d','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Ade Sugianto.','2026-06-28 11:25:18','unread','2026-06-28 11:25:18','2026-06-28 11:25:18'),('69ad6e65-c54b-44e9-bc0e-832c66a4068c','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan Sukuk','Langkah persetujuan oleh Pengawas telah berhasil. Menunggu verifikasi lainnya.','2026-06-27 17:46:17','unread','2026-06-27 17:46:17','2026-06-27 17:46:17'),('69db7a87-6505-4c1f-b8f9-a230cc62a883','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-27 22:56:35','unread','2026-06-27 22:56:35','2026-06-27 22:56:35'),('6a0703d2-9102-4e1e-bd2a-3b5640e082f9','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-27 17:01:54','unread','2026-06-27 17:01:54','2026-06-27 17:01:54'),('6ab4b6f5-e3ac-407f-b496-be1a86abba28','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 14:43:25','unread','2026-06-28 14:43:25','2026-06-28 14:43:25'),('6ad23389-8c1e-41e7-8e31-ba07b020fe31','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','Budi Santoso baru saja mendaftar sebagai Calon Anggota.','2026-07-23 10:09:28','unread','2026-07-23 10:09:28','2026-07-23 10:09:28'),('6aea012f-77b1-4f96-8f2a-18e03a164ced','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: iqbal fahmy','2026-07-22 06:03:09','unread','2026-07-22 06:03:09','2026-07-22 06:03:09'),('6af065d3-2904-43f8-921c-16e5c8a4edc6','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.400.000 telah diterima via sinkronisasi otomatis.','2026-06-27 23:18:14','unread','2026-06-27 23:18:14','2026-06-27 23:18:14'),('6b7a8024-c2a3-43aa-9aba-9261e9f024bd','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-10 05:52:04','unread','2026-07-10 05:52:04','2026-07-10 05:52:04'),('6b7b3e89-8739-4676-b4e1-9964bdac2eeb','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-12 22:54:15','unread','2026-07-12 22:54:15','2026-07-12 22:54:15'),('6b81f1a2-ff26-410f-a5d5-e9bb6e96fc7d','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 17:44:51','unread','2026-06-20 17:44:51','2026-06-20 17:44:51'),('6c027f67-78bf-436d-ad54-a4f4c64b5506','8c00e514-663c-4f3d-97ff-8520273d923e','Pendaftaran Berhasil','Data Anda sedang diverifikasi.','2026-07-19 08:12:47','unread','2026-07-19 08:12:47','2026-07-19 08:12:47'),('6c0c3f51-2ba9-4ffd-98f5-4876a99eeece','8c00e514-663c-4f3d-97ff-8520273d923e','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-20 10:55:33','unread','2026-07-20 10:55:33','2026-07-20 10:55:33'),('6c49c26b-8b3c-4a30-8fd4-e06d3417fe70','d33889c0-4bf9-4745-909b-a9a726181785','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 0 tagihan telah dibuat.','2026-07-10 05:44:22','unread','2026-07-10 05:44:22','2026-07-10 05:44:22'),('6d3b341a-1e9c-4703-8943-9f37e5a8b305','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari Budi Santoso.','2026-06-27 20:59:37','unread','2026-06-27 20:59:37','2026-06-27 20:59:37'),('6d6853ae-784b-4d26-8820-c74c5d2add7b','5880c3cd-d403-40dd-997b-319629799cab','Penarikan Disetujui!','Penarikan sebesar Rp 50.000 telah disetujui dan sedang diproses.','2026-06-28 10:51:27','unread','2026-06-28 10:51:27','2026-06-28 10:51:27'),('6d6c99f1-b938-48a4-be28-bc8870876233','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 18:05:40','unread','2026-06-20 18:05:40','2026-06-20 18:05:40'),('6d7317b8-273e-46d4-95ea-a4b4066796c9','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Ade Sugianto.','2026-06-28 11:35:57','unread','2026-06-28 11:35:57','2026-06-28 11:35:57'),('6d8bffa0-c436-41e3-afe1-40848d47c548','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembayaran Berhasil!','Setoran sebesar Rp 3.000.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 00:22:04','unread','2026-06-28 00:22:04','2026-06-28 00:22:04'),('6d9fe6ec-39ce-4cbf-880a-822787314308','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 17:54:10','unread','2026-06-20 17:54:10','2026-06-20 17:54:10'),('6dccc63c-83e4-43f4-a6dd-ad037ab6371c','d33889c0-4bf9-4745-909b-a9a726181785','Pembayaran Berhasil!','Setoran sebesar Rp 3.004.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-10 06:01:30','unread','2026-07-10 06:01:30','2026-07-10 06:01:30'),('6e09a99e-8210-4634-8107-b7b2b625108c','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-27 23:52:59','unread','2026-06-27 23:52:59','2026-06-27 23:52:59'),('6e142ec7-1d18-4b99-9329-142146825831','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 224.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-22 06:09:44','unread','2026-07-22 06:09:44','2026-07-22 06:09:44'),('6e429bc7-e64d-41d4-913e-3e7b326bcc4a','43643359-0f59-4ea4-bb6d-e93505733d4a','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-25 01:12:50','unread','2026-07-25 01:12:50','2026-07-25 01:12:50'),('6e56e262-d182-45b2-a6da-7fa0b3d02fe6','5e2a7401-a909-42e6-94f4-e24c0cc322f3','Selamat Datang!','Halo Agus Riyanta, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-06-17 19:01:54','unread','2026-06-17 19:01:54','2026-06-17 19:01:54'),('6e6b972d-ae45-499b-a230-3a7f457b069f','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-27 21:37:33','unread','2026-06-27 21:37:33','2026-06-27 21:37:33'),('6e7db7b5-60c2-4789-8cfc-5415bcc37c38','8c6f7722-c817-40c7-ba80-982b224f08c2','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 11:07:59','unread','2026-06-28 11:07:59','2026-06-28 11:07:59'),('6ed621e0-96fc-4358-b62b-6ca1f03d1038','54520291-edd7-400a-b12a-44876c8aa5d7','Selamat Datang!','Halo Budi Santoso, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-07-23 10:40:52','unread','2026-07-23 10:40:52','2026-07-23 10:40:52'),('6edae867-d902-447c-9b24-a3593bf38301','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: test','2026-06-16 11:36:55','read','2026-06-16 11:36:55','2026-06-28 09:06:46'),('6fcc4121-e532-48b7-9122-8b964afcc3da','0a7fd51a-6494-4202-89b6-94641b105fbb','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-22 13:45:43','unread','2026-07-22 13:45:43','2026-07-22 13:45:43'),('709a93ef-6b78-4459-acc6-8572516fd1a4','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','testsatu baru saja mendaftar sebagai Calon Anggota.','2026-06-16 11:35:02','unread','2026-06-16 11:35:02','2026-06-16 11:35:02'),('709c5f9c-19db-4e59-9f8c-e9f7862d631f','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Anggota Baru','Budi Santoso telah mengirimkan data pendaftaran.','2026-06-27 20:52:55','unread','2026-06-27 20:52:55','2026-06-27 20:52:55'),('70b1f9b9-2d2b-49e6-b4bd-70a9094daa24','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','Budi Santoso baru saja mendaftar sebagai Calon Anggota.','2026-07-23 10:40:52','unread','2026-07-23 10:40:52','2026-07-23 10:40:52'),('70caead7-676b-45a8-a24e-fa887d190563','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 00:46:51','unread','2026-06-20 00:46:51','2026-06-20 00:46:51'),('70dc0952-670d-479c-8552-f01fd9303e73','8c00e514-663c-4f3d-97ff-8520273d923e','Update Persetujuan savings withdrawal','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-19 08:44:59','unread','2026-07-19 08:44:59','2026-07-19 08:44:59'),('7150ba9e-58db-434f-8881-3138717a4f13','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-12 22:52:00','unread','2026-07-12 22:52:00','2026-07-12 22:52:00'),('716554ae-cd3e-4817-934b-7595f98cb771','d33889c0-4bf9-4745-909b-a9a726181785','Pembayaran Berhasil!','Setoran sebesar Rp 1.504.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-10 05:30:28','unread','2026-07-10 05:30:28','2026-07-10 05:30:28'),('717677e9-d227-4dc7-8c84-5b3839956575','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testsatu.','2026-06-16 11:42:57','unread','2026-06-16 11:42:57','2026-06-16 11:42:57'),('72391145-3017-4b81-a4e9-537ccac60fae','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 22:51:08','unread','2026-06-27 22:51:08','2026-06-27 22:51:08'),('726eb5da-c3f2-4d55-840b-24579b87f481','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari hendrik saepudin.','2026-06-28 11:34:51','unread','2026-06-28 11:34:51','2026-06-28 11:34:51'),('7282b76a-9969-4d8d-91b6-418ef754501c','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembayaran Berhasil!','Setoran sebesar Rp 2.100.000 telah diterima via sinkronisasi otomatis.','2026-06-28 14:08:56','unread','2026-06-28 14:08:56','2026-06-28 14:08:56'),('73122543-ec65-4f98-82cc-f6e9f5753a9a','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.448.000 telah diterima via sinkronisasi otomatis.','2026-06-20 19:20:03','unread','2026-06-20 19:20:03','2026-06-20 19:20:03'),('7312926f-ad18-4fd1-ad2f-50ca6a96b252','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Pembiayaan','Pengajuan Pelunasan Jual Beli (Pelunasan Laptop asus) senilai Rp 16.166.004 telah berhasil dikirim.','2026-07-20 16:12:16','unread','2026-07-20 16:12:16','2026-07-20 16:12:16'),('73164dda-8b37-40f2-87c0-781f4c224a60','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 700.000 telah diterima via sinkronisasi otomatis.','2026-06-20 00:26:22','unread','2026-06-20 00:26:22','2026-06-20 00:26:22'),('736854e1-6eaa-43ff-8e21-9e6287df0cc0','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-27 22:56:54','unread','2026-06-27 22:56:54','2026-06-27 22:56:54'),('73bc8205-890a-4f64-90b2-7430258138e3','8bd8e1a5-ec5b-4963-922c-9a5c724fb906','Pengajuan Arisan','Pengajuan bergabung grup arisan Arisan Umrah 2 (9) berhasil dikirim dan sedang menunggu persetujuan.','2026-06-28 13:59:36','unread','2026-06-28 13:59:36','2026-06-28 13:59:36'),('73e64dab-2a88-4c06-a716-412891525a1d','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.000.000 telah diterima via sinkronisasi otomatis.','2026-06-20 19:33:10','unread','2026-06-20 19:33:10','2026-06-20 19:33:10'),('748d7687-869b-4b85-b218-45145cfbb248','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 22:24:48','unread','2026-06-18 22:24:48','2026-06-18 22:24:48'),('74fe03a2-f559-4d24-9742-9414e577cdd8','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 19:18:30','unread','2026-06-20 19:18:30','2026-06-20 19:18:30'),('752e9281-546a-4101-83e7-7c3829afa403','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari hendrik saepudin.','2026-06-28 11:02:48','unread','2026-06-28 11:02:48','2026-06-28 11:02:48'),('75355096-ab93-4ae8-a5fb-2b3b360d0225','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Update Persetujuan member saving targets','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-13 07:48:02','unread','2026-07-13 07:48:02','2026-07-13 07:48:02'),('756e75ff-1858-4f49-915d-5801313369a1','0a7fd51a-6494-4202-89b6-94641b105fbb','Selamat Datang!','Halo mohamadfahmyiqbal, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-07-22 06:01:23','unread','2026-07-22 06:01:23','2026-07-22 06:01:23'),('75740c8b-cf62-4f5f-9b06-21edbe2c7b12','8c00e514-663c-4f3d-97ff-8520273d923e','Update Persetujuan savings withdrawal','Langkah \"Pencairan Bendahara\" disetujui. Menunggu verifikasi berikutnya.','2026-07-19 10:17:16','unread','2026-07-19 10:17:16','2026-07-19 10:17:16'),('75ba5837-ef72-4b29-ae8a-8706d755677b','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan savings withdrawal','Langkah \"Pencairan Bendahara\" disetujui. Menunggu verifikasi berikutnya.','2026-07-22 10:58:43','unread','2026-07-22 10:58:43','2026-07-22 10:58:43'),('75eaf02e-dbf6-42ef-ac90-947c629df7a1','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari mohamadfahmyiqbal.','2026-07-22 06:22:55','unread','2026-07-22 06:22:55','2026-07-22 06:22:55'),('769e9b72-bafa-4cc8-998c-0f67941a497e','d7570642-5cd5-4403-8085-66bb3927b76b','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 11:19:15','unread','2026-06-28 11:19:15','2026-06-28 11:19:15'),('7736dcb2-b3ee-472d-9962-d312893c307f','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 16:59:24','unread','2026-06-20 16:59:24','2026-06-20 16:59:24'),('775e8f79-d6ac-458d-97c5-c943d5f25c8c','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-27 14:53:23','unread','2026-06-27 14:53:23','2026-06-27 14:53:23'),('77f8400e-e44c-4ede-9c7f-18c78b36608e','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari Budi Santoso.','2026-06-27 20:59:52','unread','2026-06-27 20:59:52','2026-06-27 20:59:52'),('7820cd6c-0ebe-4393-8905-c6ab8a131531','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','Avhan Hadi Bijaksa a baru saja mendaftar sebagai Calon Anggota.','2026-07-23 21:06:03','unread','2026-07-23 21:06:03','2026-07-23 21:06:03'),('785fb447-4a44-4e4b-892e-a713ac5eff7e','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 17:13:15','unread','2026-06-20 17:13:15','2026-06-20 17:13:15'),('7870305c-9867-4f0a-9bec-34dbd4e65bda','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 17:15:48','unread','2026-06-20 17:15:48','2026-06-20 17:15:48'),('794c7281-73d7-4cb8-a9c4-d15a8e3ee324','8c00e514-663c-4f3d-97ff-8520273d923e','Pembayaran Berhasil!','Setoran sebesar Rp 724.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-19 08:17:33','unread','2026-07-19 08:17:33','2026-07-19 08:17:33'),('79c8ed15-b70c-4396-847c-54530c9cdae6','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','Mohamad Fahmy Iqbal  telah mengirimkan data pendaftaran.','2026-07-19 08:12:48','unread','2026-07-19 08:12:48','2026-07-19 08:12:48'),('7a1d3788-6c4d-436a-a7c8-128b9d9ea363','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Pembiayaan','Pengajuan Property (Laptop asus) senilai Rp 13.500.000 telah berhasil dikirim.','2026-07-19 08:58:53','unread','2026-07-19 08:58:53','2026-07-19 08:58:53'),('7a9f6d7f-af69-4dd6-8367-9c62e57b5919','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 17:39:58','unread','2026-06-20 17:39:58','2026-06-20 17:39:58'),('7af9e352-77ae-4d56-add9-1e4d691e97b1','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari Mohamad Fahmy Iqbal.','2026-06-19 23:43:50','unread','2026-06-19 23:43:50','2026-06-19 23:43:50'),('7b0ac5d7-6216-41af-ab48-1b75ebad7d43','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari mohamadfahmyiqbal.','2026-07-22 10:56:29','unread','2026-07-22 10:56:29','2026-07-22 10:56:29'),('7b7336c9-419e-4fcb-9ba0-15ae01b5b110','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: test','2026-07-04 13:52:18','unread','2026-07-04 13:52:18','2026-07-04 13:52:18'),('7c3b9f3b-7e8c-4ee0-84ac-527bbfa3da0b','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','Hendrik Saepudin telah mengirimkan data pendaftaran.','2026-06-28 09:18:16','unread','2026-06-28 09:18:16','2026-06-28 09:18:16'),('7cc04e77-336d-4225-8f65-3de580033a4f','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 18:00:30','unread','2026-06-20 18:00:30','2026-06-20 18:00:30'),('7d1668ed-3c30-4435-b513-9e5ee519c5c1','693e2950-6039-45d3-b8f6-6ed5b2983814','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-21 15:57:25','unread','2026-07-21 15:57:25','2026-07-21 15:57:25'),('7d32980d-f653-4b06-8f78-bad1e02bf391','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 1.500.000 telah diterima via sinkronisasi otomatis.','2026-07-22 11:39:29','unread','2026-07-22 11:39:29','2026-07-22 11:39:29'),('7dd604cf-0f2f-4a8c-9f99-d981b88db529','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembayaran Berhasil!','Setoran sebesar Rp 200.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 10:20:33','unread','2026-06-28 10:20:33','2026-06-28 10:20:33'),('7dfa0782-91be-4a32-bd61-87144b67b678','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 18:15:49','unread','2026-06-20 18:15:49','2026-06-20 18:15:49'),('7dfe186e-4942-4fa7-b448-2be88d4a9f66','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembayaran Berhasil!','Setoran sebesar Rp 15.400.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 23:22:18','unread','2026-06-27 23:22:18','2026-06-27 23:22:18'),('7e370292-649c-40dc-97df-f6cb1a5a74cb','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 21:34:45','unread','2026-06-27 21:34:45','2026-06-27 21:34:45'),('7e7c2c90-bcc1-4e8a-b44a-f6e7f6d14fb2','5880c3cd-d403-40dd-997b-319629799cab','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 7 tagihan telah dibuat.','2026-07-20 10:42:18','unread','2026-07-20 10:42:18','2026-07-20 10:42:18'),('7e9a9b0b-a31c-4b40-835c-c75d293c5c6e','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:58:39','unread','2026-06-18 23:58:39','2026-06-18 23:58:39'),('7edd6900-afc3-4adb-a582-43c87c725fb9','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembayaran Berhasil!','Setoran sebesar Rp 300.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 21:02:45','unread','2026-06-27 21:02:45','2026-06-27 21:02:45'),('7f22ad42-30c3-4a24-87e8-ba90032d3f8b','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Anggota Baru','test telah mengirimkan data pendaftaran.','2026-07-04 13:52:18','unread','2026-07-04 13:52:18','2026-07-04 13:52:18'),('7f264b19-82ee-4b2b-baca-0cb7eaf82f23','8c6f7722-c817-40c7-ba80-982b224f08c2','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 14:03:16','unread','2026-06-28 14:03:16','2026-06-28 14:03:16'),('7f7cf57e-6fff-4e6d-86f2-253d88ff5b36','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan savings withdrawal','Langkah \"Pencairan Bendahara\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 00:29:39','unread','2026-06-20 00:29:39','2026-06-20 00:29:39'),('7f889bf2-fcbb-4b08-8c66-1c27b6b48607','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-28 12:59:02','unread','2026-06-28 12:59:02','2026-06-28 12:59:02'),('7fc82086-92ea-4296-9fd4-035a967204da','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-27 22:26:01','unread','2026-06-27 22:26:01','2026-06-27 22:26:01'),('7fe567e1-ca27-403d-925e-6df6a29bff29','0a7fd51a-6494-4202-89b6-94641b105fbb','Penarikan Disetujui!','Penarikan sebesar Rp 50.000 telah disetujui dan sedang diproses.','2026-07-22 10:42:30','unread','2026-07-22 10:42:30','2026-07-22 10:42:30'),('80107ab9-bb68-4ec2-8526-66872fd0e75f','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari avhanhb.','2026-07-12 22:50:00','unread','2026-07-12 22:50:00','2026-07-12 22:50:00'),('8037a894-d519-4007-944a-9d394eb43e12','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari mohamadfahmyiqbal.','2026-07-22 07:44:24','unread','2026-07-22 07:44:24','2026-07-22 07:44:24'),('807aa566-7a1a-40f4-bdc6-97a38c5f83c3','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Pembiayaan','Pengajuan Darurat (Pinjaman Darurat) senilai Rp 3.000.000 telah berhasil dikirim.','2026-06-28 12:58:08','unread','2026-06-28 12:58:08','2026-06-28 12:58:08'),('809064b8-d679-4206-a43e-f17363309a31','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 448.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-20 17:15:11','unread','2026-06-20 17:15:11','2026-06-20 17:15:11'),('80a45d69-7006-423d-9a8b-e324175e60f3','65b64a0c-abe4-44e1-9199-767360f9fdb4','Selamat Datang!','Halo mohamadfahmyiqbal, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-07-22 05:54:20','unread','2026-07-22 05:54:20','2026-07-22 05:54:20'),('81251110-afa7-4aea-88b3-95736e3cf80d','d7570642-5cd5-4403-8085-66bb3927b76b','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 0 tagihan telah dibuat.','2026-06-28 11:21:06','unread','2026-06-28 11:21:06','2026-06-28 11:21:06'),('813ecd57-2385-47c0-bf14-0864cba28040','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari Mohamad Fahmy Iqbal.','2026-06-28 10:46:32','unread','2026-06-28 10:46:32','2026-06-28 10:46:32'),('81406154-f771-4132-9c3f-1f26eb947507','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: Abdullah','2026-06-28 09:33:59','read','2026-06-28 09:33:59','2026-06-28 10:48:23'),('8189bb17-ee5f-4e12-945d-78b93d605c0e','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 18:05:56','unread','2026-06-20 18:05:56','2026-06-20 18:05:56'),('81ecd1ad-b83f-4b2c-bced-7a1f11132396','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-20 16:15:55','unread','2026-07-20 16:15:55','2026-07-20 16:15:55'),('8257aff4-4e4a-478f-94d3-7b83cd0d3ad1','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','Avhan hadi baru saja mendaftar sebagai Calon Anggota.','2026-06-18 21:31:33','unread','2026-06-18 21:31:33','2026-06-18 21:31:33'),('82821aaf-0a88-4f82-b9cb-7cb921eaabf7','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testtiga.','2026-07-10 05:53:12','unread','2026-07-10 05:53:12','2026-07-10 05:53:12'),('82863e7f-f22b-40f9-9f43-bbdb11aa009b','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 17:54:35','unread','2026-06-20 17:54:35','2026-06-20 17:54:35'),('83022f14-7f40-4744-bf3b-8f36e2745edc','693e2950-6039-45d3-b8f6-6ed5b2983814','Update Persetujuan savings withdrawal','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-21 15:35:38','unread','2026-07-21 15:35:38','2026-07-21 15:35:38'),('83345efb-fdc1-429c-801f-9ec5a2778d16','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 01:02:25','unread','2026-06-28 01:02:25','2026-06-28 01:02:25'),('8368ac5e-5c9d-4e30-8ac4-ab3a2672f0bd','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 22:30:08','unread','2026-06-18 22:30:08','2026-06-18 22:30:08'),('83b589e0-5f0e-461a-a0b0-463824850e34','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 21:22:32','unread','2026-06-18 21:22:32','2026-06-18 21:22:32'),('846f0620-af30-48a7-96e9-1ebcce7afeeb','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Pembiayaan','Pengajuan Pendanaan Syariah UMKM (aasdasd) senilai Rp 5.000.000 telah berhasil dikirim.','2026-06-27 16:36:05','unread','2026-06-27 16:36:05','2026-06-27 16:36:05'),('84b5289c-9be9-47f3-9325-7ccab70ca3aa','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 17:15:38','unread','2026-06-20 17:15:38','2026-06-20 17:15:38'),('84d565d6-66b7-4c8d-85d6-ad25f326cd22','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan savings withdrawal','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-04 17:54:36','unread','2026-07-04 17:54:36','2026-07-04 17:54:36'),('85306998-d607-4897-8336-f994d10780d0','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-20 16:16:33','unread','2026-07-20 16:16:33','2026-07-20 16:16:33'),('85fd7298-1ca2-41b3-8623-ccaeb9616644','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari hendrik saepudin.','2026-06-28 11:19:15','unread','2026-06-28 11:19:15','2026-06-28 11:19:15'),('862fa39a-471b-430c-ad3c-f92fd8eab1f6','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 18:16:07','unread','2026-06-20 18:16:07','2026-06-20 18:16:07'),('863c1f04-58b6-4d40-bd4e-2ec2d2ebe810','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 5.000.000 telah diterima via sinkronisasi otomatis.','2026-06-28 14:33:03','unread','2026-06-28 14:33:03','2026-06-28 14:33:03'),('8667c056-d836-49c3-9498-414c31bd397b','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 12:59:02','unread','2026-06-28 12:59:02','2026-06-28 12:59:02'),('866ef298-c4ad-461f-b4ed-c1475c149aa5','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 17:13:14','unread','2026-06-20 17:13:14','2026-06-20 17:13:14'),('868f54c5-76b2-4283-829a-0d084c4b48aa','693e2950-6039-45d3-b8f6-6ed5b2983814','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-21 16:12:58','unread','2026-07-21 16:12:58','2026-07-21 16:12:58'),('86ce9c0b-91ca-4a1c-b40b-42a88c79d28d','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-28 13:34:36','unread','2026-06-28 13:34:36','2026-06-28 13:34:36'),('86d52896-a70e-457d-a47a-aa4913d68ec4','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 224.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-22 06:07:12','unread','2026-07-22 06:07:12','2026-07-22 06:07:12'),('86e3c719-c4b6-4490-9ab0-513a56f2784d','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan Sukuk','Langkah persetujuan oleh Pengawas telah berhasil. Menunggu verifikasi lainnya.','2026-06-27 13:13:38','unread','2026-06-27 13:13:38','2026-06-27 13:13:38'),('86e82704-a74c-4bda-9938-4d523e53c57f','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','Budi Santoso baru saja mendaftar sebagai Calon Anggota.','2026-07-23 10:09:28','unread','2026-07-23 10:09:28','2026-07-23 10:09:28'),('86f2a311-6976-49cc-9be6-68a2f1775aef','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-28 14:00:52','unread','2026-06-28 14:00:52','2026-06-28 14:00:52'),('87726dfd-5257-4161-9ab0-a6eda1d5b6d8','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','Septiawan Wijaya Kusuma baru saja mendaftar sebagai Calon Anggota.','2026-07-15 12:35:23','unread','2026-07-15 12:35:23','2026-07-15 12:35:23'),('880e254b-6066-4c6b-a652-475e9b9a6d9c','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 14:49:53','read','2026-06-28 14:49:53','2026-07-04 06:48:48'),('8842324b-0936-4d75-9b19-ff00c24890d3','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-12 23:45:46','unread','2026-07-12 23:45:46','2026-07-12 23:45:46'),('8869d8ec-9712-4768-b2eb-13ea7c76a6a2','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 21:44:06','unread','2026-06-18 21:44:06','2026-06-18 21:44:06'),('88a08836-a656-422e-8a5c-02d0d8c48c13','693e2950-6039-45d3-b8f6-6ed5b2983814','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-21 15:19:44','unread','2026-07-21 15:19:44','2026-07-21 15:19:44'),('88a3233a-fd4c-4904-b8e4-0b568d0c0ab8','8c00e514-663c-4f3d-97ff-8520273d923e','Pengajuan Arisan','Pengajuan bergabung grup arisan Arisan umrah  (batch 6) berhasil dikirim dan sedang menunggu persetujuan.','2026-07-20 12:07:24','unread','2026-07-20 12:07:24','2026-07-20 12:07:24'),('894ca512-aa17-476b-88fc-4ee38ef0c19d','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pembayaran Berhasil!','Setoran sebesar Rp 1.000.000 telah diterima via sinkronisasi otomatis.','2026-07-12 23:34:40','unread','2026-07-12 23:34:40','2026-07-12 23:34:40'),('89e0f3fd-dd82-4b13-955a-38fbcfdfa970','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan member saving targets Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-27 23:38:37','unread','2026-06-27 23:38:37','2026-06-27 23:38:37'),('89e20ad4-5535-485e-92bf-22838e0e29fe','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.000.000 telah diterima via sinkronisasi otomatis.','2026-06-20 17:14:06','unread','2026-06-20 17:14:06','2026-06-20 17:14:06'),('8a876b20-63c5-47e0-8281-f0ff924d5aa5','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari Avhan hadi.','2026-06-27 21:28:02','unread','2026-06-27 21:28:02','2026-06-27 21:28:02'),('8ae205b4-3c8e-4110-adde-f5790283bd02','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari avhanhb.','2026-07-12 22:54:15','unread','2026-07-12 22:54:15','2026-07-12 22:54:15'),('8afdb9a9-d5eb-4502-821e-2a18cbab2dcc','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','Mohamad Fahmy Iqbal baru saja mendaftar sebagai Calon Anggota.','2026-06-19 21:43:44','unread','2026-06-19 21:43:44','2026-06-19 21:43:44'),('8b1b75ea-c849-493d-aa40-ea92500776a7','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testDua.','2026-07-20 10:51:08','unread','2026-07-20 10:51:08','2026-07-20 10:51:08'),('8b5d0f9e-e56e-4293-9296-e483f9eb940c','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 856.000 telah diterima via sinkronisasi otomatis.','2026-06-20 17:56:04','unread','2026-06-20 17:56:04','2026-06-20 17:56:04'),('8bbb622c-d409-49b0-b0a0-6351db790178','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','Budi Santoso baru saja mendaftar sebagai Calon Anggota.','2026-07-23 10:40:52','unread','2026-07-23 10:40:52','2026-07-23 10:40:52'),('8bd1ce10-a858-4af4-8b42-5cf761ea2e78','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-22 11:35:07','unread','2026-07-22 11:35:07','2026-07-22 11:35:07'),('8be0e538-ad86-4a96-a9d3-b6296b4528c9','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-28 14:06:35','unread','2026-06-28 14:06:35','2026-06-28 14:06:35'),('8c58cceb-da6b-4e36-a996-d793284a4021','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Ade Sugianto.','2026-06-28 11:01:45','unread','2026-06-28 11:01:45','2026-06-28 11:01:45'),('8c8018b6-b4ee-40e7-94b0-854d8147d3e9','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','hendrik saepudin baru saja mendaftar sebagai Calon Anggota.','2026-06-28 09:12:41','unread','2026-06-28 09:12:41','2026-06-28 09:12:41'),('8cc5833c-956d-49a0-ab38-004662df3dff','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 18:16:21','unread','2026-06-20 18:16:21','2026-06-20 18:16:21'),('8d0c5146-ea21-49ed-8a19-7bb0e15dbc13','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testtiga.','2026-07-10 05:37:04','unread','2026-07-10 05:37:04','2026-07-10 05:37:04'),('8d31de24-dba0-447a-8efe-dd9f9e47f920','df603033-5528-4dde-885f-407c1015e488','Selamat Datang!','Halo testsatu, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-07-25 01:16:00','unread','2026-07-25 01:16:00','2026-07-25 01:16:00'),('8dc64107-0e35-4106-b91d-a1f97ca79b6e','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','Budi Santoso telah mengirimkan data pendaftaran.','2026-06-27 20:52:55','unread','2026-06-27 20:52:55','2026-06-27 20:52:55'),('8de5ec41-f33c-47bd-854e-7ec8cf0835d6','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testtiga.','2026-07-04 14:20:08','unread','2026-07-04 14:20:08','2026-07-04 14:20:08'),('8df21035-0c72-4b9f-815e-16b285dc7cd3','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari Avhan hadi.','2026-06-27 23:37:49','unread','2026-06-27 23:37:49','2026-06-27 23:37:49'),('8e0d9afd-0fa1-43ce-9fa6-2e07287afb7f','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 13 tagihan telah dibuat.','2026-07-22 11:38:07','unread','2026-07-22 11:38:07','2026-07-22 11:38:07'),('8e1a47a9-7ab9-47a0-b494-84baf860379c','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembayaran Berhasil!','Setoran sebesar Rp 700.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 10:13:40','unread','2026-06-28 10:13:40','2026-06-28 10:13:40'),('8e29ab6b-07d9-4ff0-99c0-885b29e175a7','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:46:58','unread','2026-06-18 23:46:58','2026-06-18 23:46:58'),('8e6b8bcf-893d-44df-91f8-f19253680378','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 14:50:57','unread','2026-06-16 14:50:57','2026-06-16 14:50:57'),('8e6d0da9-1619-428a-9b36-4c30a4cbd4e2','d7570642-5cd5-4403-8085-66bb3927b76b','Pembayaran Berhasil!','Setoran sebesar Rp 2.900.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 10:57:43','unread','2026-06-28 10:57:43','2026-06-28 10:57:43'),('8ec5daa5-0387-42e0-98ea-099700a4c3ad','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 01:16:32','unread','2026-06-28 01:16:32','2026-06-28 01:16:32'),('8ef6d3b1-c423-4e12-a6bf-84bc768523a8','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','iqbal fahmy telah mengirimkan data pendaftaran.','2026-07-25 01:17:08','unread','2026-07-25 01:17:08','2026-07-25 01:17:08'),('8f6a7350-3bba-4140-bcd8-4fb0cd0cd7b1','8c6f7722-c817-40c7-ba80-982b224f08c2','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 11:35:12','unread','2026-06-28 11:35:12','2026-06-28 11:35:12'),('8f6d6bb4-8af6-4e8a-a1c0-f7c5e9c32f23','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 00:25:52','unread','2026-06-20 00:25:52','2026-06-20 00:25:52'),('8fce39e0-8b03-40a7-a3e6-d66f0cfeb0be','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembayaran Berhasil!','Setoran sebesar Rp 1.500.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 23:55:21','unread','2026-06-27 23:55:21','2026-06-27 23:55:21'),('8fefc709-37bb-4193-ad5f-08598febb5a0','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','avhanhb baru saja mendaftar sebagai Calon Anggota.','2026-07-12 22:35:34','unread','2026-07-12 22:35:34','2026-07-12 22:35:34'),('913c1d13-b3d7-4794-8739-395983dc6a04','8bd8e1a5-ec5b-4963-922c-9a5c724fb906','Tugas Baru','Verifikasi pendaftaran: Mohamad Fahmy Iqbal ','2026-07-19 08:12:47','unread','2026-07-19 08:12:47','2026-07-19 08:12:47'),('913cc72c-bb0f-4b4a-ae77-d3c45a3aa0e6','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-27 22:57:40','unread','2026-06-27 22:57:40','2026-06-27 22:57:40'),('91e74813-d90b-475b-8e17-46d6e41667f0','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 21:35:29','unread','2026-06-20 21:35:29','2026-06-20 21:35:29'),('91ecd65c-3fe3-4cb7-9e76-bd9fad3a2a26','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-12 23:49:27','unread','2026-07-12 23:49:27','2026-07-12 23:49:27'),('91ee1b1e-d27a-41a8-a482-13b8ebcaab9c','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 23:59:33','unread','2026-06-20 23:59:33','2026-06-20 23:59:33'),('9210a6ff-f740-47b1-9307-755609eab511','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari Avhan hadi.','2026-06-27 23:37:07','unread','2026-06-27 23:37:07','2026-06-27 23:37:07'),('9235deef-320a-403f-be44-6e68727bc6e7','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 17:13:44','unread','2026-06-20 17:13:44','2026-06-20 17:13:44'),('9256fe71-69a4-4e28-a2c2-7bdcfc375d49','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 19:18:44','unread','2026-06-20 19:18:44','2026-06-20 19:18:44'),('93996c5f-320c-4f6f-b0f8-ffc3d4b437fb','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari Mohamad Fahmy Iqbal.','2026-06-27 06:39:15','unread','2026-06-27 06:39:15','2026-06-27 06:39:15'),('93997e5e-2db2-453c-8963-cf78201e5080','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 13:31:50','unread','2026-06-28 13:31:50','2026-06-28 13:31:50'),('9480a895-50dc-4658-8765-245d9f8913bd','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 17:54:10','unread','2026-06-20 17:54:10','2026-06-20 17:54:10'),('94fbd35d-14c0-494e-a866-dafd15402da4','d33889c0-4bf9-4745-909b-a9a726181785','Pembayaran Berhasil!','Setoran sebesar Rp 4.040.444 telah diterima. Keanggotaan Anda kini aktif.','2026-07-10 05:45:19','unread','2026-07-10 05:45:19','2026-07-10 05:45:19'),('9568df27-e96a-4c00-a36f-c783b2eaedbe','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-12 23:49:03','unread','2026-07-12 23:49:03','2026-07-12 23:49:03'),('956d6dc5-c488-44af-bb3c-f5ce7b42ca7d','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 17:54:20','unread','2026-06-20 17:54:20','2026-06-20 17:54:20'),('957d6410-1500-4c3c-bfdc-284af4dedfa1','5880c3cd-d403-40dd-997b-319629799cab','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 12 tagihan telah dibuat.','2026-06-28 14:49:53','read','2026-06-28 14:49:53','2026-07-04 06:46:35'),('958619cd-4116-44ac-a116-50475836bb1b','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 15:42:24','unread','2026-06-16 15:42:24','2026-06-16 15:42:24'),('95c8fb88-66b3-4d23-85f5-3a48c890ba6b','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-27 21:36:02','unread','2026-06-27 21:36:02','2026-06-27 21:36:02'),('95ed0da7-b432-4820-b21f-c942a70c71c7','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan savings withdrawal','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 10:48:17','unread','2026-06-28 10:48:17','2026-06-28 10:48:17'),('96038a07-5c25-410a-aa5d-5a3e95630919','8c00e514-663c-4f3d-97ff-8520273d923e','Update Persetujuan savings withdrawal','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-19 08:45:36','unread','2026-07-19 08:45:36','2026-07-19 08:45:36'),('9612eb5b-2555-4a27-9f24-cfeb7844e248','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari testtiga.','2026-07-10 05:24:43','unread','2026-07-10 05:24:43','2026-07-10 05:24:43'),('9631e997-03cc-497b-8a1c-35a4b8ec7040','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 21:52:50','unread','2026-06-18 21:52:50','2026-06-18 21:52:50'),('968c7213-b612-4888-8931-7c8909de66c6','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-27 21:35:17','unread','2026-06-27 21:35:17','2026-06-27 21:35:17'),('96a512e6-dae1-4515-aea2-f84ed39792f8','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','test telah mengirimkan data pendaftaran.','2026-07-04 13:52:18','unread','2026-07-04 13:52:18','2026-07-04 13:52:18'),('96b356e6-59cc-4a7e-94c2-96e756343b07','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari testtiga.','2026-07-11 13:02:23','unread','2026-07-11 13:02:23','2026-07-11 13:02:23'),('96ca0435-41d6-4ff8-8b5f-763ff22290e3','d7570642-5cd5-4403-8085-66bb3927b76b','Pengajuan Arisan','Pengajuan bergabung grup arisan Arisan Umrah 2 (9) berhasil dikirim dan sedang menunggu persetujuan.','2026-06-28 14:00:51','unread','2026-06-28 14:00:51','2026-06-28 14:00:51'),('970513c7-412d-4a1a-9c63-9faa247d44d3','693e2950-6039-45d3-b8f6-6ed5b2983814','Pembayaran Berhasil!','Setoran sebesar Rp 3.004.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-21 15:59:37','unread','2026-07-21 15:59:37','2026-07-21 15:59:37'),('972ace13-a30f-413e-95d0-c43ff4c4fc48','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari mohamadfahmyiqbal.','2026-07-22 13:34:51','unread','2026-07-22 13:34:51','2026-07-22 13:34:51'),('97dcd018-3d7a-46aa-83b7-52bd9c4c439b','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari Mohamad Fahmy Iqbal.','2026-06-19 22:26:35','unread','2026-06-19 22:26:35','2026-06-19 22:26:35'),('97f49987-e51f-4e63-ad0a-eb88bbad3fac','d33889c0-4bf9-4745-909b-a9a726181785','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 13 tagihan telah dibuat.','2026-07-10 05:29:23','unread','2026-07-10 05:29:23','2026-07-10 05:29:23'),('98210175-75c4-4cc9-8a81-9802becf8e2e','d33889c0-4bf9-4745-909b-a9a726181785','Penarikan Disetujui!','Penarikan sebesar Rp 50.000 telah disetujui dan sedang diproses.','2026-07-10 05:25:12','unread','2026-07-10 05:25:12','2026-07-10 05:25:12'),('98653515-774c-4faf-a7f6-b38bf3a42837','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari Avhan hadi.','2026-06-27 21:04:39','unread','2026-06-27 21:04:39','2026-06-27 21:04:39'),('98a067df-23ea-4afc-84c6-066fb9fd6391','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 22:56:54','unread','2026-06-27 22:56:54','2026-06-27 22:56:54'),('98ca4592-9ab3-4480-844b-a46b685fe36f','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembayaran Berhasil!','Setoran sebesar Rp 19.000.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 22:31:06','unread','2026-06-27 22:31:06','2026-06-27 22:31:06'),('991004df-b89b-4c39-b7e1-18ea53e9eefd','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 18:05:40','unread','2026-06-20 18:05:40','2026-06-20 18:05:40'),('9968bc7c-a8f0-44e1-8d05-b1625f1aa912','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 18:00:54','unread','2026-06-20 18:00:54','2026-06-20 18:00:54'),('999d5619-23d1-40f0-95fd-f7302ed2b9fd','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-28 14:03:00','unread','2026-06-28 14:03:00','2026-06-28 14:03:00'),('99d828e6-fb8c-4dbe-ae84-7adbeed3b4f7','8bd8e1a5-ec5b-4963-922c-9a5c724fb906','Pembayaran Berhasil!','Setoran sebesar Rp 25.200.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 14:18:04','unread','2026-06-28 14:18:04','2026-06-28 14:18:04'),('99d98653-edaa-4dd5-bab7-ebfcc05dd82a','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari hendrik saepudin.','2026-06-28 11:20:23','unread','2026-06-28 11:20:23','2026-06-28 11:20:23'),('9a1c906b-c7c8-4cab-9833-fbcdea2c264c','d7570642-5cd5-4403-8085-66bb3927b76b','Pembayaran Berhasil!','Setoran sebesar Rp 100.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 12:52:59','unread','2026-06-28 12:52:59','2026-06-28 12:52:59'),('9ad648cd-2fc8-4c2e-b11b-b52e11ec92e1','5880c3cd-d403-40dd-997b-319629799cab','Pemesanan Sukuk Disetujui','Pemesanan sukuk Anda telah disetujui sepenuhnya oleh seluruh pengurus.','2026-06-27 17:49:08','unread','2026-06-27 17:49:08','2026-06-27 17:49:08'),('9b033c21-ffcd-4002-a8b6-fa78e7995c96','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Update Persetujuan savings withdrawal','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-12 23:01:01','unread','2026-07-12 23:01:01','2026-07-12 23:01:01'),('9b60ca93-2a80-4697-b157-db816c4d80d9','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 19:29:58','unread','2026-06-20 19:29:58','2026-06-20 19:29:58'),('9bab0cde-4769-489f-8d24-8bf7820bfa94','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 14:30:21','unread','2026-06-16 14:30:21','2026-06-16 14:30:21'),('9bf43b06-f5ca-444f-bdb1-115be522c9f3','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari Mohamad Fahmy Iqbal.','2026-06-27 06:03:30','unread','2026-06-27 06:03:30','2026-06-27 06:03:30'),('9c3eefb2-d782-49f6-87f9-c3d2b66b768a','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan member saving targets Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-11 13:03:09','unread','2026-07-11 13:03:09','2026-07-11 13:03:09'),('9c535ed2-15a8-46bd-aaf0-da695e9c8b67','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 19:22:24','unread','2026-06-20 19:22:24','2026-06-20 19:22:24'),('9c7e0fe7-04d0-4d64-bf9f-33376731fcd0','8bd8e1a5-ec5b-4963-922c-9a5c724fb906','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 14:04:09','unread','2026-06-28 14:04:09','2026-06-28 14:04:09'),('9c9a0633-50c5-4c09-8a59-43f70f402071','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:50:19','unread','2026-06-19 00:50:19','2026-06-19 00:50:19'),('9cb17544-773c-440c-9186-3e82ad8eb84e','693e2950-6039-45d3-b8f6-6ed5b2983814','Update Persetujuan savings withdrawal','Langkah \"Pencairan Bendahara\" disetujui. Menunggu verifikasi berikutnya.','2026-07-21 15:37:18','unread','2026-07-21 15:37:18','2026-07-21 15:37:18'),('9cdc1fd0-c203-4ee0-9a2e-1f65ad19112d','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 19:22:14','unread','2026-06-20 19:22:14','2026-06-20 19:22:14'),('9ce7e979-d03f-47b2-9105-24def3238718','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:11:47','unread','2026-06-19 00:11:47','2026-06-19 00:11:47'),('9d47809f-f15e-419a-81b4-6e36003a8b7e','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan tabungan withdrawals','Langkah \"Persetujuan\" disetujui. Menunggu verifikasi berikutnya.','2026-07-11 13:09:14','unread','2026-07-11 13:09:14','2026-07-11 13:09:14'),('9d4f962a-ff92-4af1-a0c5-a32ed89bd6b7','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari avhanhb.','2026-07-12 23:01:01','unread','2026-07-12 23:01:01','2026-07-12 23:01:01'),('9d57380b-c2ae-42e4-b2de-ab9e099f4cce','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 21:35:50','unread','2026-06-20 21:35:50','2026-06-20 21:35:50'),('9d7b957d-62b3-4f80-ab8d-f4024aea2420','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-10 05:53:10','unread','2026-07-10 05:53:10','2026-07-10 05:53:10'),('9db5252d-de74-471d-8230-d4adccb14170','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan Pembiayaan','Pengajuan Elektronik (laptop) senilai Rp 3.500.000 telah berhasil dikirim.','2026-07-10 05:27:20','unread','2026-07-10 05:27:20','2026-07-10 05:27:20'),('9ddca2cc-f9dd-49e9-96da-2aec5f211430','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan Sukuk','Langkah persetujuan oleh Ketua telah berhasil. Menunggu verifikasi lainnya.','2026-06-28 00:03:29','unread','2026-06-28 00:03:29','2026-06-28 00:03:29'),('9de6fb4e-7697-4eae-bc5d-9e3dde9bdf36','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','mohamadfahmyiqbal baru saja mendaftar sebagai Calon Anggota.','2026-07-22 06:01:23','unread','2026-07-22 06:01:23','2026-07-22 06:01:23'),('9dfdfe6e-87e5-44a3-985b-6d3e4cbe2417','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan member saving targets Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-27 23:38:48','unread','2026-06-27 23:38:48','2026-06-27 23:38:48'),('9e151b00-acf9-4712-a56a-9a7633026585','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 2.016.000 telah diterima via sinkronisasi otomatis.','2026-06-20 17:59:12','unread','2026-06-20 17:59:12','2026-06-20 17:59:12'),('9e4b87db-9d5e-4a09-85ac-52a2f10e4660','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari Avhan hadi.','2026-06-27 23:38:07','unread','2026-06-27 23:38:07','2026-06-27 23:38:07'),('9e708d3d-fc7b-43a3-8857-bb2ed7c42472','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 14:21:20','unread','2026-06-16 14:21:20','2026-06-16 14:21:20'),('9e98b566-69fa-477d-b858-d2aabb1d8365','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 694.445 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 06:39:49','unread','2026-06-27 06:39:49','2026-06-27 06:39:49'),('9ec5271c-2596-4a77-a704-2cdb24030411','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 23:52:59','unread','2026-06-27 23:52:59','2026-06-27 23:52:59'),('9ed1dbdb-f2a2-4644-bf41-7afc6c72869c','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:39:28','unread','2026-06-19 00:39:28','2026-06-19 00:39:28'),('9f212ed5-2200-4191-bbfa-6afa139cbebd','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testtiga.','2026-07-10 05:28:31','unread','2026-07-10 05:28:31','2026-07-10 05:28:31'),('9f534d48-cf4f-4b28-99a2-f44351322536','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari avhanhb.','2026-07-12 23:01:26','unread','2026-07-12 23:01:26','2026-07-12 23:01:26'),('9f6508e6-ba68-40b9-8a30-9b04b77eee8e','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 17:39:37','unread','2026-06-20 17:39:37','2026-06-20 17:39:37'),('9fc5a8fb-0390-47ab-8626-ac5da3473757','5880c3cd-d403-40dd-997b-319629799cab','Arisan Disetujui!','Selamat! Pengajuan arisan Anda telah disetujui. Silahkan cek tagihan untuk setoran pertama.','2026-07-12 23:49:26','unread','2026-07-12 23:49:26','2026-07-12 23:49:26'),('a047ee06-906e-43ad-885a-8397351e6160','5e714c26-43e6-44a0-8a1e-def3f3290190','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-25 01:13:19','unread','2026-07-25 01:13:19','2026-07-25 01:13:19'),('a06067cc-e328-485f-8269-202c7cb9a057','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan member saving targets Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-27 18:07:02','unread','2026-06-27 18:07:02','2026-06-27 18:07:02'),('a0c9d019-7bf3-4b93-804f-63d6a335e500','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-20 10:41:26','unread','2026-07-20 10:41:26','2026-07-20 10:41:26'),('a0d5c963-58da-4cdb-ba96-7e9f252464de','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari Ade Sugianto.','2026-06-28 10:03:10','unread','2026-06-28 10:03:10','2026-06-28 10:03:10'),('a0d6134e-d890-481e-9221-83a7ee42fca3','693e2950-6039-45d3-b8f6-6ed5b2983814','Pembayaran Berhasil!','Setoran sebesar Rp 54.000.000 telah diterima via sinkronisasi otomatis.','2026-07-21 16:16:06','unread','2026-07-21 16:16:06','2026-07-21 16:16:06'),('a12240e6-105c-4df2-be24-89ffe710ff7c','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','Budi Santoso baru saja mendaftar sebagai Calon Anggota.','2026-07-23 10:33:42','unread','2026-07-23 10:33:42','2026-07-23 10:33:42'),('a130716a-2f4e-4747-a8ff-ef4f8bea1246','0a7fd51a-6494-4202-89b6-94641b105fbb','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-22 11:38:08','unread','2026-07-22 11:38:08','2026-07-22 11:38:08'),('a13a4286-cff3-4e5b-97c1-793dedf74872','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','testDua baru saja mendaftar sebagai Calon Anggota.','2026-06-19 21:42:27','read','2026-06-19 21:42:27','2026-06-28 09:06:46'),('a14b5aa4-5100-47ba-8b58-24a0f1f980a5','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-27 22:56:21','unread','2026-06-27 22:56:21','2026-06-27 22:56:21'),('a216ea96-ac5d-458c-bff8-7617c752db2e','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 21:35:40','unread','2026-06-20 21:35:40','2026-06-20 21:35:40'),('a23e15ed-89cd-4bfe-a07a-62098a575289','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 224.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-22 06:09:24','unread','2026-07-22 06:09:24','2026-07-22 06:09:24'),('a24883a0-164b-4fa0-b585-e8a500888b1f','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari hendrik saepudin.','2026-07-12 23:34:54','unread','2026-07-12 23:34:54','2026-07-12 23:34:54'),('a282f873-5d7a-486b-8f87-696feb0e61dc','0a7fd51a-6494-4202-89b6-94641b105fbb','Pendaftaran Berhasil','Data Anda sedang diverifikasi.','2026-07-22 06:03:09','unread','2026-07-22 06:03:09','2026-07-22 06:03:09'),('a299969c-61b6-4bc7-9b2d-2589438f0a53','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Tabungan Berhasil','Pengajuan Tabungan Qurban senilai Rp 4.800.000 telah diproses.','2026-06-27 23:36:31','unread','2026-06-27 23:36:31','2026-06-27 23:36:31'),('a29a8944-81e6-4208-b76f-d10c8aa18db7','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','Agus Riyanta baru saja mendaftar sebagai Calon Anggota.','2026-06-17 19:01:54','unread','2026-06-17 19:01:54','2026-06-17 19:01:54'),('a2cec186-0640-4d57-a98b-9f250063af4e','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembayaran Berhasil!','Setoran sebesar Rp 500.000 telah diterima via sinkronisasi otomatis.','2026-06-28 10:22:37','unread','2026-06-28 10:22:37','2026-06-28 10:22:37'),('a2ef5e82-0d52-4e3a-a7ad-13ad0dc341ad','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari TestDua.','2026-07-21 15:57:00','unread','2026-07-21 15:57:00','2026-07-21 15:57:00'),('a306a2a6-3bff-438a-9f00-05801e1059bf','d33889c0-4bf9-4745-909b-a9a726181785','Pembayaran Berhasil!','Setoran sebesar Rp 504.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-11 09:20:45','unread','2026-07-11 09:20:45','2026-07-11 09:20:45'),('a3160249-90ab-445c-977a-7343add3bb73','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 3.928.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-20 17:16:54','unread','2026-06-20 17:16:54','2026-06-20 17:16:54'),('a34b95e1-cdd9-401d-861e-bf2ba30aabb5','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 448.000 telah diterima via sinkronisasi otomatis.','2026-06-20 17:15:10','unread','2026-06-20 17:15:10','2026-06-20 17:15:10'),('a34c04c7-a3ec-463d-91ad-2756413b2096','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','testtiga baru saja mendaftar sebagai Calon Anggota.','2026-07-04 06:14:35','unread','2026-07-04 06:14:35','2026-07-04 06:14:35'),('a372841d-f85c-483e-a5af-976418541424','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari Mohamad Fahmy Iqbal.','2026-06-19 23:36:13','unread','2026-06-19 23:36:13','2026-06-19 23:36:13'),('a3db6f66-3522-4da9-8fbb-1070f552ee3c','d33889c0-4bf9-4745-909b-a9a726181785','Pembayaran Berhasil!','Setoran sebesar Rp 1.004.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-04 15:39:29','unread','2026-07-04 15:39:29','2026-07-04 15:39:29'),('a3f38152-f393-4fc8-8faa-17e8bd35f232','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembayaran Berhasil!','Setoran sebesar Rp 1.754.534 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 11:11:59','unread','2026-06-28 11:11:59','2026-06-28 11:11:59'),('a415e502-978e-4dfa-ab01-c02a4576c137','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 15:59:19','unread','2026-06-16 15:59:19','2026-06-16 15:59:19'),('a4521b95-bb2f-422a-8066-7821ba065af0','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','test telah mengirimkan data pendaftaran.','2026-06-16 11:36:55','unread','2026-06-16 11:36:55','2026-06-16 11:36:55'),('a47948c2-34b9-4833-85b0-7e6f904aecff','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Pembayaran Berhasil!','Setoran sebesar Rp 1.500.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-13 02:24:45','unread','2026-06-13 02:24:45','2026-06-13 02:24:45'),('a4bca106-ad6c-4c1e-9f4a-79c05e707a18','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','Septiawan Wijaya Kusuma baru saja mendaftar sebagai Calon Anggota.','2026-07-15 12:35:23','unread','2026-07-15 12:35:23','2026-07-15 12:35:23'),('a50b9333-8b05-45fb-b8fb-c3b4ae5efe4c','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-13 13:01:13','unread','2026-06-13 13:01:13','2026-06-13 13:01:13'),('a526fb61-2c19-4644-9854-5afe302db1fb','5880c3cd-d403-40dd-997b-319629799cab','Pemesanan Sukuk Disetujui','Pemesanan sukuk Anda telah disetujui sepenuhnya oleh seluruh pengurus.','2026-06-27 13:17:47','unread','2026-06-27 13:17:47','2026-06-27 13:17:47'),('a55c0f92-c8f1-46ba-8f96-bc45e51e38b7','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 17:45:05','unread','2026-06-20 17:45:05','2026-06-20 17:45:05'),('a561519f-eb0e-4b63-b47d-bfbe7f34d0ce','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 224.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-22 06:14:18','unread','2026-07-22 06:14:18','2026-07-22 06:14:18'),('a5de5141-ac97-41e8-a914-7a6866eb5772','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:28:38','unread','2026-06-18 23:28:38','2026-06-18 23:28:38'),('a6174b12-7e79-4f2a-83d9-74e6cf1fc2e1','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 4.120.004 telah diterima via sinkronisasi otomatis.','2026-06-20 17:52:40','unread','2026-06-20 17:52:40','2026-06-20 17:52:40'),('a61b685e-fdfa-42a7-9692-2dd26f3c6eb4','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 01:57:52','unread','2026-06-28 01:57:52','2026-06-28 01:57:52'),('a65e5492-36de-4753-abe7-b31725791852','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan member saving targets','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 23:37:07','unread','2026-06-27 23:37:07','2026-06-27 23:37:07'),('a71d23ed-72ca-41e3-a2bd-91f69e241846','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari TestDua.','2026-07-21 15:57:25','unread','2026-07-21 15:57:25','2026-07-21 15:57:25'),('a7275abc-c013-42e4-a5a5-7f34665edce8','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Anggota Baru','Mohamad Fahmy Iqbal telah mengirimkan data pendaftaran.','2026-06-19 22:12:10','unread','2026-06-19 22:12:10','2026-06-19 22:12:10'),('a73ce68d-8b1d-4e3b-87c1-24cd607a734e','8bd8e1a5-ec5b-4963-922c-9a5c724fb906','Pembayaran Berhasil!','Setoran sebesar Rp 2.100.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 14:07:13','unread','2026-06-28 14:07:13','2026-06-28 14:07:13'),('a7412cac-ad5f-4809-a4c9-5489d41b76ac','c8776dce-0b66-40ef-8be8-838f939b8932','Pengajuan members Ditolak','Pengajuan ditolak. Alasan: Ditolak oleh Pengawas','2026-06-15 21:41:21','read','2026-06-15 21:41:21','2026-06-15 21:43:58'),('a7935f41-6970-4f08-8f58-4d64d1ec68c5','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:11:57','unread','2026-06-19 00:11:57','2026-06-19 00:11:57'),('a79dd47a-74fa-4ead-9906-e07f9bda1dbf','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Pembiayaan','Pengajuan Pendanaan Syariah UMKM (dsfdfsd) senilai Rp 5.000.000 telah berhasil dikirim.','2026-06-27 16:59:59','unread','2026-06-27 16:59:59','2026-06-27 16:59:59'),('a7f72996-db74-4bc3-8481-d9a79ea1f928','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 3.004.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-22 13:29:52','unread','2026-07-22 13:29:52','2026-07-22 13:29:52'),('a804245a-f74b-40b6-91b8-73773e7de489','0a7fd51a-6494-4202-89b6-94641b105fbb','Penarikan Disetujui!','Penarikan sebesar Rp 50.000 telah disetujui dan sedang diproses.','2026-07-22 10:58:43','unread','2026-07-22 10:58:43','2026-07-22 10:58:43'),('a8305a96-4afc-4d1f-9c72-de4f67367c74','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:07:06','unread','2026-06-18 23:07:06','2026-06-18 23:07:06'),('a8428d35-6fd9-4d7b-86a1-48b1726b2a63','d33889c0-4bf9-4745-909b-a9a726181785','Pembayaran Berhasil!','Setoran sebesar Rp 5.504.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-11 13:04:27','unread','2026-07-11 13:04:27','2026-07-11 13:04:27'),('a84442bf-b8dc-48f7-8c27-ce5a9078ecde','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 21:27:42','unread','2026-06-18 21:27:42','2026-06-18 21:27:42'),('a8559217-a5f2-4e48-9d3f-802a77d3d152','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 18:16:07','unread','2026-06-20 18:16:07','2026-06-20 18:16:07'),('a868ddc4-7c62-48c1-ae7b-945d8d93cc09','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:05:19','unread','2026-06-19 00:05:19','2026-06-19 00:05:19'),('a8a21900-2dfe-424c-a90d-15dbcb7a9d15','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 16:06:48','unread','2026-06-16 16:06:48','2026-06-16 16:06:48'),('a8f26e8e-1b70-4974-bb7d-f562009d1d26','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pembayaran Berhasil!','Setoran sebesar Rp 51.480.000 telah diterima via sinkronisasi otomatis.','2026-07-12 23:49:57','unread','2026-07-12 23:49:57','2026-07-12 23:49:57'),('a90041be-a988-4b9a-ba52-1ce42fc82a91','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan Tabungan Disetujui!','Pengajuan Tabungan Anda telah disetujui.','2026-06-27 23:38:28','unread','2026-06-27 23:38:28','2026-06-27 23:38:28'),('a968e522-5172-4958-a424-4bbceee2fa02','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 19:22:37','unread','2026-06-20 19:22:37','2026-06-20 19:22:37'),('a9773dad-6d97-48e3-b295-3ba89ee8fe7b','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-27 22:57:03','unread','2026-06-27 22:57:03','2026-06-27 22:57:03'),('a9cab347-26a0-4a9b-bfca-9a146bcb1573','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 16:50:56','unread','2026-06-20 16:50:56','2026-06-20 16:50:56'),('aa257566-9d7e-42f0-a5a6-71c3d46691fa','f98594e5-d43c-4acb-8052-b108c36c79cc','Selamat Datang!','Halo Avhan hadi, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-06-18 21:31:33','unread','2026-06-18 21:31:33','2026-06-18 21:31:33'),('aa2d1949-aa0c-45dc-a011-5bb2431f9e98','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari TestDua.','2026-07-21 16:13:48','unread','2026-07-21 16:13:48','2026-07-21 16:13:48'),('aaddb8d3-ebe5-438b-bd8d-a4d82c7dbe03','8c6f7722-c817-40c7-ba80-982b224f08c2','Pengajuan Tabungan Berhasil','Pengajuan Tabungan Qurban 2 senilai Rp 7.000.000 telah diproses.','2026-06-28 14:25:55','unread','2026-06-28 14:25:55','2026-06-28 14:25:55'),('ab434cfd-c67a-4438-b378-847b6036386f','8bd8e1a5-ec5b-4963-922c-9a5c724fb906','Tugas Baru','Verifikasi pendaftaran: Mohamad Fahmy Iqbal ','2026-07-21 15:06:33','unread','2026-07-21 15:06:33','2026-07-21 15:06:33'),('ab75b1a6-0468-4654-b161-4e1578cbf37c','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','Ade Sugianto baru saja mendaftar sebagai Calon Anggota.','2026-06-17 18:56:46','unread','2026-06-17 18:56:46','2026-06-17 18:56:46'),('ab7645d9-6c06-4fd3-9485-e09c2b02c5c6','0a7fd51a-6494-4202-89b6-94641b105fbb','Pengajuan Pembiayaan','Pengajuan Elektronik (Lenovo) senilai Rp 3.500.000 telah berhasil dikirim.','2026-07-22 11:28:45','unread','2026-07-22 11:28:45','2026-07-22 11:28:45'),('abc02fb0-87d8-41a5-aad7-15605fc77fe6','c8776dce-0b66-40ef-8be8-838f939b8932','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-15 22:39:17','unread','2026-06-15 22:39:17','2026-06-15 22:39:17'),('abe06c60-b0b4-4d9f-b931-8324d3239d25','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-15 23:15:44','unread','2026-06-15 23:15:44','2026-06-15 23:15:44'),('abe64306-12aa-48e5-9066-82f5d2e994d5','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testtiga.','2026-07-10 05:52:04','unread','2026-07-10 05:52:04','2026-07-10 05:52:04'),('abebef44-0f82-4841-ab24-2008879a7aae','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari Avhan hadi.','2026-06-27 23:37:25','unread','2026-06-27 23:37:25','2026-06-27 23:37:25'),('abf6a5b7-74a3-4d4b-bbf8-bb5a8ec94446','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari avhanhb.','2026-07-13 07:43:31','unread','2026-07-13 07:43:31','2026-07-13 07:43:31'),('ac0323ac-ab35-4ef6-8d04-c21c7741ee95','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:36:50','unread','2026-06-19 00:36:50','2026-06-19 00:36:50'),('ac445045-fb67-4861-901a-e8cfcb10a9fc','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-27 22:18:55','unread','2026-06-27 22:18:55','2026-06-27 22:18:55'),('acb2bb29-a3bf-4a85-a18c-6150d8978176','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-12 22:54:37','unread','2026-07-12 22:54:37','2026-07-12 22:54:37'),('acc52110-4ddc-4352-97ba-0c3cd1ef1c3f','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','Budi Santoso baru saja mendaftar sebagai Calon Anggota.','2026-06-27 20:48:28','unread','2026-06-27 20:48:28','2026-06-27 20:48:28'),('acc72cb0-db28-45af-b406-10e97312772b','a6250429-f040-4613-9379-3abcaae2d084','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-14 21:26:06','unread','2026-06-14 21:26:06','2026-06-14 21:26:06'),('acd24cf6-0675-4942-abf8-ddbf227f9035','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-27 23:17:02','unread','2026-06-27 23:17:02','2026-06-27 23:17:02'),('ad1321c6-d571-4391-848a-c56c49c141c4','8c6f7722-c817-40c7-ba80-982b224f08c2','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 14:03:50','unread','2026-06-28 14:03:50','2026-06-28 14:03:50'),('ad5dcd3e-a5df-4f89-8d80-6eedcb0b58a2','5880c3cd-d403-40dd-997b-319629799cab','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 3 tagihan telah dibuat.','2026-06-20 21:35:50','unread','2026-06-20 21:35:50','2026-06-20 21:35:50'),('adb1d87a-cfb8-4646-ab4e-4a4a6bc261b9','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:52:22','unread','2026-06-18 23:52:22','2026-06-18 23:52:22'),('adeb5891-b3c3-4d23-a30c-41dbb60d973c','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan tabungan withdrawals','Menunggu verifikasi Anda: Pengajuan tabungan withdrawals dari testtiga.','2026-07-11 13:08:57','unread','2026-07-11 13:08:57','2026-07-11 13:08:57'),('aeaca2f4-8da8-458b-bbe3-a1b93db5b2f8','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari Budi Santoso.','2026-06-28 09:52:55','unread','2026-06-28 09:52:55','2026-06-28 09:52:55'),('af2027e7-4d15-49d9-95e8-9b2bc62428d4','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:31:39','unread','2026-06-18 23:31:39','2026-06-18 23:31:39'),('af256d42-7d25-45c5-ac11-f36d483a3ea0','43643359-0f59-4ea4-bb6d-e93505733d4a','Pembayaran Berhasil!','Setoran sebesar Rp 724.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-25 01:14:03','unread','2026-07-25 01:14:03','2026-07-25 01:14:03'),('af308cf4-9b89-49a8-8a00-6ba9f889bc6a','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 22:08:27','unread','2026-06-18 22:08:27','2026-06-18 22:08:27'),('af5f194d-7be7-4cc9-be20-abd8fab07059','c8776dce-0b66-40ef-8be8-838f939b8932','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 13 tagihan telah dibuat.','2026-06-15 23:22:04','unread','2026-06-15 23:22:04','2026-06-15 23:22:04'),('af940d7b-c794-4346-8500-980bc5d412e7','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan savings withdrawal','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-22 06:22:55','unread','2026-07-22 06:22:55','2026-07-22 06:22:55'),('b02d5cad-d486-465e-9ba8-9835840400c8','197a45d6-d0e3-4d7e-a0d8-938a9180a7bb','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-11 05:49:17','unread','2026-06-11 05:49:17','2026-06-11 05:49:17'),('b071ba2c-0efa-47b0-868f-d14814045ee6','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Anggota Baru','iqbal fahmy telah mengirimkan data pendaftaran.','2026-07-25 00:40:17','unread','2026-07-25 00:40:17','2026-07-25 00:40:17'),('b0928d0e-6b26-45ff-a6dc-e5b2955475f2','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari Mohamad Fahmy Iqbal.','2026-06-20 00:00:37','unread','2026-06-20 00:00:37','2026-06-20 00:00:37'),('b1095085-7910-41a6-a6dd-90afc6cea7f4','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','testTiga baru saja mendaftar sebagai Calon Anggota.','2026-06-14 09:18:46','read','2026-06-14 09:18:46','2026-06-28 09:06:46'),('b154004e-3c16-4d4b-b8dc-1eab1d557d1c','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:22:09','unread','2026-06-19 00:22:09','2026-06-19 00:22:09'),('b17a11b6-bdfb-4050-b3c9-496712c8a610','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 1.504.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-22 11:39:34','unread','2026-07-22 11:39:34','2026-07-22 11:39:34'),('b1b73cce-7991-45d2-9197-f91393b38073','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 19:31:48','unread','2026-06-20 19:31:48','2026-06-20 19:31:48'),('b26c9344-76c8-4358-88b9-08051dd77bd5','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-07-12 23:48:39','unread','2026-07-12 23:48:39','2026-07-12 23:48:39'),('b26d7058-df58-492e-84c2-4184148f1fd4','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','testsatu baru saja mendaftar sebagai Calon Anggota.','2026-07-25 01:16:00','unread','2026-07-25 01:16:00','2026-07-25 01:16:00'),('b2882049-f848-4669-b500-79e6505f4926','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan savings withdrawal','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-22 07:47:48','unread','2026-07-22 07:47:48','2026-07-22 07:47:48'),('b28d48a5-6d10-4b81-852e-de7795c69007','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari hendrik saepudin.','2026-06-28 09:58:01','unread','2026-06-28 09:58:01','2026-06-28 09:58:01'),('b2afbb83-acf2-44f6-bf58-3e52d1760ba8','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testDua.','2026-07-20 10:43:48','unread','2026-07-20 10:43:48','2026-07-20 10:43:48'),('b2c59e39-c71f-47ac-a6d8-8b67fd76c9b1','a6250429-f040-4613-9379-3abcaae2d084','Selamat Datang!','Halo testsepuly, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-06-14 20:24:29','unread','2026-06-14 20:24:29','2026-06-14 20:24:29'),('b2fbd3da-e5e9-4158-bfd3-be3eec3743ee','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','testTigaa telah mengirimkan data pendaftaran.','2026-06-14 09:39:07','unread','2026-06-14 09:39:07','2026-06-14 09:39:07'),('b3195bfb-7f9c-4864-af46-edcd9aa568af','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-13 12:30:52','unread','2026-06-13 12:30:52','2026-06-13 12:30:52'),('b320b0d0-faea-4d94-8fb6-bcd971870c97','c8776dce-0b66-40ef-8be8-838f939b8932','Pembayaran Berhasil!','Setoran sebesar Rp 300.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-15 21:46:20','unread','2026-06-15 21:46:20','2026-06-15 21:46:20'),('b35104a4-6f50-410a-a1c6-00fad9abe433','d7570642-5cd5-4403-8085-66bb3927b76b','Pengajuan Pembiayaan','Pengajuan Kendaraan (molis omoway) senilai Rp 28.000.000 telah berhasil dikirim.','2026-06-28 10:59:13','unread','2026-06-28 10:59:13','2026-06-28 10:59:13'),('b36c18d4-7a24-4b8a-b307-190d5cf7c59a','693e2950-6039-45d3-b8f6-6ed5b2983814','Arisan Disetujui!','Selamat! Pengajuan arisan Anda telah disetujui. Silahkan cek tagihan untuk setoran pertama.','2026-07-21 16:15:11','unread','2026-07-21 16:15:11','2026-07-21 16:15:11'),('b3d05298-64af-4cc2-a900-681227dcd6b2','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 17:39:47','unread','2026-06-20 17:39:47','2026-06-20 17:39:47'),('b3d7f02d-77fb-4d5e-bdbf-fea84ccddd28','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 16:44:32','unread','2026-06-16 16:44:32','2026-06-16 16:44:32'),('b3dc0cea-0c01-4c51-aeb3-baa2f83c3151','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','mohamadfahmyiqbal baru saja mendaftar sebagai Calon Anggota.','2026-07-22 05:54:20','unread','2026-07-22 05:54:20','2026-07-22 05:54:20'),('b4084d8b-a32f-45fe-9143-2acd3dfb8a02','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-10 05:54:05','unread','2026-07-10 05:54:05','2026-07-10 05:54:05'),('b4300920-7bb7-47af-a975-1aaaa58adcf4','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Anggota Baru','avhan hadi bijaksana telah mengirimkan data pendaftaran.','2026-06-18 21:35:24','unread','2026-06-18 21:35:24','2026-06-18 21:35:24'),('b48d5829-e55d-4f6a-af7d-8ac062de2e9c','8c00e514-663c-4f3d-97ff-8520273d923e','Selamat Datang!','Halo testDua, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-06-19 21:42:27','unread','2026-06-19 21:42:27','2026-06-19 21:42:27'),('b48f9790-01fc-4592-9ac6-c32c59e02cfd','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Pembayaran Berhasil!','Setoran sebesar Rp 1.500.000 telah diterima via sinkronisasi otomatis.','2026-06-13 02:24:29','unread','2026-06-13 02:24:29','2026-06-13 02:24:29'),('b4c0ad08-9373-4d51-943b-2eebeff603de','5880c3cd-d403-40dd-997b-319629799cab','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 0 tagihan telah dibuat.','2026-07-20 16:16:33','unread','2026-07-20 16:16:33','2026-07-20 16:16:33'),('b5149dea-05ef-4a65-9053-4b5cc84ec28c','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','Ade Sugianto baru saja mendaftar sebagai Calon Anggota.','2026-06-17 18:56:46','unread','2026-06-17 18:56:46','2026-06-17 18:56:46'),('b5965849-5e04-4f24-b981-810e18636b63','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari Mohamad Fahmy Iqbal.','2026-06-27 18:06:37','unread','2026-06-27 18:06:37','2026-06-27 18:06:37'),('b5f68c71-2eb5-49f7-bed5-59f29831178f','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 3 tagihan telah dibuat.','2026-06-28 11:36:28','unread','2026-06-28 11:36:28','2026-06-28 11:36:28'),('b607525a-c84a-465f-a94c-6e65d132144a','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 14:43:50','read','2026-06-28 14:43:50','2026-07-04 06:48:53'),('b6505e31-6594-45d8-8d67-25437cc31260','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-28 01:01:18','unread','2026-06-28 01:01:18','2026-06-28 01:01:18'),('b650d573-e756-460f-be02-b9a200297911','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-20 10:42:19','unread','2026-07-20 10:42:19','2026-07-20 10:42:19'),('b672edb1-5efb-43ab-88b8-713a673a9b84','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 22:56:35','unread','2026-06-27 22:56:35','2026-06-27 22:56:35'),('b686ba40-1ddc-4097-b8d4-4fbe2b8a8302','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan member saving targets','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 23:37:16','unread','2026-06-27 23:37:16','2026-06-27 23:37:16'),('b688105b-f0ff-48e2-a7ee-b7afeef0f501','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 500.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 18:07:38','unread','2026-06-27 18:07:38','2026-06-27 18:07:38'),('b6c7d403-69a2-4d05-93d8-9d881b95baef','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 17:13:27','unread','2026-06-20 17:13:27','2026-06-20 17:13:27'),('b6fdf5d3-0145-45ca-8efa-ed3e4e5bded9','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan exit requests','Menunggu verifikasi Anda: Pengajuan exit requests dari mohamadfahmyiqbal.','2026-07-23 09:39:08','unread','2026-07-23 09:39:08','2026-07-23 09:39:08'),('b718ecdb-f8fc-43f5-bc24-f894fcb62f55','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','Budi Santoso telah mengirimkan data pendaftaran.','2026-06-15 21:29:15','unread','2026-06-15 21:29:15','2026-06-15 21:29:15'),('b73d6936-af06-4203-bcb6-c90261d94f34','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 19:29:59','unread','2026-06-20 19:29:59','2026-06-20 19:29:59'),('b76353ec-18a2-45f4-abec-bd05682d8e09','927db5be-11e2-46af-a8c9-d6a37ca8963c','Pembayaran Berhasil!','Setoran sebesar Rp 700.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-14 12:17:58','unread','2026-06-14 12:17:58','2026-06-14 12:17:58'),('b79342ce-7064-4e22-be94-5e146a534aaa','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 4.740.444 telah diterima. Keanggotaan Anda kini aktif.','2026-07-22 13:13:39','unread','2026-07-22 13:13:39','2026-07-22 13:13:39'),('b7acb51c-4d1c-45c5-afa4-ba7888d515d2','c8776dce-0b66-40ef-8be8-838f939b8932','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-16 01:32:22','unread','2026-06-16 01:32:22','2026-06-16 01:32:22'),('b7c48d42-7b0e-43dc-8c3d-9eb8ebe90bac','d33889c0-4bf9-4745-909b-a9a726181785','Pembayaran Berhasil!','Setoran sebesar Rp 500.000 telah diterima via sinkronisasi otomatis.','2026-07-11 13:03:36','unread','2026-07-11 13:03:36','2026-07-11 13:03:36'),('b7f904c5-5182-4dfd-b3f4-26bd44ea5c26','c8776dce-0b66-40ef-8be8-838f939b8932','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-15 21:38:24','read','2026-06-15 21:38:24','2026-06-15 21:43:58'),('b80ead28-16eb-405a-8050-bbde39ef5941','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testDua.','2026-07-20 10:50:36','unread','2026-07-20 10:50:36','2026-07-20 10:50:36'),('b8393312-6f62-41df-85f6-9fa31da19256','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 17:44:43','unread','2026-06-20 17:44:43','2026-06-20 17:44:43'),('b8883d64-3775-48bf-862a-aa0641c02a6a','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari Mohamad Fahmy Iqbal.','2026-06-19 22:31:06','unread','2026-06-19 22:31:06','2026-06-19 22:31:06'),('b93d5464-6ab1-4e6a-be1a-912754d0f6b0','5880c3cd-d403-40dd-997b-319629799cab','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 3 tagihan telah dibuat.','2026-06-28 12:59:43','unread','2026-06-28 12:59:43','2026-06-28 12:59:43'),('b9691ac2-2e5f-4f3e-8473-c862456cc875','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan Pembiayaan','Pengajuan Darurat (Pinjaman Darurat) senilai Rp 3.000.000 telah berhasil dikirim.','2026-07-10 05:58:00','unread','2026-07-10 05:58:00','2026-07-10 05:58:00'),('b9700e04-11f4-4685-b58c-38284408e44b','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 933.334 telah diterima via sinkronisasi otomatis.','2026-06-20 19:01:40','unread','2026-06-20 19:01:40','2026-06-20 19:01:40'),('b9b3758d-3446-491d-9765-1751fc0b8dc0','5880c3cd-d403-40dd-997b-319629799cab','Pemesanan Sukuk Disetujui','Pemesanan sukuk Anda telah disetujui sepenuhnya oleh seluruh pengurus.','2026-06-28 14:32:24','unread','2026-06-28 14:32:24','2026-06-28 14:32:24'),('b9d133fe-cd07-49cf-9050-599778e0dfb5','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-12 23:31:25','unread','2026-07-12 23:31:25','2026-07-12 23:31:25'),('ba300b6a-8ea4-4303-9d5d-366090d2dc39','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari Mohamad Fahmy Iqbal.','2026-06-19 22:50:39','unread','2026-06-19 22:50:39','2026-06-19 22:50:39'),('ba8e670b-eed6-4e10-82b3-d0ee9493e9c0','c8776dce-0b66-40ef-8be8-838f939b8932','Pendaftaran Berhasil','Data Anda sedang diverifikasi.','2026-06-15 21:29:14','read','2026-06-15 21:29:14','2026-06-15 21:29:53'),('ba9dc605-1713-40d3-90c9-601b8f4a3aa0','693e2950-6039-45d3-b8f6-6ed5b2983814','Pengajuan Arisan','Pengajuan bergabung grup arisan Arisan umrah  (batch 6) berhasil dikirim dan sedang menunggu persetujuan.','2026-07-21 16:00:43','unread','2026-07-21 16:00:43','2026-07-21 16:00:43'),('bad8395f-48f5-4500-87e5-20c684d3f321','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Pengajuan member saving targets Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-13 13:31:41','unread','2026-06-13 13:31:41','2026-06-13 13:31:41'),('bae49c91-6ef5-4e74-89b9-bf6891feed1b','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Update Persetujuan member saving targets','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-13 13:41:31','unread','2026-06-13 13:41:31','2026-06-13 13:41:31'),('bbaf2a1c-0ac3-4786-a2ee-b832639d29b6','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testsatu.','2026-07-25 01:27:16','unread','2026-07-25 01:27:16','2026-07-25 01:27:16'),('bc87b12b-4148-4393-980e-3724720a87d8','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testtiga.','2026-07-04 15:05:49','unread','2026-07-04 15:05:49','2026-07-04 15:05:49'),('bcc9fb8a-093e-4a0b-abdd-0f07f3b5d7d3','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','Ade Sugianto baru saja mendaftar sebagai Calon Anggota.','2026-06-28 09:21:22','read','2026-06-28 09:21:22','2026-06-28 10:48:23'),('bd08c472-2741-4e7c-85ce-797be4ae6920','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 17:57:49','unread','2026-06-20 17:57:49','2026-06-20 17:57:49'),('bd118539-3e57-411f-9ecb-46ad2e5672fc','d33889c0-4bf9-4745-909b-a9a726181785','Penarikan Disetujui!','Penarikan sebesar Rp 6.000.000 telah disetujui dan sedang diproses.','2026-07-11 11:41:14','unread','2026-07-11 11:41:14','2026-07-11 11:41:14'),('bd18e8c8-9098-4c33-8774-4b0e2752699f','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 0 tagihan telah dibuat.','2026-06-28 11:28:50','unread','2026-06-28 11:28:50','2026-06-28 11:28:50'),('bd8bc9c0-9797-477f-b9bd-62398f1b65aa','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan savings withdrawal','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 21:27:26','unread','2026-06-27 21:27:26','2026-06-27 21:27:26'),('bd9e00c5-189d-4b5f-b121-f8bcd01b668e','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-28 00:19:32','unread','2026-06-28 00:19:32','2026-06-28 00:19:32'),('bde65af6-e113-40e5-a02b-16022523f062','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.400.000 telah diterima via sinkronisasi otomatis.','2026-06-21 00:00:31','unread','2026-06-21 00:00:31','2026-06-21 00:00:31'),('bdfbad94-2dec-45a7-8e20-615d8472a8aa','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 15:59:00','unread','2026-06-16 15:59:00','2026-06-16 15:59:00'),('be22d6a5-4089-4724-b37d-970d6f8a8c96','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','Abdullah telah mengirimkan data pendaftaran.','2026-06-28 09:33:59','unread','2026-06-28 09:33:59','2026-06-28 09:33:59'),('be346635-dcbf-4dc3-9230-bc79b03a5f4e','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: test','2026-06-11 05:43:03','read','2026-06-11 05:43:03','2026-06-28 09:06:46'),('be4aab81-1cea-4853-8fbb-72a37a6c65e5','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pembayaran Berhasil!','Setoran sebesar Rp 2.000.000 telah diterima via sinkronisasi otomatis.','2026-07-12 23:33:32','unread','2026-07-12 23:33:32','2026-07-12 23:33:32'),('be5cb40b-089e-454c-abf9-d196c8a9718d','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:10:11','unread','2026-06-19 00:10:11','2026-06-19 00:10:11'),('be676bd8-12d5-4b14-aa24-b1d91fec29a1','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.000.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-20 17:14:07','unread','2026-06-20 17:14:07','2026-06-20 17:14:07'),('bebc27fb-07fe-47a0-9128-1840694eb78f','0a7fd51a-6494-4202-89b6-94641b105fbb','Pengajuan Arisan','Pengajuan bergabung grup arisan Arisan umrah  (batch 6) berhasil dikirim dan sedang menunggu persetujuan.','2026-07-22 13:33:37','unread','2026-07-22 13:33:37','2026-07-22 13:33:37'),('beef132c-23c4-4a14-84ca-1934ddc7a930','d7570642-5cd5-4403-8085-66bb3927b76b','Pembayaran Berhasil!','Setoran sebesar Rp 20.084.800 telah diterima via sinkronisasi otomatis.','2026-06-28 11:16:14','unread','2026-06-28 11:16:14','2026-06-28 11:16:14'),('bef8f45d-9d99-4b8c-8503-5a7d2b91fd73','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Penarikan Disetujui!','Penarikan sebesar Rp 543.215 telah disetujui dan sedang diproses.','2026-07-12 23:01:53','unread','2026-07-12 23:01:53','2026-07-12 23:01:53'),('bef98afd-4387-428f-b1ca-c18ce93328cb','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembayaran Berhasil!','Setoran sebesar Rp 2.100.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 14:20:56','unread','2026-06-28 14:20:56','2026-06-28 14:20:56'),('bf082361-761d-493d-82ac-c2cd4558438c','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan member saving targets','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-11 09:09:39','unread','2026-07-11 09:09:39','2026-07-11 09:09:39'),('bf4ad402-ef7b-4386-9f43-ff446ba8682e','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-13 07:44:18','unread','2026-07-13 07:44:18','2026-07-13 07:44:18'),('bf54a83b-e5d4-460b-aaf2-d7600c029b5e','8bd8e1a5-ec5b-4963-922c-9a5c724fb906','Pembayaran Berhasil!','Setoran sebesar Rp 700.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 10:04:32','read','2026-06-28 10:04:32','2026-06-28 10:05:52'),('bf610b8b-1b7a-4308-8a7a-88239d584622','d7570642-5cd5-4403-8085-66bb3927b76b','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-12 23:34:54','unread','2026-07-12 23:34:54','2026-07-12 23:34:54'),('bf68e80b-941b-4eed-b9a4-ba017f28fa28','693e2950-6039-45d3-b8f6-6ed5b2983814','Selamat Datang!','Halo TestDua, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-07-20 16:35:57','unread','2026-07-20 16:35:57','2026-07-20 16:35:57'),('bf89cb72-6f70-4851-8748-bc5906152d40','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 18:00:40','unread','2026-06-20 18:00:40','2026-06-20 18:00:40'),('bfd8c1ef-5823-4281-a56d-8c379e7e0da8','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan member saving targets','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 23:37:25','unread','2026-06-27 23:37:25','2026-06-27 23:37:25'),('bff8e97a-7431-486a-bef4-33dd4457eb46','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:04:15','unread','2026-06-19 00:04:15','2026-06-19 00:04:15'),('c020a9e2-1757-457e-83a5-b653437c14bc','6eb82278-2af9-4ffe-8167-0f2302320952','Selamat Datang!','Halo testempat, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-06-12 22:03:22','unread','2026-06-12 22:03:22','2026-06-12 22:03:22'),('c042d6cf-f2f6-4dd6-8d5e-3c96fed750e7','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:58:22','unread','2026-06-18 23:58:22','2026-06-18 23:58:22'),('c0439985-5988-432d-a9b6-327998430764','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: Mohamad Fahmy Iqbal','2026-06-19 22:12:10','read','2026-06-19 22:12:10','2026-06-28 09:06:46'),('c05944ea-07eb-490e-9616-51d5b236e6db','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 22:25:11','unread','2026-06-18 22:25:11','2026-06-18 22:25:11'),('c06a6ae5-f13e-4461-8a9e-df352ef0a00b','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 21:32:50','unread','2026-06-18 21:32:50','2026-06-18 21:32:50'),('c09179ef-c34c-40dd-bbda-9a4602260570','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.400.000 telah diterima via sinkronisasi otomatis.','2026-06-24 14:08:09','unread','2026-06-24 14:08:09','2026-06-24 14:08:09'),('c09ca377-8a5a-4d9f-82ce-cb77a47afadc','5bc1b027-b861-44ab-b46c-0de120bf46ac','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 09:59:15','read','2026-06-28 09:59:15','2026-06-28 10:15:39'),('c0a7b390-272d-4386-9e27-fa449cddc837','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Update Persetujuan Sukuk','Langkah persetujuan oleh Ketua telah berhasil. Menunggu verifikasi lainnya.','2026-07-13 07:48:18','unread','2026-07-13 07:48:18','2026-07-13 07:48:18'),('c0c94f75-4ccd-42b1-8519-79704fea5a7a','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari Abdullah.','2026-06-28 09:58:48','unread','2026-06-28 09:58:48','2026-06-28 09:58:48'),('c19eb24f-ad30-433b-900c-41c8a9592dfb','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Update Persetujuan savings withdrawal','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-13 01:58:55','unread','2026-06-13 01:58:55','2026-06-13 01:58:55'),('c1ac1468-6a0c-40e5-b199-fbce2ed12407','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Update Persetujuan Sukuk','Langkah persetujuan oleh Pengawas telah berhasil. Menunggu verifikasi lainnya.','2026-07-13 07:43:52','unread','2026-07-13 07:43:52','2026-07-13 07:43:52'),('c1d653bf-8a83-42df-a271-a065b4deaf91','197a45d6-d0e3-4d7e-a0d8-938a9180a7bb','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-11 05:56:41','unread','2026-06-11 05:56:41','2026-06-11 05:56:41'),('c1e296bc-2122-4803-8f42-80e066006aae','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-12 22:51:41','unread','2026-07-12 22:51:41','2026-07-12 22:51:41'),('c1ec867d-ea02-4c2b-8a47-693d05d55748','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testsatu.','2026-06-27 15:45:00','unread','2026-06-27 15:45:00','2026-06-27 15:45:00'),('c222c6bb-889e-4e36-bc68-ae2314286bfd','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 01:01:17','unread','2026-06-28 01:01:17','2026-06-28 01:01:17'),('c2518d62-4905-43db-8e5c-fa01af0d3c5c','c8776dce-0b66-40ef-8be8-838f939b8932','Pembayaran Berhasil!','Setoran sebesar Rp 1.500.000 telah diterima via sinkronisasi otomatis.','2026-06-15 23:00:35','unread','2026-06-15 23:00:35','2026-06-15 23:00:35'),('c2b5246d-dba8-4792-9371-dd1097b70c18','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 23:17:02','unread','2026-06-27 23:17:02','2026-06-27 23:17:02'),('c2d2d29b-3d03-40a7-9ba9-e80f80389dc8','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 2.216.000 telah diterima via sinkronisasi otomatis.','2026-06-20 18:17:38','unread','2026-06-20 18:17:38','2026-06-20 18:17:38'),('c3491893-a196-4db7-a432-d3309a1656bf','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-27 17:02:20','unread','2026-06-27 17:02:20','2026-06-27 17:02:20'),('c358395d-9ec5-4c12-8814-0926f5d3ee70','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:21:40','unread','2026-06-18 23:21:40','2026-06-18 23:21:40'),('c384f94a-f663-4151-a3fd-ed5c22f1479e','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-13 14:41:11','unread','2026-06-13 14:41:11','2026-06-13 14:41:11'),('c3c73aeb-fc17-4349-9c34-ccda5fa141a9','927db5be-11e2-46af-a8c9-d6a37ca8963c','Update Persetujuan savings withdrawal','Langkah \"Pencairan Bendahara\" disetujui. Menunggu verifikasi berikutnya.','2026-06-14 15:48:45','unread','2026-06-14 15:48:45','2026-06-14 15:48:45'),('c3f5f958-9804-4ea2-852f-60834e038fcb','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembayaran Berhasil!','Setoran sebesar Rp 400.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 23:39:46','unread','2026-06-27 23:39:46','2026-06-27 23:39:46'),('c411c70e-a506-4ffb-a29f-9ca451070f4d','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Update Persetujuan member saving targets','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-13 07:43:31','unread','2026-07-13 07:43:31','2026-07-13 07:43:31'),('c4139b69-87d2-434d-8232-16309413378b','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-10 05:37:36','unread','2026-07-10 05:37:36','2026-07-10 05:37:36'),('c4298970-bd3a-4561-bb08-4d9d71f449e3','8c6f7722-c817-40c7-ba80-982b224f08c2','Pengajuan Pembiayaan','Pengajuan Kendaraan (motor pcx) senilai Rp 19.800.000 telah berhasil dikirim.','2026-06-28 10:56:41','unread','2026-06-28 10:56:41','2026-06-28 10:56:41'),('c4311ad8-7d82-47c1-aee6-cea5b4d8e8da','8c00e514-663c-4f3d-97ff-8520273d923e','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 0 tagihan telah dibuat.','2026-07-20 10:48:43','unread','2026-07-20 10:48:43','2026-07-20 10:48:43'),('c4721078-c264-405e-aeaa-12858a22c025','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 61 tagihan telah dibuat.','2026-07-13 07:53:34','unread','2026-07-13 07:53:34','2026-07-13 07:53:34'),('c47de8e0-a4bc-4e84-a9d2-5ef6eb32f665','4e0a7229-ead2-4d54-add6-05ca832a7815','Selamat Datang!','Halo Budi Santoso, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-07-23 10:09:27','unread','2026-07-23 10:09:27','2026-07-23 10:09:27'),('c4883736-8287-45c6-a039-562affaca881','8c00e514-663c-4f3d-97ff-8520273d923e','Penarikan Disetujui!','Penarikan sebesar Rp 50.000 telah disetujui dan sedang diproses.','2026-07-19 10:17:16','unread','2026-07-19 10:17:16','2026-07-19 10:17:16'),('c501ed84-d3f8-4322-b0b7-d903c32262c7','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:39:20','unread','2026-06-19 00:39:20','2026-06-19 00:39:20'),('c57a9978-6ab0-4ce5-93bd-e7b406e5a0c6','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','testTiga baru saja mendaftar sebagai Calon Anggota.','2026-06-14 09:18:46','unread','2026-06-14 09:18:46','2026-06-14 09:18:46'),('c65e080c-2787-4233-9345-11b5149f53b5','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-13 01:36:57','unread','2026-06-13 01:36:57','2026-06-13 01:36:57'),('c67fa727-5dfd-45e3-afd4-08cba34f9ee0','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 00:47:05','unread','2026-06-20 00:47:05','2026-06-20 00:47:05'),('c6e30207-33d1-41a5-ac82-cb0972f01171','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari mohamadfahmyiqbal.','2026-07-22 13:40:32','unread','2026-07-22 13:40:32','2026-07-22 13:40:32'),('c7b8f62d-10b5-4983-b1ff-350bf7d6c897','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 504.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-22 06:20:57','unread','2026-07-22 06:20:57','2026-07-22 06:20:57'),('c7ca7e33-673a-4bc7-aa43-696dd819a7b2','c8776dce-0b66-40ef-8be8-838f939b8932','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 13 tagihan telah dibuat.','2026-06-15 22:54:46','unread','2026-06-15 22:54:46','2026-06-15 22:54:46'),('c7cbe22c-857f-48d8-a042-8b3e82711472','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 54.000.000 telah diterima via sinkronisasi otomatis.','2026-07-12 23:50:32','unread','2026-07-12 23:50:32','2026-07-12 23:50:32'),('c802ef56-dbfd-4140-a7ac-e19b4ca1941e','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 3.000.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 13:01:20','unread','2026-06-28 13:01:20','2026-06-28 13:01:20'),('c86fa611-1c18-4d71-a8d1-07ce955c6f5b','927db5be-11e2-46af-a8c9-d6a37ca8963c','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-16 01:38:38','unread','2026-06-16 01:38:38','2026-06-16 01:38:38'),('c87e534e-7043-4ea4-9d51-b1ebd88263d5','c8776dce-0b66-40ef-8be8-838f939b8932','Penarikan Disetujui!','Penarikan sebesar Rp 100.000 telah disetujui dan sedang diproses.','2026-06-15 21:51:15','unread','2026-06-15 21:51:15','2026-06-15 21:51:15'),('c970ab31-f26f-4038-9eee-9d55a7744970','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 19:18:18','unread','2026-06-20 19:18:18','2026-06-20 19:18:18'),('c9883581-39d0-4a43-91d7-caad87bd4d01','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Pengajuan member saving targets Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-13 13:30:09','unread','2026-06-13 13:30:09','2026-06-13 13:30:09'),('c9cc6457-2995-465f-894c-990601150f2a','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-16 01:41:21','unread','2026-06-16 01:41:21','2026-06-16 01:41:21'),('c9f3b433-5845-4f39-b22c-8557afa48fae','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-10 05:58:53','unread','2026-07-10 05:58:53','2026-07-10 05:58:53'),('ca2c7f91-1a95-4345-848f-4138c04d441f','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari testtiga.','2026-07-10 05:24:15','unread','2026-07-10 05:24:15','2026-07-10 05:24:15'),('ca6fe0c1-6c0e-42b8-8edc-f5d9eb516fb5','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-13 01:36:45','unread','2026-06-13 01:36:45','2026-06-13 01:36:45'),('ca9443b5-c407-48f8-83c3-38b919493625','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 14:30:05','unread','2026-06-16 14:30:05','2026-06-16 14:30:05'),('ca9a2a00-47fc-49d5-ac7a-48a917c90a85','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','hendrik saepudin baru saja mendaftar sebagai Calon Anggota.','2026-06-28 09:12:41','read','2026-06-28 09:12:41','2026-06-28 10:48:23'),('cacb2712-be87-46c3-841d-b826e509d0d7','f98594e5-d43c-4acb-8052-b108c36c79cc','Penarikan Disetujui!','Penarikan sebesar Rp 50.000 telah disetujui dan sedang diproses.','2026-06-27 21:28:37','unread','2026-06-27 21:28:37','2026-06-27 21:28:37'),('cb1d7edb-67e1-4704-b030-f0c23925bab4','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','testsatu baru saja mendaftar sebagai Calon Anggota.','2026-06-16 11:35:02','read','2026-06-16 11:35:02','2026-06-28 09:06:46'),('cb2688ca-7ccc-46fa-a24a-71b161e2ff1f','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-10 05:58:26','unread','2026-07-10 05:58:26','2026-07-10 05:58:26'),('cb3bdc09-31a4-43f1-9330-a5948acf2148','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testtiga.','2026-07-10 05:28:08','unread','2026-07-10 05:28:08','2026-07-10 05:28:08'),('cb6a8b3d-6f70-4326-8199-1ee3a86b854f','d7570642-5cd5-4403-8085-66bb3927b76b','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 11:05:43','unread','2026-06-28 11:05:43','2026-06-28 11:05:43'),('cb956d78-8c50-4a9e-aa28-ab84e489348b','c8776dce-0b66-40ef-8be8-838f939b8932','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-15 21:35:13','read','2026-06-15 21:35:13','2026-06-15 21:43:58'),('cc520ea1-1cbb-4b94-8952-3b3a099205b3','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari mohamadfahmyiqbal.','2026-07-22 10:46:59','unread','2026-07-22 10:46:59','2026-07-22 10:46:59'),('ccf639b0-b02b-47ef-9f1a-35908ede8224','5880c3cd-d403-40dd-997b-319629799cab','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 12 tagihan telah dibuat.','2026-06-27 16:44:16','unread','2026-06-27 16:44:16','2026-06-27 16:44:16'),('ccfa9a31-7882-4d54-a39f-30be67d7bad2','927db5be-11e2-46af-a8c9-d6a37ca8963c','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 13 tagihan telah dibuat.','2026-06-14 21:30:32','unread','2026-06-14 21:30:32','2026-06-14 21:30:32'),('cd511507-32f8-440c-8e21-45e05e53627d','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari Mohamad Fahmy Iqbal.','2026-06-27 18:06:52','unread','2026-06-27 18:06:52','2026-06-27 18:06:52'),('cd9abffb-5415-4787-85cf-bd0661e47d86','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-15 22:39:17','unread','2026-06-15 22:39:17','2026-06-15 22:39:17'),('cdc9fce4-edca-4af0-b471-30e87b3244d3','927db5be-11e2-46af-a8c9-d6a37ca8963c','Pengajuan members Ditolak','Pengajuan ditolak. Alasan: Ditolak oleh Pengawas','2026-06-14 11:14:44','unread','2026-06-14 11:14:44','2026-06-14 11:14:44'),('ce7b2ac1-e402-444d-a31f-6971186890fb','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Pembayaran Berhasil!','Setoran sebesar Rp 700.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-13 01:37:40','unread','2026-06-13 01:37:40','2026-06-13 01:37:40'),('ceca4ee8-8c13-45a7-857b-9afebde3e9a0','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.400.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 23:18:15','unread','2026-06-27 23:18:15','2026-06-27 23:18:15'),('ced91b9c-818e-4237-bd6d-614853c0713d','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:51:36','unread','2026-06-19 00:51:36','2026-06-19 00:51:36'),('cee6d87e-fb12-42d7-9748-5a4aefac672b','5880c3cd-d403-40dd-997b-319629799cab','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 12 tagihan telah dibuat.','2026-06-27 17:02:20','unread','2026-06-27 17:02:20','2026-06-27 17:02:20'),('cf90e0af-a362-455b-8010-4ab049b2a4bd','927db5be-11e2-46af-a8c9-d6a37ca8963c','Update Persetujuan savings withdrawal','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-14 15:51:46','unread','2026-06-14 15:51:46','2026-06-14 15:51:46'),('cf9d641b-8869-4101-b2e8-3aeb9e3e7b97','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-15 22:38:55','unread','2026-06-15 22:38:55','2026-06-15 22:38:55'),('cf9eaac4-2e3b-4317-a9a0-ea1374cce6c7','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-12 23:29:25','unread','2026-07-12 23:29:25','2026-07-12 23:29:25'),('cfa62559-774a-4064-a422-a391062d0d14','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pembayaran Berhasil!','Setoran sebesar Rp 4.944.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-12 23:48:59','unread','2026-07-12 23:48:59','2026-07-12 23:48:59'),('cfb2fed6-3028-485a-b055-6ed0ae5b6e39','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:51:46','unread','2026-06-19 00:51:46','2026-06-19 00:51:46'),('d014a941-fdeb-4f9f-be1b-f8c7f3fd5f60','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 23:59:33','unread','2026-06-20 23:59:33','2026-06-20 23:59:33'),('d05fba5e-e8ca-4bb9-8be3-e377e8dd886b','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Tabungan Berhasil','Pengajuan Tabungan Umroh 2026 senilai Rp 30.000.000 telah diproses.','2026-06-27 18:06:04','unread','2026-06-27 18:06:04','2026-06-27 18:06:04'),('d0daac5a-8ecb-4185-b119-2a1d643474e8','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-18 21:35:48','unread','2026-06-18 21:35:48','2026-06-18 21:35:48'),('d0e13a52-aeea-4648-b16a-b5feace6c34b','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','mohamadfahmyiqbal baru saja mendaftar sebagai Calon Anggota.','2026-07-22 05:54:20','unread','2026-07-22 05:54:20','2026-07-22 05:54:20'),('d10a0de4-a98e-4f6c-8ceb-0f108d2b41cb','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-10 05:36:33','unread','2026-07-10 05:36:33','2026-07-10 05:36:33'),('d12166d8-a560-46fc-98a5-8b265c0bfae0','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-13 13:14:32','unread','2026-06-13 13:14:32','2026-06-13 13:14:32'),('d1284df3-1ddd-494f-b1a8-7e774d0087b6','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembayaran Berhasil!','Setoran sebesar Rp 23.100.000 telah diterima via sinkronisasi otomatis.','2026-06-28 14:15:02','unread','2026-06-28 14:15:02','2026-06-28 14:15:02'),('d137e87a-c524-410b-8942-db39645d8532','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 500.000 telah diterima via sinkronisasi otomatis.','2026-06-27 18:07:31','unread','2026-06-27 18:07:31','2026-06-27 18:07:31'),('d17eaaa3-69ae-450d-8aaf-34eb125a8679','d7570642-5cd5-4403-8085-66bb3927b76b','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 3 tagihan telah dibuat.','2026-06-28 11:36:37','unread','2026-06-28 11:36:37','2026-06-28 11:36:37'),('d180bb64-9c88-4d0c-9d63-c8283a19c95b','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 21:27:19','unread','2026-06-18 21:27:19','2026-06-18 21:27:19'),('d1920403-7046-4450-8161-f3b30a247043','d7570642-5cd5-4403-8085-66bb3927b76b','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 11:20:22','unread','2026-06-28 11:20:22','2026-06-28 11:20:22'),('d1a8f36e-2918-445f-8552-db3511fa9a2e','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testDua.','2026-07-20 10:55:34','unread','2026-07-20 10:55:34','2026-07-20 10:55:34'),('d1b23290-e85e-473b-a91f-336c35c2ef6a','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-13 07:47:44','unread','2026-07-13 07:47:44','2026-07-13 07:47:44'),('d1b526bd-3a56-4a5d-9500-42c4fd64e6e6','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari mohamadfahmyiqbal.','2026-07-22 07:47:48','unread','2026-07-22 07:47:48','2026-07-22 07:47:48'),('d223b850-99ee-49eb-9573-d530b042ab58','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-27 21:34:45','unread','2026-06-27 21:34:45','2026-06-27 21:34:45'),('d224d15c-7714-4964-8257-873972abe26f','8c6f7722-c817-40c7-ba80-982b224f08c2','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 10:03:10','unread','2026-06-28 10:03:10','2026-06-28 10:03:10'),('d22bc949-bb59-429d-b069-8f6366fc80aa','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-19 09:00:54','unread','2026-07-19 09:00:54','2026-07-19 09:00:54'),('d249f8db-6772-4e7f-bfc4-07815fc592e1','927db5be-11e2-46af-a8c9-d6a37ca8963c','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-15 15:13:52','unread','2026-06-15 15:13:52','2026-06-15 15:13:52'),('d28161eb-c1dc-4f84-aa45-ce040ddd4f67','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','testsatu baru saja mendaftar sebagai Calon Anggota.','2026-07-25 01:16:00','unread','2026-07-25 01:16:00','2026-07-25 01:16:00'),('d2ee4627-86ca-4afb-8a0f-4251b7b206cf','0a7fd51a-6494-4202-89b6-94641b105fbb','Penarikan Disetujui!','Penarikan sebesar Rp 50.000 telah disetujui dan sedang diproses.','2026-07-22 06:24:59','unread','2026-07-22 06:24:59','2026-07-22 06:24:59'),('d3142db3-7f95-45a0-8429-47e39b8e23d1','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-28 14:43:50','unread','2026-06-28 14:43:50','2026-06-28 14:43:50'),('d35dec41-a9bb-484c-aa1d-0bb58ab6b56f','5bc1b027-b861-44ab-b46c-0de120bf46ac','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 09:58:48','read','2026-06-28 09:58:48','2026-06-28 10:15:39'),('d3761ba0-2b60-41e7-8023-38da9ec32943','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari TestDua.','2026-07-21 15:35:38','unread','2026-07-21 15:35:38','2026-07-21 15:35:38'),('d37b978a-c1c2-4137-95a3-103495e24bd3','8c00e514-663c-4f3d-97ff-8520273d923e','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-20 10:51:08','unread','2026-07-20 10:51:08','2026-07-20 10:51:08'),('d38b9bc3-c196-46c7-a6ed-430c5a61cd4f','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari testTiga.','2026-06-14 15:52:11','unread','2026-06-14 15:52:11','2026-06-14 15:52:11'),('d4a358ab-07a8-446f-a024-b09075dbb70f','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Arisan','Pengajuan bergabung grup arisan Arisan Umrah (8) berhasil dikirim dan sedang menunggu persetujuan.','2026-06-28 14:01:20','unread','2026-06-28 14:01:20','2026-06-28 14:01:20'),('d4c341b8-2e6e-411d-8a29-91d314e57be9','d7570642-5cd5-4403-8085-66bb3927b76b','Pembayaran Berhasil!','Setoran sebesar Rp 1.000.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 12:51:35','unread','2026-06-28 12:51:35','2026-06-28 12:51:35'),('d4c9e1e5-1b1d-4f8f-969b-8536b7b0c063','d33889c0-4bf9-4745-909b-a9a726181785','Penarikan Disetujui!','Penarikan sebesar Rp 50.000 telah disetujui dan sedang diproses.','2026-07-04 18:22:17','unread','2026-07-04 18:22:17','2026-07-04 18:22:17'),('d4d769b3-7073-40da-babb-8eda5e430e29','d33889c0-4bf9-4745-909b-a9a726181785','Pembayaran Berhasil!','Setoran sebesar Rp 500.000 telah diterima via sinkronisasi otomatis.','2026-07-11 09:16:18','unread','2026-07-11 09:16:18','2026-07-11 09:16:18'),('d4faaa99-905c-4f74-9132-db293a07b459','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testtiga.','2026-07-04 14:30:51','unread','2026-07-04 14:30:51','2026-07-04 14:30:51'),('d527ae6f-c80b-4654-a22d-29c95b9f3737','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari TestDua.','2026-07-21 15:24:19','unread','2026-07-21 15:24:19','2026-07-21 15:24:19'),('d5da1a8c-3229-49a6-9d19-dafc437506be','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari testtiga.','2026-07-04 17:54:36','unread','2026-07-04 17:54:36','2026-07-04 17:54:36'),('d5ee3d4c-7892-4a3b-9fc9-55793eb94431','c8776dce-0b66-40ef-8be8-838f939b8932','Pembayaran Berhasil!','Setoran sebesar Rp 394.667 telah diterima via sinkronisasi otomatis.','2026-06-16 00:45:33','unread','2026-06-16 00:45:33','2026-06-16 00:45:33'),('d62e2380-e383-4a11-b179-5e30aac93a7a','d7570642-5cd5-4403-8085-66bb3927b76b','Pembayaran Berhasil!','Setoran sebesar Rp 1.000.000 telah diterima via sinkronisasi otomatis.','2026-06-28 12:51:34','unread','2026-06-28 12:51:34','2026-06-28 12:51:34'),('d638b873-f9e5-4060-9595-f50e311769f4','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-13 12:30:29','unread','2026-06-13 12:30:29','2026-06-13 12:30:29'),('d63ad755-8e28-4e18-bb96-03f1db90f4ad','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-12 22:50:00','unread','2026-07-12 22:50:00','2026-07-12 22:50:00'),('d65b5508-1b66-4e63-90e8-3de6a6181d9b','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 22:18:55','unread','2026-06-27 22:18:55','2026-06-27 22:18:55'),('d6961a46-8d58-442d-9c1d-eb7c89c7326d','693e2950-6039-45d3-b8f6-6ed5b2983814','Update Persetujuan savings withdrawal','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-21 15:24:18','unread','2026-07-21 15:24:18','2026-07-21 15:24:18'),('d6aab3d7-2709-4e8e-aad0-6e4a97206f69','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testTiga.','2026-06-14 11:29:21','unread','2026-06-14 11:29:21','2026-06-14 11:29:21'),('d6acd1cb-d4b9-4cee-80e3-5225810c5a91','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembayaran Berhasil!','Setoran sebesar Rp 2.154.667 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 22:11:15','unread','2026-06-27 22:11:15','2026-06-27 22:11:15'),('d78cfcdb-c5dc-406d-a3cb-d7fe95e0a9c8','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Pembayaran Berhasil!','Setoran sebesar Rp 500.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-13 13:37:21','unread','2026-06-13 13:37:21','2026-06-13 13:37:21'),('d7bf330f-e830-448d-9e91-2720625a0502','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-27 16:44:16','unread','2026-06-27 16:44:16','2026-06-27 16:44:16'),('d7d9b12a-f5ce-4687-b401-3e0d13332a06','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan savings withdrawal','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-22 10:56:29','unread','2026-07-22 10:56:29','2026-07-22 10:56:29'),('d7f5b7c4-4243-4afa-adb8-6a396c348002','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-28 12:58:29','unread','2026-06-28 12:58:29','2026-06-28 12:58:29'),('d820c6b6-b60f-4d20-87f3-7c3d73f813f0','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari testDua.','2026-07-19 08:45:37','unread','2026-07-19 08:45:37','2026-07-19 08:45:37'),('d829aafb-1e6d-459c-8e6b-6bb1e28c12ad','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari mohamadfahmyiqbal.','2026-07-22 13:24:42','unread','2026-07-22 13:24:42','2026-07-22 13:24:42'),('d8524efc-3d72-4c61-b5a4-d3a6c7eb66af','f98594e5-d43c-4acb-8052-b108c36c79cc','Pembayaran Berhasil!','Setoran sebesar Rp 2.083.333 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 22:58:22','unread','2026-06-27 22:58:22','2026-06-27 22:58:22'),('d860cbe9-3d86-4ded-9f9b-445746a8aeb6','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-15 22:02:39','unread','2026-06-15 22:02:39','2026-06-15 22:02:39'),('d89f11b7-9ede-4005-a052-89329e54acac','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','Budi Santoso baru saja mendaftar sebagai Calon Anggota.','2026-07-23 10:09:28','unread','2026-07-23 10:09:28','2026-07-23 10:09:28'),('d8b2274d-a450-487e-91f5-8d9d5afc2db4','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan savings withdrawal','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-10 05:24:15','unread','2026-07-10 05:24:15','2026-07-10 05:24:15'),('d8b6b5b5-6c14-4376-bafe-e3604044bebb','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: test','2026-06-11 05:26:41','read','2026-06-11 05:26:41','2026-06-28 09:06:46'),('d948309b-b6e8-4cd0-9d49-2d9684503da0','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 17:58:00','unread','2026-06-20 17:58:00','2026-06-20 17:58:00'),('d9b27245-05ff-4e6e-b800-099650c7b619','c8776dce-0b66-40ef-8be8-838f939b8932','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-15 22:54:20','unread','2026-06-15 22:54:20','2026-06-15 22:54:20'),('d9b619e9-88a4-4172-a964-817d27b0facf','d7570642-5cd5-4403-8085-66bb3927b76b','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 11:21:06','unread','2026-06-28 11:21:06','2026-06-28 11:21:06'),('d9c02c01-5305-44c7-8313-9a842d8abb86','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','avhan hadi bijaksana telah mengirimkan data pendaftaran.','2026-06-18 21:35:24','unread','2026-06-18 21:35:24','2026-06-18 21:35:24'),('d9c2b8ea-442a-4459-bcee-99c29f4afa4f','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 18:00:40','unread','2026-06-20 18:00:40','2026-06-20 18:00:40'),('d9c7ccb7-26d1-4fc7-8007-3e9838fa7717','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testTiga.','2026-06-14 11:36:15','unread','2026-06-14 11:36:15','2026-06-14 11:36:15'),('d9c940e9-662c-44bf-bea0-515c422f16d6','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','testTiga baru saja mendaftar sebagai Calon Anggota.','2026-06-14 09:35:50','unread','2026-06-14 09:35:50','2026-06-14 09:35:50'),('d9cf3024-f59e-4e87-b4e2-966523773f2b','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari Budi Santoso.','2026-06-27 20:53:54','unread','2026-06-27 20:53:54','2026-06-27 20:53:54'),('da6bf8ed-9c77-4d18-a9bc-277bf5243a5e','8bd8e1a5-ec5b-4963-922c-9a5c724fb906','Pembayaran Berhasil!','Setoran sebesar Rp 23.100.000 telah diterima via sinkronisasi otomatis.','2026-06-28 14:12:12','unread','2026-06-28 14:12:12','2026-06-28 14:12:12'),('da9828ea-3429-4d65-9257-5e0b6a217455','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','mohamadfahmyiqbal baru saja mendaftar sebagai Calon Anggota.','2026-07-22 06:01:23','unread','2026-07-22 06:01:23','2026-07-22 06:01:23'),('dacd3923-2350-4d13-9874-be00ded7e138','693e2950-6039-45d3-b8f6-6ed5b2983814','Pengajuan Pembiayaan','Pengajuan Darurat (Pinjaman Darurat) senilai Rp 3.000.000 telah berhasil dikirim.','2026-07-21 15:53:44','unread','2026-07-21 15:53:44','2026-07-21 15:53:44'),('db6c80bb-4c1a-46f8-8589-432e70a74338','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari testtiga.','2026-07-11 13:02:49','unread','2026-07-11 13:02:49','2026-07-11 13:02:49'),('db9d0a1d-5b4a-4011-b43e-a80a0137d194','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari Ade Sugianto.','2026-06-28 10:30:25','unread','2026-06-28 10:30:25','2026-06-28 10:30:25'),('dc41461f-f88f-487e-a8d9-73e00b2f3413','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testDua.','2026-07-20 10:47:31','unread','2026-07-20 10:47:31','2026-07-20 10:47:31'),('dc8dbc0b-7b00-450f-b677-f45f0fca2725','c8776dce-0b66-40ef-8be8-838f939b8932','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-15 22:02:39','unread','2026-06-15 22:02:39','2026-06-15 22:02:39'),('dc9c35e1-c8e0-4dd9-a845-001c3470ba70','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 23:40:19','unread','2026-06-18 23:40:19','2026-06-18 23:40:19'),('dcf8a367-c822-4d05-a563-5391089cc507','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 17:13:28','unread','2026-06-20 17:13:28','2026-06-20 17:13:28'),('dd0c5b92-2652-4a14-89e0-5e8c33be66a8','693e2950-6039-45d3-b8f6-6ed5b2983814','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-21 16:15:12','unread','2026-07-21 16:15:12','2026-07-21 16:15:12'),('dd0f0d15-33b3-41e6-a132-815cfa07544e','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Tabungan Disetujui!','Pengajuan Tabungan Anda telah disetujui.','2026-06-27 06:39:23','unread','2026-06-27 06:39:23','2026-06-27 06:39:23'),('dd10f79d-623d-400e-8998-28a80f2bc34a','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: avhan hadi bijaksana','2026-06-18 21:35:24','read','2026-06-18 21:35:24','2026-06-28 09:06:46'),('dd2338d3-c02e-490c-9e04-6c34567fb689','c8776dce-0b66-40ef-8be8-838f939b8932','Pengajuan Pembiayaan','Pengajuan Elektronik (Kulkas) senilai Rp 2.700.000 telah berhasil dikirim.','2026-06-15 22:02:03','unread','2026-06-15 22:02:03','2026-06-15 22:02:03'),('dd4ae349-9ba5-4115-b7f0-f1be89583da7','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','Avhan Hadi Bijaksa a baru saja mendaftar sebagai Calon Anggota.','2026-07-23 21:06:03','unread','2026-07-23 21:06:03','2026-07-23 21:06:03'),('dd4b5dbd-1583-4744-8d19-f1ae6db96e01','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Avhan hadi.','2026-06-28 01:00:27','unread','2026-06-28 01:00:27','2026-06-28 01:00:27'),('dd4b9062-9bf2-419c-8690-ee189344e706','197a45d6-d0e3-4d7e-a0d8-938a9180a7bb','Pendaftaran Berhasil','Data Anda sedang diverifikasi.','2026-06-11 05:37:13','unread','2026-06-11 05:37:13','2026-06-11 05:37:13'),('dd8f8a0b-7041-4c78-9f1b-b77e1697dae7','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-27 14:53:13','unread','2026-06-27 14:53:13','2026-06-27 14:53:13'),('dd9b0b3a-f053-499b-8818-c02a14628d9a','43643359-0f59-4ea4-bb6d-e93505733d4a','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-25 01:13:25','unread','2026-07-25 01:13:25','2026-07-25 01:13:25'),('de11b006-8b0f-4160-b6e8-b4a87d39bb26','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 23:59:55','unread','2026-06-20 23:59:55','2026-06-20 23:59:55'),('de5c1d14-2332-45e2-b376-ed8868b9f0ea','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan member saving targets','Menunggu verifikasi Anda: Pengajuan member saving targets dari testtiga.','2026-07-11 09:09:40','unread','2026-07-11 09:09:40','2026-07-11 09:09:40'),('deb075be-d087-4a9f-ade9-c1c7cb24a37c','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testtiga.','2026-07-04 14:25:06','unread','2026-07-04 14:25:06','2026-07-04 14:25:06'),('debf460f-641b-485c-aa9a-3ef9514de840','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari avhanhb.','2026-07-12 23:45:46','unread','2026-07-12 23:45:46','2026-07-12 23:45:46'),('ded7b8d9-f134-4fdd-9cfb-c7638d56e6e4','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari Avhan hadi.','2026-06-18 21:35:49','unread','2026-06-18 21:35:49','2026-06-18 21:35:49'),('deefd5cd-eeaf-47f7-8b2d-da19e5c3a266','c8776dce-0b66-40ef-8be8-838f939b8932','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-15 22:03:11','unread','2026-06-15 22:03:11','2026-06-15 22:03:11'),('df5c3530-389f-4ac2-ad9a-e5cb3e340334','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-16 01:39:29','unread','2026-06-16 01:39:29','2026-06-16 01:39:29'),('df834c95-8e66-4432-af1c-e1ad21b68ae7','43643359-0f59-4ea4-bb6d-e93505733d4a','Pendaftaran Berhasil','Data Anda sedang diverifikasi.','2026-07-25 00:40:16','unread','2026-07-25 00:40:16','2026-07-25 00:40:16'),('df9b7012-3f25-4ad3-82a4-8c0c376af423','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-13 12:03:34','unread','2026-06-13 12:03:34','2026-06-13 12:03:34'),('dfbaef2f-bc6d-4e20-a0dd-ea1fedd2fad0','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','TestDua baru saja mendaftar sebagai Calon Anggota.','2026-07-20 16:35:57','unread','2026-07-20 16:35:57','2026-07-20 16:35:57'),('e00f9059-2c68-4f51-b1d4-192b9960dfdc','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 16:50:27','unread','2026-06-20 16:50:27','2026-06-20 16:50:27'),('e034a753-b88e-454b-8bc0-c2273d08db24','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pembayaran Berhasil!','Setoran sebesar Rp 720.000 telah diterima via sinkronisasi otomatis.','2026-07-12 22:58:45','unread','2026-07-12 22:58:45','2026-07-12 22:58:45'),('e03fb00f-66a9-4aef-95b6-0e7868f59571','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','mohamadfahmyiqbal baru saja mendaftar sebagai Calon Anggota.','2026-07-22 05:59:07','unread','2026-07-22 05:59:07','2026-07-22 05:59:07'),('e0461eb4-3a50-4b98-80f7-fd286f88a4f1','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-13 11:52:26','unread','2026-06-13 11:52:26','2026-06-13 11:52:26'),('e070a350-67f8-427f-8ea6-0ae316483cfb','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testsatu.','2026-06-16 12:22:23','unread','2026-06-16 12:22:23','2026-06-16 12:22:23'),('e0721c0c-f9d1-49c0-bd34-22978b1343ec','d33889c0-4bf9-4745-909b-a9a726181785','Pembayaran Berhasil!','Setoran sebesar Rp 704.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-04 15:31:01','unread','2026-07-04 15:31:01','2026-07-04 15:31:01'),('e0751d85-083a-480c-a7b7-aef272d6fcdf','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembayaran Berhasil!','Setoran sebesar Rp 1.000.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 12:54:02','unread','2026-06-28 12:54:02','2026-06-28 12:54:02'),('e07d9062-e743-45a0-b39c-60481bd2ace6','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari mohamadfahmyiqbal.','2026-07-22 06:03:57','unread','2026-07-22 06:03:57','2026-07-22 06:03:57'),('e0dc9719-cc46-4251-a21e-7c5b444f0e68','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','Mohamad Fahmy Iqbal baru saja mendaftar sebagai Calon Anggota.','2026-06-19 21:43:44','unread','2026-06-19 21:43:44','2026-06-19 21:43:44'),('e0e43ed1-7e00-4577-8bd1-0830160c0323','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Tabungan Disetujui!','Pengajuan Tabungan Anda telah disetujui.','2026-06-27 23:38:48','unread','2026-06-27 23:38:48','2026-06-27 23:38:48'),('e0e9e27b-7a4e-4df1-aa99-f35c7fe6c9fb','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pengajuan member saving targets Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-13 07:53:15','unread','2026-07-13 07:53:15','2026-07-13 07:53:15'),('e0fa2525-9fe0-4eb3-8ab8-e10e27d6217f','8c00e514-663c-4f3d-97ff-8520273d923e','Pembayaran Berhasil!','Setoran sebesar Rp 1.504.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-20 10:46:11','unread','2026-07-20 10:46:11','2026-07-20 10:46:11'),('e18d91bc-6704-4d64-b4d4-35f4fc90b529','8c00e514-663c-4f3d-97ff-8520273d923e','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-20 10:47:31','unread','2026-07-20 10:47:31','2026-07-20 10:47:31'),('e1a9c570-2405-4a3d-8b41-0647123a775c','8c00e514-663c-4f3d-97ff-8520273d923e','Pengajuan financing applications Ditolak','Pengajuan ditolak. Alasan: Oke di proses','2026-07-20 10:53:41','unread','2026-07-20 10:53:41','2026-07-20 10:53:41'),('e1b41ddb-d16a-4e40-9910-78e2ab7b7ab1','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari Mohamad Fahmy Iqbal.','2026-06-20 00:25:40','unread','2026-06-20 00:25:40','2026-06-20 00:25:40'),('e1c6d5d8-eed5-4880-a59d-716d66c7e08b','0a7fd51a-6494-4202-89b6-94641b105fbb','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-22 13:24:02','unread','2026-07-22 13:24:02','2026-07-22 13:24:02'),('e1cfb754-9f42-4751-ad98-c8599ec01963','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan savings withdrawal','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 00:29:00','unread','2026-06-20 00:29:00','2026-06-20 00:29:00'),('e1dfe451-946c-4ee4-9868-ab0f29de85c5','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan member saving targets','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 23:38:07','unread','2026-06-27 23:38:07','2026-06-27 23:38:07'),('e1f79075-0e09-4ba1-bab1-4fa33d85fd4e','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 17:57:49','unread','2026-06-20 17:57:49','2026-06-20 17:57:49'),('e20344c1-a0ae-436d-a5d7-2c9165a74d22','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-15 23:21:03','unread','2026-06-15 23:21:03','2026-06-15 23:21:03'),('e23110b9-3292-43af-a472-26f75d00e4f4','8c00e514-663c-4f3d-97ff-8520273d923e','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 3 tagihan telah dibuat.','2026-07-20 11:11:03','unread','2026-07-20 11:11:03','2026-07-20 11:11:03'),('e24544e9-d90c-4437-a8e6-35ced4fb4788','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:37:01','unread','2026-06-19 00:37:01','2026-06-19 00:37:01'),('e254c118-c9aa-42f9-8614-bcfba2e80872','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-13 12:10:30','unread','2026-06-13 12:10:30','2026-06-13 12:10:30'),('e2652ea1-0443-42c4-bfd8-4d8fbf8634fb','c8776dce-0b66-40ef-8be8-838f939b8932','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-16 01:21:56','unread','2026-06-16 01:21:56','2026-06-16 01:21:56'),('e26795cc-f224-4915-b03d-543c1f0d784b','8c00e514-663c-4f3d-97ff-8520273d923e','Pengajuan Pembiayaan','Pengajuan Darurat (Pinjaman Darurat) senilai Rp 3.000.000 telah berhasil dikirim.','2026-07-19 10:22:02','unread','2026-07-19 10:22:02','2026-07-19 10:22:02'),('e2723b11-1709-448d-9b89-bd169ca861d0','927db5be-11e2-46af-a8c9-d6a37ca8963c','Update Persetujuan savings withdrawal','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-14 15:52:11','unread','2026-06-14 15:52:11','2026-06-14 15:52:11'),('e27aa975-90db-46be-9e09-b1d46d930bd9','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','Agus Riyanta baru saja mendaftar sebagai Calon Anggota.','2026-06-17 19:01:54','unread','2026-06-17 19:01:54','2026-06-17 19:01:54'),('e34ee98b-6fa1-4f61-b0c6-e65f0e2c1aef','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','hendrik saepudin baru saja mendaftar sebagai Calon Anggota.','2026-06-28 09:12:41','unread','2026-06-28 09:12:41','2026-06-28 09:12:41'),('e34f6287-4f22-4ed8-9ece-5c6b08fb9124','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari TestDua.','2026-07-21 15:11:55','unread','2026-07-21 15:11:55','2026-07-21 15:11:55'),('e35c79b0-2796-454e-a27d-ff3242c97a4f','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 01:01:07','unread','2026-06-28 01:01:07','2026-06-28 01:01:07'),('e3a589d9-842f-4abb-abe7-cd7eab6beb91','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 22:09:09','unread','2026-06-18 22:09:09','2026-06-18 22:09:09'),('e3a960f1-8149-4f05-b0f4-c5422cf0095c','8c6f7722-c817-40c7-ba80-982b224f08c2','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 11:28:50','unread','2026-06-28 11:28:50','2026-06-28 11:28:50'),('e3b04fc3-58bb-4e76-bbe3-194cec8762c5','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 5.000.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-28 14:33:03','unread','2026-06-28 14:33:03','2026-06-28 14:33:03'),('e3d0d68e-dbd6-4da8-b6ea-ace72411579e','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: Mohamad Fahmy Iqbal ','2026-07-21 15:06:33','unread','2026-07-21 15:06:33','2026-07-21 15:06:33'),('e3e73c61-d06b-4ee6-9fc2-1f3ee1b91db0','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari testTiga.','2026-06-14 14:25:59','unread','2026-06-14 14:25:59','2026-06-14 14:25:59'),('e3f6fe2e-74a0-42e0-a631-c474773bb5d7','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','Budi Santoso baru saja mendaftar sebagai Calon Anggota.','2026-07-23 10:33:42','unread','2026-07-23 10:33:42','2026-07-23 10:33:42'),('e460dd9f-780d-43a1-bc3d-29f38dff7fe8','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari testtiga.','2026-07-04 18:23:36','unread','2026-07-04 18:23:36','2026-07-04 18:23:36'),('e46b7be2-473e-4f78-8cc9-3779487fb040','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Update Persetujuan savings withdrawal','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-12 23:01:26','unread','2026-07-12 23:01:26','2026-07-12 23:01:26'),('e4f8ea78-56de-40e4-8e42-0d44f471e574','c8776dce-0b66-40ef-8be8-838f939b8932','Pengajuan Pembiayaan','Pengajuan Elektronik (laptop) senilai Rp 2.100.000 telah berhasil dikirim.','2026-06-15 22:38:34','unread','2026-06-15 22:38:34','2026-06-15 22:38:34'),('e55e9240-c072-4ae2-aea0-1ca659b1556f','8c00e514-663c-4f3d-97ff-8520273d923e','Pengajuan Pembiayaan','Pengajuan Pelunasan Jual Beli (Pelunasan Laptop dell) senilai Rp 4.736.004 telah berhasil dikirim.','2026-07-20 10:46:44','unread','2026-07-20 10:46:44','2026-07-20 10:46:44'),('e5a1042d-3890-41e6-945e-8d5079c45229','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 19:18:19','unread','2026-06-20 19:18:19','2026-06-20 19:18:19'),('e61959a4-3ba0-43d1-bb50-26a164ffd95a','8c00e514-663c-4f3d-97ff-8520273d923e','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-20 10:50:36','unread','2026-07-20 10:50:36','2026-07-20 10:50:36'),('e668fae5-7d6f-4284-8f60-7ab2af6199f9','c8776dce-0b66-40ef-8be8-838f939b8932','Pembayaran Berhasil!','Setoran sebesar Rp 700.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-15 21:45:02','unread','2026-06-15 21:45:02','2026-06-15 21:45:02'),('e6858d95-723f-4489-a22e-ae6f804709d3','d7570642-5cd5-4403-8085-66bb3927b76b','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 11:34:51','unread','2026-06-28 11:34:51','2026-06-28 11:34:51'),('e6e8963b-37c5-42d0-b079-3bf5a8acc0a1','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 17:58:13','unread','2026-06-20 17:58:13','2026-06-20 17:58:13'),('e71b300a-33a9-44fc-87c9-64b51ec1d482','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-20 16:59:56','unread','2026-06-20 16:59:56','2026-06-20 16:59:56'),('e76e305c-829e-45a4-8221-b63b066ef611','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','testtiga baru saja mendaftar sebagai Calon Anggota.','2026-07-04 06:14:35','unread','2026-07-04 06:14:35','2026-07-04 06:14:35'),('e78ce78a-3dab-4dd4-8bcd-c72bcf137c82','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','Avhan hadi baru saja mendaftar sebagai Calon Anggota.','2026-06-14 21:06:28','unread','2026-06-14 21:06:28','2026-06-14 21:06:28'),('e7941b8e-5433-4ded-9932-937a6a7eb052','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan savings withdrawal','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 10:46:32','unread','2026-06-28 10:46:32','2026-06-28 10:46:32'),('e7b4a56e-7a6e-4335-88c2-c355349233b1','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Arisan','Pengajuan bergabung grup arisan Arisan umrah  (batch 6) berhasil dikirim dan sedang menunggu persetujuan.','2026-07-12 23:47:44','unread','2026-07-12 23:47:44','2026-07-12 23:47:44'),('e7dfbe48-c217-4740-b312-c4500e34664f','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-07-20 16:15:25','unread','2026-07-20 16:15:25','2026-07-20 16:15:25'),('e7f566ee-e106-475b-b94b-904d6bdd587c','d7570642-5cd5-4403-8085-66bb3927b76b','Pembayaran Berhasil!','Setoran sebesar Rp 2.900.000 telah diterima via sinkronisasi otomatis.','2026-06-28 10:57:43','unread','2026-06-28 10:57:43','2026-06-28 10:57:43'),('e82afeb6-774b-4da9-a1ba-a5b5b3ba3ad0','5e714c26-43e6-44a0-8a1e-def3f3290190','Selamat Datang!','Halo Avhan Hadi Bijaksa a, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-07-23 21:06:02','unread','2026-07-23 21:06:02','2026-07-23 21:06:02'),('e832c044-eb07-413c-a275-405359017023','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: Budi Santoso','2026-06-27 20:52:55','read','2026-06-27 20:52:55','2026-06-28 09:06:46'),('e86812ac-ea4b-4e0e-9479-bec6b05037ed','c8776dce-0b66-40ef-8be8-838f939b8932','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-15 21:34:16','read','2026-06-15 21:34:16','2026-06-15 21:34:34'),('e87bf49e-1275-4ae6-8ea2-182457a4d739','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 17:15:48','unread','2026-06-20 17:15:48','2026-06-20 17:15:48'),('e8a2d743-aede-454a-889b-2bd68c5177e3','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','TestDua baru saja mendaftar sebagai Calon Anggota.','2026-07-20 16:35:57','unread','2026-07-20 16:35:57','2026-07-20 16:35:57'),('e8c37b78-1605-4cad-bd16-e040450dd0a8','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan member saving targets','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-11 13:02:48','unread','2026-07-11 13:02:48','2026-07-11 13:02:48'),('e8f9b647-0056-4686-9ca1-38b1247160b2','0a7fd51a-6494-4202-89b6-94641b105fbb','Pengajuan members Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-22 06:04:35','unread','2026-07-22 06:04:35','2026-07-22 06:04:35'),('e8fbde10-325d-4674-95a1-d73468775b43','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 00:25:40','unread','2026-06-20 00:25:40','2026-06-20 00:25:40'),('e91f3922-d0cb-4a98-b794-28e92bb1fcc5','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 17:39:47','unread','2026-06-20 17:39:47','2026-06-20 17:39:47'),('e94e4b91-f540-448d-929c-ff2f386c3bc5','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-15 23:16:05','unread','2026-06-15 23:16:05','2026-06-15 23:16:05'),('e98b9234-9510-4b4f-9687-238433042602','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','avhanhb baru saja mendaftar sebagai Calon Anggota.','2026-07-12 22:35:34','unread','2026-07-12 22:35:34','2026-07-12 22:35:34'),('e99334b7-722f-4774-aba3-492fd399247d','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: Mohamad Fahmy Iqbal ','2026-07-19 08:12:47','unread','2026-07-19 08:12:47','2026-07-19 08:12:47'),('e9f3832a-c188-4208-9219-6ddc49b4469a','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan member saving targets Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-11 09:15:43','unread','2026-07-11 09:15:43','2026-07-11 09:15:43'),('ea6037f0-0f86-4563-9f26-17e0033c6d3e','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-28 00:19:54','unread','2026-06-28 00:19:54','2026-06-28 00:19:54'),('eaec4a66-ee2d-465f-816c-2a4a33e6c8b4','d33889c0-4bf9-4745-909b-a9a726181785','Pembayaran Berhasil!','Setoran sebesar Rp 1.500.000 telah diterima via sinkronisasi otomatis.','2026-07-10 05:30:28','unread','2026-07-10 05:30:28','2026-07-10 05:30:28'),('eb197327-5137-4b7b-949a-d74048431882','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testsatu.','2026-07-25 01:12:50','unread','2026-07-25 01:12:50','2026-07-25 01:12:50'),('eb2ff87e-b33f-4b3d-b8d1-ad8285e87ad4','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Pengajuan member saving targets Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-13 13:41:37','unread','2026-06-13 13:41:37','2026-06-13 13:41:37'),('eb5239dd-26ad-4191-8072-09d7e0900e3b','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pembayaran Berhasil!','Setoran sebesar Rp 12.350.118 telah diterima. Keanggotaan Anda kini aktif.','2026-07-12 22:59:58','unread','2026-07-12 22:59:58','2026-07-12 22:59:58'),('ec21b530-b6a5-489b-a5f9-4a83194f61f5','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-16 14:21:05','unread','2026-06-16 14:21:05','2026-06-16 14:21:05'),('ec5bb470-0bd1-4551-90ab-14b17ec950e7','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-07-19 09:00:54','unread','2026-07-19 09:00:54','2026-07-19 09:00:54'),('ecaf468d-0cec-485c-b1c5-9181f5452be8','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-28 13:31:50','unread','2026-06-28 13:31:50','2026-06-28 13:31:50'),('ed0db92d-8b6a-4225-b06a-6557da24d93b','693e2950-6039-45d3-b8f6-6ed5b2983814','Pembayaran Berhasil!','Setoran sebesar Rp 720.000 telah diterima via sinkronisasi otomatis.','2026-07-21 15:22:10','unread','2026-07-21 15:22:10','2026-07-21 15:22:10'),('ed77579d-1302-45d7-aa7c-4c92e468ffd7','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','Abdullah baru saja mendaftar sebagai Calon Anggota.','2026-06-28 09:11:45','unread','2026-06-28 09:11:45','2026-06-28 09:11:45'),('ed7b6f52-9bcc-4712-97d3-defcc62d374d','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 23:16:47','unread','2026-06-27 23:16:47','2026-06-27 23:16:47'),('ed8759d5-54d8-440a-b75c-da5eb77471ab','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-20 17:44:43','unread','2026-06-20 17:44:43','2026-06-20 17:44:43'),('ede40e8a-db8e-4c21-acfe-ac57e90fb9d4','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.400.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-24 14:08:10','unread','2026-06-24 14:08:10','2026-06-24 14:08:10'),('ee083017-705b-4c00-8709-c6c7df2dc625','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-24 14:05:29','unread','2026-06-24 14:05:29','2026-06-24 14:05:29'),('ee176cf2-45a1-47d9-b8c6-79966bcdf684','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari mohamadfahmyiqbal.','2026-07-22 11:32:01','unread','2026-07-22 11:32:01','2026-07-22 11:32:01'),('ee1e9d22-1b93-415f-9ca6-43c4d5d4b2d1','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testTiga.','2026-06-14 11:23:02','unread','2026-06-14 11:23:02','2026-06-14 11:23:02'),('eeaa3b78-8ef3-4495-97b2-43081f3069ec','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 5.000.000 telah diterima via sinkronisasi otomatis.','2026-06-27 14:03:55','unread','2026-06-27 14:03:55','2026-06-27 14:03:55'),('ef1b1f45-a562-4ce4-9b73-812527085034','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-27 22:43:54','unread','2026-06-27 22:43:54','2026-06-27 22:43:54'),('ef1c61de-824f-4711-a7d9-01302c53f092','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','testsatu baru saja mendaftar sebagai Calon Anggota.','2026-07-25 00:29:52','unread','2026-07-25 00:29:52','2026-07-25 00:29:52'),('ef2afcdd-d854-4dcc-8693-1fc0055078aa','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan Pembiayaan','Pengajuan Pelunasan Jual Beli (Pelunasan laptop) senilai Rp 4.736.004 telah berhasil dikirim.','2026-07-10 05:33:48','unread','2026-07-10 05:33:48','2026-07-10 05:33:48'),('ef3637d9-8c36-4bd4-837f-d7840d607d4b','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testTiga.','2026-06-14 21:29:23','unread','2026-06-14 21:29:23','2026-06-14 21:29:23'),('efe066da-a839-44af-9515-4eb3df8dc352','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan Pembiayaan','Pengajuan Darurat (Pinjaman Darurat) senilai Rp 3.000.000 telah berhasil dikirim.','2026-07-10 05:51:11','unread','2026-07-10 05:51:11','2026-07-10 05:51:11'),('f0014aae-1f6b-4bce-9498-f0983f441ad5','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:20:58','unread','2026-06-19 00:20:58','2026-06-19 00:20:58'),('f03be8e3-1aed-41ab-a181-679e868e6ef5','927db5be-11e2-46af-a8c9-d6a37ca8963c','Selamat Datang!','Halo testTiga, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-06-14 09:35:50','unread','2026-06-14 09:35:50','2026-06-14 09:35:50'),('f062b31a-df68-4e41-8f72-1b43c266c7b6','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testsepuly.','2026-06-14 21:26:06','unread','2026-06-14 21:26:06','2026-06-14 21:26:06'),('f08cebb3-d11e-4409-9cfc-32e108b18d29','8d66558b-37b9-4481-aceb-a06d19600681','Selamat Datang!','Halo testTiga, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.','2026-06-14 09:18:45','unread','2026-06-14 09:18:45','2026-06-14 09:18:45'),('f16e1674-da9c-476b-a13d-c4e8376fec55','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 17:58:00','unread','2026-06-20 17:58:00','2026-06-20 17:58:00'),('f1805bfc-56ee-4993-a6b0-0cb4f5fd1ae9','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Update Persetujuan savings withdrawal','Langkah \"Pencairan Bendahara\" disetujui. Menunggu verifikasi berikutnya.','2026-07-12 23:01:53','unread','2026-07-12 23:01:53','2026-07-12 23:01:53'),('f19d9fa6-276e-4cbf-8d76-8562aff4919f','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan savings withdrawal','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 21:04:22','unread','2026-06-27 21:04:22','2026-06-27 21:04:22'),('f21ade24-4ae0-4411-8b37-0a4578b32a4d','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 5.000.000 telah diterima. Keanggotaan Anda kini aktif.','2026-06-27 14:03:59','unread','2026-06-27 14:03:59','2026-06-27 14:03:59'),('f229661a-012b-4c88-903d-b3355272d82e','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 224.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-22 06:12:46','unread','2026-07-22 06:12:46','2026-07-22 06:12:46'),('f24cfc05-f4f2-4a57-aa01-a1fd55d4e973','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Anggota Baru','Ade Sugianto telah mengirimkan data pendaftaran.','2026-06-28 09:37:28','unread','2026-06-28 09:37:28','2026-06-28 09:37:28'),('f24e8819-a95c-4509-95c1-9e7e6275a339','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:21:09','unread','2026-06-19 00:21:09','2026-06-19 00:21:09'),('f27c0596-c374-40d2-a8a6-38507fc8642f','8c00e514-663c-4f3d-97ff-8520273d923e','Pengajuan Pembiayaan','Pengajuan Kendaraan (Laptop dell) senilai Rp 3.500.000 telah berhasil dikirim.','2026-07-20 10:42:58','unread','2026-07-20 10:42:58','2026-07-20 10:42:58'),('f2f326a5-0c45-40e2-a119-471d9a3727b6','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan Tabungan Berhasil','Pengajuan Tabungan Qurban senilai Rp 6.000.000 telah diproses.','2026-07-11 12:57:26','unread','2026-07-11 12:57:26','2026-07-11 12:57:26'),('f41ad2b2-c39f-45c1-9996-d4d585827546','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan tabungan withdrawals','Langkah \"Verifikasi\" disetujui. Menunggu verifikasi berikutnya.','2026-07-11 11:09:44','unread','2026-07-11 11:09:44','2026-07-11 11:09:44'),('f4409adc-ad6f-426c-bd4b-e0d9ddccc88d','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan member saving targets','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 18:06:37','unread','2026-06-27 18:06:37','2026-06-27 18:06:37'),('f444acac-1c78-4a5b-91b8-7f5ce65c8d52','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan Sukuk','Langkah persetujuan oleh Ketua telah berhasil. Menunggu verifikasi lainnya.','2026-06-28 14:31:50','unread','2026-06-28 14:31:50','2026-06-28 14:31:50'),('f4ccc3f9-922c-48e3-bc13-5298fcd9cb43','693e2950-6039-45d3-b8f6-6ed5b2983814','Pembayaran Berhasil!','Setoran sebesar Rp 500.000 telah diterima via sinkronisasi otomatis.','2026-07-21 15:23:03','unread','2026-07-21 15:23:03','2026-07-21 15:23:03'),('f5513b7d-ad9e-42bb-a24c-705bb6b8fd87','8c00e514-663c-4f3d-97ff-8520273d923e','Pembayaran Berhasil!','Setoran sebesar Rp 504.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-19 08:43:33','unread','2026-07-19 08:43:33','2026-07-19 08:43:33'),('f564b28a-7fa9-4b99-baef-8a38a8680669','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','testtiga baru saja mendaftar sebagai Calon Anggota.','2026-07-04 06:14:35','unread','2026-07-04 06:14:35','2026-07-04 06:14:35'),('f566919c-869b-4892-b495-f70e64b04067','8c00e514-663c-4f3d-97ff-8520273d923e','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-07-20 10:45:11','unread','2026-07-20 10:45:11','2026-07-20 10:45:11'),('f57b85aa-7916-4bd8-85d2-03d9e2fd1b46','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: test','2026-06-11 09:35:14','read','2026-06-11 09:35:14','2026-06-28 09:06:46'),('f57fd1ce-e9fc-427e-910b-02b51db5a406','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Anggota Baru','avhan hadi bijaksana telah mengirimkan data pendaftaran.','2026-07-23 21:10:33','unread','2026-07-23 21:10:33','2026-07-23 21:10:33'),('f589dc7d-da9a-49b4-a453-838996e88f7e','b0024d1f-0605-47fe-891e-156ca72ddefc','Pendaftaran Akun Baru','testempat baru saja mendaftar sebagai Calon Anggota.','2026-06-12 22:03:22','unread','2026-06-12 22:03:22','2026-06-12 22:03:22'),('f5cf040e-09cb-471a-b520-5f14ebb1b8ed','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari testDua.','2026-07-19 08:44:59','unread','2026-07-19 08:44:59','2026-07-19 08:44:59'),('f5e02d38-9ea1-478b-8dc1-49dedc012cc4','c8776dce-0b66-40ef-8be8-838f939b8932','Pengajuan Pembiayaan','Pengajuan Elektronik (laptop) senilai Rp 2.100.000 telah berhasil dikirim.','2026-06-15 22:23:14','unread','2026-06-15 22:23:14','2026-06-15 22:23:14'),('f5ebe235-4b16-4e09-921b-02051f88dfd4','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-27 23:16:55','unread','2026-06-27 23:16:55','2026-06-27 23:16:55'),('f623986f-5a02-470e-91ef-6041049e72f8','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Penarikan Disetujui!','Penarikan sebesar Rp 1.000.000 telah disetujui dan sedang diproses.','2026-06-13 01:59:20','unread','2026-06-13 01:59:20','2026-06-13 01:59:20'),('f666bc07-e4f9-4a3d-a68c-51f6f7969b9f','8c6f7722-c817-40c7-ba80-982b224f08c2','Pembayaran Berhasil!','Setoran sebesar Rp 1.000.000 telah diterima via sinkronisasi otomatis.','2026-06-28 12:54:01','unread','2026-06-28 12:54:01','2026-06-28 12:54:01'),('f6bd1386-a9b9-4343-ace9-6c688d40b5ac','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-27 23:16:17','unread','2026-06-27 23:16:17','2026-06-27 23:16:17'),('f71e89a7-8354-41d7-a598-8219dafabadc','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Pengajuan Pembiayaan','Pengajuan Darurat (Pinjaman Darurat) senilai Rp 3.000.000 telah berhasil dikirim.','2026-07-12 23:28:23','unread','2026-07-12 23:28:23','2026-07-12 23:28:23'),('f723aa4a-c6e0-4898-8899-b50e79084466','f98594e5-d43c-4acb-8052-b108c36c79cc','Pengajuan Arisan','Pengajuan bergabung grup arisan Arisan Umrah (8) berhasil dikirim dan sedang menunggu persetujuan.','2026-06-28 14:00:02','unread','2026-06-28 14:00:02','2026-06-28 14:00:02'),('f74aa144-fbf0-4b68-9498-0b833532794d','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari mohamadfahmyiqbal.','2026-07-22 06:21:42','unread','2026-07-22 06:21:42','2026-07-22 06:21:42'),('f786e603-3d71-4679-a7cf-e5545d9da4eb','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 50.000 telah diterima via sinkronisasi otomatis.','2026-07-22 06:16:34','unread','2026-07-22 06:16:34','2026-07-22 06:16:34'),('f7886af2-fc48-4558-be55-0791572d2d60','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 224.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-22 06:08:32','unread','2026-07-22 06:08:32','2026-07-22 06:08:32'),('f7e6de7d-4ac5-4de3-9985-a1d3e69805db','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Anggota Baru','iqbal fahmy telah mengirimkan data pendaftaran.','2026-07-25 01:17:08','unread','2026-07-25 01:17:08','2026-07-25 01:17:08'),('f7f4fca8-899a-4cf0-96e0-c797a4d19184','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 22:54:11','unread','2026-06-18 22:54:11','2026-06-18 22:54:11'),('f801a386-4d01-49a4-b0c6-b22ed61656b2','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari Avhan hadi.','2026-06-27 21:04:22','unread','2026-06-27 21:04:22','2026-06-27 21:04:22'),('f8252e3a-d7ca-4cd6-a520-4c5b390556c4','43643359-0f59-4ea4-bb6d-e93505733d4a','Pembayaran Berhasil!','Setoran sebesar Rp 500.000 telah diterima via sinkronisasi otomatis.','2026-07-25 01:14:50','unread','2026-07-25 01:14:50','2026-07-25 01:14:50'),('f829d094-b4d6-4f53-9c1b-bd9f85054425','d33889c0-4bf9-4745-909b-a9a726181785','Update Persetujuan savings withdrawal','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-07-04 17:56:51','unread','2026-07-04 17:56:51','2026-07-04 17:56:51'),('f850f550-5ecf-4d1f-bf7c-114adac20700','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-20 00:46:51','unread','2026-06-20 00:46:51','2026-06-20 00:46:51'),('f8e9ec6c-b31f-4a8f-ae37-e3978805c9fc','8c6f7722-c817-40c7-ba80-982b224f08c2','Pengajuan Tabungan Berhasil','Pengajuan Tabungan Qurban 2 senilai Rp 7.000.000 telah diproses.','2026-06-28 14:26:40','unread','2026-06-28 14:26:40','2026-06-28 14:26:40'),('f914f745-90cd-4528-956e-886f039a50e8','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan tabungan withdrawals','Menunggu verifikasi Anda: Pengajuan tabungan withdrawals dari testtiga.','2026-07-11 11:09:45','unread','2026-07-11 11:09:45','2026-07-11 11:09:45'),('f92db4a7-8fa1-4657-9c4c-6c13a7ab327a','d7570642-5cd5-4403-8085-66bb3927b76b','Pengajuan Tabungan Berhasil','Pengajuan anak sekolah berjangka2 senilai Rp 1.200.000 telah diproses.','2026-06-28 12:45:34','unread','2026-06-28 12:45:34','2026-06-28 12:45:34'),('f93a6c00-154e-49ed-ae40-ca361a20cb65','6c16df4e-6d44-45c4-b02b-05f022fdf1df','Update Persetujuan members','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 15:44:59','unread','2026-06-27 15:44:59','2026-06-27 15:44:59'),('f9549973-017c-4e62-addd-f3f8b2c8eed8','84f975b8-ed21-4021-b1c6-4f16933c3373','Tugas Baru','Verifikasi pendaftaran: test','2026-06-14 21:25:53','read','2026-06-14 21:25:53','2026-06-28 09:06:46'),('f9808e1e-7bb4-4576-a56c-111ed99a2c2a','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-27 21:38:02','unread','2026-06-27 21:38:02','2026-06-27 21:38:02'),('f9a5c32e-86b2-4269-9e98-33f2a7b6e796','c8776dce-0b66-40ef-8be8-838f939b8932','Update Persetujuan savings withdrawal','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-15 21:47:55','unread','2026-06-15 21:47:55','2026-06-15 21:47:55'),('f9d27f5e-4c9e-4b92-bdf7-f76732c44371','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.000.000 telah diterima via sinkronisasi otomatis.','2026-06-20 00:27:49','unread','2026-06-20 00:27:49','2026-06-20 00:27:49'),('f9e366fd-3559-4d53-bcfa-5f875de3d0de','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-06-28 14:21:03','unread','2026-06-28 14:21:03','2026-06-28 14:21:03'),('f9e5baf1-ab36-43cc-9b22-1c97d31ffcda','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','mohamadfahmyiqbal baru saja mendaftar sebagai Calon Anggota.','2026-07-22 05:59:07','unread','2026-07-22 05:59:07','2026-07-22 05:59:07'),('fa1ebc6d-cf5c-427d-bdb1-ca02fb7ddefd','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testtiga.','2026-07-10 05:58:28','unread','2026-07-10 05:58:28','2026-07-10 05:58:28'),('fa3e537a-5f65-4974-9b7c-aca944e07580','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan savings withdrawal','Menunggu verifikasi Anda: Pengajuan savings withdrawal dari Avhan hadi.','2026-06-27 21:27:26','unread','2026-06-27 21:27:26','2026-06-27 21:27:26'),('fa7f7b13-71b5-407c-902e-9fcb369822d0','5880c3cd-d403-40dd-997b-319629799cab','Pembayaran Berhasil!','Setoran sebesar Rp 1.500.000 telah diterima via sinkronisasi otomatis.','2026-06-20 00:48:18','unread','2026-06-20 00:48:18','2026-06-20 00:48:18'),('faae9bb8-be30-42fc-9105-08610bf826d9','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan Tabungan Disetujui!','Pengajuan Tabungan Anda telah disetujui.','2026-06-27 18:07:02','unread','2026-06-27 18:07:02','2026-06-27 18:07:02'),('fb203553-688d-4dc4-a6be-c85c182ea0b3','6c16df4e-6d44-45c4-b02b-05f022fdf1df','Pembayaran Berhasil!','Setoran sebesar Rp 700.000 telah diterima via sinkronisasi otomatis.','2026-06-27 15:45:51','unread','2026-06-27 15:45:51','2026-06-27 15:45:51'),('fb652d29-1755-4ed5-b06e-f737710f435c','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-18 22:02:28','unread','2026-06-18 22:02:28','2026-06-18 22:02:28'),('fb68ab3f-f7b5-41c8-baeb-8870c0f033c9','c8776dce-0b66-40ef-8be8-838f939b8932','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 13 tagihan telah dibuat.','2026-06-15 22:39:55','unread','2026-06-15 22:39:55','2026-06-15 22:39:55'),('fb77aa89-977a-4190-8bb7-78ca689d0d55','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-13 02:23:54','unread','2026-06-13 02:23:54','2026-06-13 02:23:54'),('fb7d1a32-01f5-4600-98dd-7da1aaaa9b69','927db5be-11e2-46af-a8c9-d6a37ca8963c','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-15 15:12:09','unread','2026-06-15 15:12:09','2026-06-15 15:12:09'),('fb91486c-7ef9-46c9-aba2-109ac1af9c3f','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Pembayaran Berhasil!','Setoran sebesar Rp 500.000 telah diterima via sinkronisasi otomatis.','2026-06-13 13:32:09','unread','2026-06-13 13:32:09','2026-06-13 13:32:09'),('fc15dd08-6bbd-4af9-8cd4-a92afc9b832d','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','testsatu baru saja mendaftar sebagai Calon Anggota.','2026-07-23 09:16:50','unread','2026-07-23 09:16:50','2026-07-23 09:16:50'),('fc2a0b81-95c1-4b5e-8961-41b8af33bdc7','d33889c0-4bf9-4745-909b-a9a726181785','Pengajuan Pembiayaan','Pengajuan Pelunasan Jual Beli (Pelunasan laptop) senilai Rp 4.736.004 telah berhasil dikirim.','2026-07-10 05:37:56','unread','2026-07-10 05:37:56','2026-07-10 05:37:56'),('fc2a982c-78b2-4e5d-8250-ec0cdc80fc9c','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Mohamad Fahmy Iqbal.','2026-07-20 10:41:26','unread','2026-07-20 10:41:26','2026-07-20 10:41:26'),('fc5a5fe5-ea38-4088-8aa1-a90af1e94a81','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan financing applications','Langkah \"Review Pengawas\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 14:53:13','unread','2026-06-27 14:53:13','2026-06-27 14:53:13'),('fc8d2b55-0f6a-4148-90ad-13a8a58baba6','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testTiga.','2026-06-14 11:14:17','unread','2026-06-14 11:14:17','2026-06-14 11:14:17'),('fca4abee-940e-41b0-bd67-b3b471e17031','927db5be-11e2-46af-a8c9-d6a37ca8963c','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-14 21:30:32','unread','2026-06-14 21:30:32','2026-06-14 21:30:32'),('fd152474-d6a8-41ac-8e10-2f4514332416','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan members','Menunggu verifikasi Anda: Pengajuan members dari testsatu.','2026-06-16 13:20:46','unread','2026-06-16 13:20:46','2026-06-16 13:20:46'),('fd357570-b229-4e7d-b5d3-5051b3087e0d','46b677e9-84bf-4bfa-b940-998d004882a1','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testsatu.','2026-06-19 00:50:26','unread','2026-06-19 00:50:26','2026-06-19 00:50:26'),('fd4418dc-626b-455a-bcc7-b0b731a4f60b','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari testtiga.','2026-07-10 05:43:24','unread','2026-07-10 05:43:24','2026-07-10 05:43:24'),('fd54c42e-a81a-47a0-96d9-45e0a4854ecb','b0024d1f-0605-47fe-891e-156ca72ddefc','Persetujuan financing applications','Menunggu verifikasi Anda: Pengajuan financing applications dari Budi Santoso.','2026-06-15 22:23:43','unread','2026-06-15 22:23:43','2026-06-15 22:23:43'),('fd5ef3f2-fc21-41fb-87e7-2b1e12a538f1','8c6f7722-c817-40c7-ba80-982b224f08c2','Pengajuan Pembiayaan','Pengajuan Pelunasan Jual Beli (Pelunasan motor pcx) senilai Rp 21.763.476 telah berhasil dikirim.','2026-06-28 11:24:20','unread','2026-06-28 11:24:20','2026-06-28 11:24:20'),('fe1976ae-e71e-433e-8c3e-ab576d4e0639','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 54.440 telah diterima. Keanggotaan Anda kini aktif.','2026-07-22 06:16:36','unread','2026-07-22 06:16:36','2026-07-22 06:16:36'),('fe2f457f-4f4d-4653-8ebf-737cc65c7c7f','8c6f7722-c817-40c7-ba80-982b224f08c2','Pengajuan Pembiayaan','Pengajuan Darurat (Pinjaman Darurat) senilai Rp 3.000.000 telah berhasil dikirim.','2026-06-28 11:34:18','unread','2026-06-28 11:34:18','2026-06-28 11:34:18'),('fe561d19-da75-4d07-8314-3a167204138c','5880c3cd-d403-40dd-997b-319629799cab','Update Persetujuan Sukuk','Langkah persetujuan oleh Ketua telah berhasil. Menunggu verifikasi lainnya.','2026-06-27 13:15:10','unread','2026-06-27 13:15:10','2026-06-27 13:15:10'),('fe616ae5-e37e-4ec5-a726-fdc8375b2c11','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Anggota Baru','test telah mengirimkan data pendaftaran.','2026-06-16 11:36:55','unread','2026-06-16 11:36:55','2026-06-16 11:36:55'),('fe71b52f-5582-49a3-81fd-686a8309c0c4','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembayaran Berhasil!','Setoran sebesar Rp 3.000.000 telah diterima via sinkronisasi otomatis.','2026-07-22 13:29:45','unread','2026-07-22 13:29:45','2026-07-22 13:29:45'),('feccc6f6-0156-4ebe-b9b0-0a84580e151c','e2e9a4aa-d37b-444b-8b42-8da3159e986b','Arisan Disetujui!','Selamat! Pengajuan arisan Anda telah disetujui. Silahkan cek tagihan untuk setoran pertama.','2026-07-12 23:46:17','unread','2026-07-12 23:46:17','2026-07-12 23:46:17'),('fece4387-1fb9-48c5-b534-1a489aad9874','46b677e9-84bf-4bfa-b940-998d004882a1','Pendaftaran Akun Baru','mohamadfahmyiqbal baru saja mendaftar sebagai Calon Anggota.','2026-07-22 05:54:20','unread','2026-07-22 05:54:20','2026-07-22 05:54:20'),('ff0c0a1c-68d4-46e1-967a-ab777f5e81f9','5880c3cd-d403-40dd-997b-319629799cab','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-28 12:59:54','unread','2026-06-28 12:59:54','2026-06-28 12:59:54'),('ff447c59-3f70-4a2e-bde9-547415a2d64e','dd0eb1e6-6296-4bf3-9338-492cf0c988bb','Pengajuan financing applications Disetujui','Pengajuan telah disetujui sepenuhnya.','2026-06-13 12:03:39','unread','2026-06-13 12:03:39','2026-06-13 12:03:39'),('ff44f7ca-e246-4d4c-b74b-25421a709f3c','0a7fd51a-6494-4202-89b6-94641b105fbb','Pembiayaan Disetujui!','Pembiayaan Anda telah disetujui. 3 tagihan telah dibuat.','2026-07-22 13:25:45','unread','2026-07-22 13:25:45','2026-07-22 13:25:45'),('ff844316-c5ff-4770-a308-71d3ea1fb91e','927db5be-11e2-46af-a8c9-d6a37ca8963c','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-14 21:30:00','unread','2026-06-14 21:30:00','2026-06-14 21:30:00'),('ffcdb8c9-b28d-4005-aeab-0ab7382b283b','84f975b8-ed21-4021-b1c6-4f16933c3373','Pendaftaran Akun Baru','Ade Sugianto baru saja mendaftar sebagai Calon Anggota.','2026-06-17 18:56:46','read','2026-06-17 18:56:46','2026-06-28 09:06:46'),('ffd4fc40-ba3b-4aa9-9c1a-b77c2d3190ee','f98594e5-d43c-4acb-8052-b108c36c79cc','Update Persetujuan financing applications','Langkah \"Approval Ketua\" disetujui. Menunggu verifikasi berikutnya.','2026-06-27 21:35:15','unread','2026-06-27 21:35:15','2026-06-27 21:35:15');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `session_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `reset_token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reset_token` (`reset_token`),
  KEY `reset_token_idx` (`reset_token`),
  KEY `session_id_idx` (`session_id`),
  KEY `member_id_idx` (`member_id`),
  KEY `expires_at_idx` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES ('dbcdac40-6567-41e0-8ab6-9cea76ddd558','7746b36c-7bff-4e36-8735-f7ab867a894b','bfed1d505ef342585cb82b87f8aa281ac95229d4bc3679f4f9420bffbd01c3db','2026-06-19 22:23:18','2026-06-19 22:10:18','5880c3cd-d403-40dd-997b-319629799cab','2026-06-19 22:08:18','2026-06-19 22:10:18');
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_fee_configs`
--

DROP TABLE IF EXISTS `payment_fee_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_fee_configs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `payment_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fee_type` enum('FLAT','PERCENTAGE','FLAT_AND_PERCENTAGE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FLAT',
  `flat_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `percentage_fee` decimal(5,4) NOT NULL DEFAULT '0.0000',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_type` (`payment_type`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_fee_configs`
--

LOCK TABLES `payment_fee_configs` WRITE;
/*!40000 ALTER TABLE `payment_fee_configs` DISABLE KEYS */;
INSERT INTO `payment_fee_configs` VALUES (1,'bank_transfer','Transfer Bank (Virtual Account)','FLAT',4440.00,0.0000,'2026-07-12 23:04:37','2026-07-12 23:04:37'),(2,'ewallet','E-Wallet','PERCENTAGE',0.00,2.0000,'2026-07-12 23:04:37','2026-07-12 23:04:37'),(3,'qris','QRIS','PERCENTAGE',0.00,0.7000,'2026-07-12 23:04:37','2026-07-12 23:04:37'),(4,'cstore','Gerai Retail','FLAT',5550.00,0.0000,'2026-07-12 23:04:37','2026-07-12 23:04:37'),(5,'credit_card','Kartu Kredit / Debit','FLAT_AND_PERCENTAGE',2000.00,2.9000,'2026-07-12 23:04:37','2026-07-12 23:04:37');
/*!40000 ALTER TABLE `payment_fee_configs` ENABLE KEYS */;
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
  `method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `fk_payment_invoice` (`invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pinjaman_aktiva_tetap_transactions`
--

DROP TABLE IF EXISTS `pinjaman_aktiva_tetap_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pinjaman_aktiva_tetap_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tanggal` date NOT NULL,
  `no_transaksi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pic` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keperluan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis` enum('DEBET','KREDIT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `jumlah` decimal(15,2) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `no_transaksi` (`no_transaksi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pinjaman_aktiva_tetap_transactions`
--

LOCK TABLES `pinjaman_aktiva_tetap_transactions` WRITE;
/*!40000 ALTER TABLE `pinjaman_aktiva_tetap_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `pinjaman_aktiva_tetap_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pinjaman_hutang_transactions`
--

DROP TABLE IF EXISTS `pinjaman_hutang_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pinjaman_hutang_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tanggal` date NOT NULL,
  `no_transaksi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pic` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keperluan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis` enum('DEBET','KREDIT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `jumlah` decimal(15,2) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `no_transaksi` (`no_transaksi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pinjaman_hutang_transactions`
--

LOCK TABLES `pinjaman_hutang_transactions` WRITE;
/*!40000 ALTER TABLE `pinjaman_hutang_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `pinjaman_hutang_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pinjaman_modal_transactions`
--

DROP TABLE IF EXISTS `pinjaman_modal_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pinjaman_modal_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tanggal` date NOT NULL,
  `no_transaksi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pic` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keperluan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis` enum('DEBET','KREDIT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `jumlah` decimal(15,2) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `no_transaksi` (`no_transaksi`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pinjaman_modal_transactions`
--

LOCK TABLES `pinjaman_modal_transactions` WRITE;
/*!40000 ALTER TABLE `pinjaman_modal_transactions` DISABLE KEYS */;
INSERT INTO `pinjaman_modal_transactions` VALUES (1,'2026-06-20','MOD-PL-20260620-5273','Bapak Pengawas','Saldo Tahun Lalu','DEBET',5000000.00,'2026-06-20 21:23:00','2026-06-20 21:23:00'),(2,'2024-01-01','MODAL-2024-001','Admin','Modal Awal 2024','DEBET',10000000.00,'2024-01-01 10:00:00','2024-01-01 10:00:00'),(6,'2024-01-01','MODAL-2024-1781969559692','Admin','Modal Awal 2024','DEBET',10000000.00,'2024-01-01 10:00:00','2024-01-01 10:00:00'),(7,'2024-01-01','MODAL-2024-1781969599053','Admin','Modal Awal 2024','DEBET',10000000.00,'2024-01-01 10:00:00','2024-01-01 10:00:00');
/*!40000 ALTER TABLE `pinjaman_modal_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program_options`
--

DROP TABLE IF EXISTS `program_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `program_options` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `program_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_options`
--

LOCK TABLES `program_options` WRITE;
/*!40000 ALTER TABLE `program_options` DISABLE KEYS */;
/*!40000 ALTER TABLE `program_options` ENABLE KEYS */;
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
  `member_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `started_datetime` datetime DEFAULT NULL,
  `finished_datetime` datetime DEFAULT NULL,
  `answered_count` int DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`attempt_id`),
  KEY `fk_quiz_attempt_quiz` (`quiz_id`),
  KEY `fk_quiz_attempt_member` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `question_count` int DEFAULT NULL,
  `duration_minutes` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`quiz_id`),
  KEY `fk_quiz_track` (`track_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `ranking_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `total_score` int DEFAULT '0',
  `completed_materials` int DEFAULT '0',
  `rank_position` int DEFAULT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`ranking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `receipt_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issued_datetime` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`receipt_id`),
  UNIQUE KEY `receipt_number` (`receipt_number`),
  KEY `fk_receipt_payment` (`payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`target_bill_id`),
  KEY `fk_stb_member_target` (`member_saving_target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `payment_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`target_payment_id`),
  KEY `fk_stp_bill` (`target_bill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `saving_target_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `target_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_amount` decimal(18,2) DEFAULT NULL,
  `term_months` int DEFAULT NULL,
  `min_monthly_deposit` decimal(18,2) DEFAULT NULL,
  `akad_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`saving_target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saving_targets`
--

LOCK TABLES `saving_targets` WRITE;
/*!40000 ALTER TABLE `saving_targets` DISABLE KEYS */;
INSERT INTO `saving_targets` VALUES ('1825a555-259a-4a88-8489-e05cec6a94ca','Tabungan Pendidikan Berjangka 2','Pendidikan',1200000.00,12,NULL,'Mudharabah','2026-06-28 12:44:16','2026-06-28 13:24:29'),('36206bdf-3780-4cf9-8a17-11096b7a84da','Tabungan Qurban','Qurban',3600000.00,12,NULL,'Mudharabah','2026-06-27 23:35:04','2026-06-28 13:21:58'),('5fab0cb0-2ce6-4feb-9062-0a787d091cfb','Tabungan Haji','Haji',25000000.00,36,694445.00,'Mudharabah','2026-06-27 06:38:06','2026-06-28 13:23:06'),('b914e5b0-dbd6-4da3-ac46-43ce90e66dbb','Tabungan Qurban 2','Qurban',7000000.00,12,NULL,'Mudharabah','2026-06-28 14:24:21','2026-06-28 14:24:21'),('cf92bffc-c75b-4b24-9fd8-07b651c048e8','Tabungan Umroh','Umrah',30000000.00,24,NULL,'Mudharabah','2026-06-27 17:59:02','2026-06-28 13:22:39'),('ec8ff798-62e7-408c-afe1-009dfa55597c','Tabungan Pendiikan Berjangka','Pendidikan',2400000.00,12,NULL,'Mudharabah','2026-06-28 12:42:19','2026-06-28 13:24:04');
/*!40000 ALTER TABLE `saving_targets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings`
--

DROP TABLE IF EXISTS `savings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings` (
  `savings_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `savings_type` enum('SUKARELA','WAJIB','BERJANGKA') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `transaction_date` date NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','COMPLETED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `approval_flow_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `current_step_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`savings_id`),
  KEY `approval_flow_id` (`approval_flow_id`),
  KEY `current_step_id` (`current_step_id`),
  KEY `savings_member_id` (`member_id`),
  KEY `savings_savings_type` (`savings_type`),
  KEY `savings_status` (`status`),
  KEY `savings_transaction_date` (`transaction_date`),
  KEY `savings_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings`
--

LOCK TABLES `savings` WRITE;
/*!40000 ALTER TABLE `savings` DISABLE KEYS */;
/*!40000 ALTER TABLE `savings` ENABLE KEYS */;
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
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`savings_bill_id`),
  KEY `fk_sb_account` (`savings_account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings_bills`
--

LOCK TABLES `savings_bills` WRITE;
/*!40000 ALTER TABLE `savings_bills` DISABLE KEYS */;
/*!40000 ALTER TABLE `savings_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings_journal_reports`
--

DROP TABLE IF EXISTS `savings_journal_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings_journal_reports` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `period` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `debet` decimal(18,2) DEFAULT '0.00',
  `kredit` decimal(18,2) DEFAULT '0.00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings_journal_reports`
--

LOCK TABLES `savings_journal_reports` WRITE;
/*!40000 ALTER TABLE `savings_journal_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `savings_journal_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings_products`
--

DROP TABLE IF EXISTS `savings_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings_products` (
  `savings_product_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `product_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `akad_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`savings_product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings_products`
--

LOCK TABLES `savings_products` WRITE;
/*!40000 ALTER TABLE `savings_products` DISABLE KEYS */;
INSERT INTO `savings_products` VALUES ('b4e03a39-4e0c-4e81-8737-5c27d7444cb0','SW_POKOK','Simpanan Pokok','Wadiah','2026-06-11 16:52:28','2026-06-11 16:56:12'),('c85cff52-0439-454d-ad68-46223c254996','SS_SUKARELA','Simpanan Sukarela','Mudharabah','2026-06-11 16:52:28','2026-06-11 16:52:28'),('e0ca2126-93f7-4577-ab5b-ce69cf95e8d0','SW_WAJIB','Simpanan Wajib','Wadiah','2026-06-11 16:52:28','2026-06-11 16:52:28');
/*!40000 ALTER TABLE `savings_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings_report_lists`
--

DROP TABLE IF EXISTS `savings_report_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings_report_lists` (
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tahun_ini_pokok` decimal(18,2) DEFAULT '0.00',
  `tahun_ini_wajib` decimal(18,2) DEFAULT '0.00',
  `tahun_ini_sukarela` decimal(18,2) DEFAULT '0.00',
  `tahun_ini_total` decimal(18,2) DEFAULT '0.00',
  `tahun_lalu_pokok` decimal(18,2) DEFAULT '0.00',
  `tahun_lalu_wajib` decimal(18,2) DEFAULT '0.00',
  `tahun_lalu_sukarela` decimal(18,2) DEFAULT '0.00',
  `tahun_lalu_total` decimal(18,2) DEFAULT '0.00',
  `tahun_lalu2_pokok` decimal(18,2) DEFAULT '0.00',
  `tahun_lalu2_wajib` decimal(18,2) DEFAULT '0.00',
  `tahun_lalu2_sukarela` decimal(18,2) DEFAULT '0.00',
  `tahun_lalu2_total` decimal(18,2) DEFAULT '0.00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`member_id`),
  CONSTRAINT `savings_report_lists_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings_report_lists`
--

LOCK TABLES `savings_report_lists` WRITE;
/*!40000 ALTER TABLE `savings_report_lists` DISABLE KEYS */;
INSERT INTO `savings_report_lists` VALUES ('0900ac2d-4515-43c8-ae46-2bb1b27d5758','Budi Santoso',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,'2026-07-25 01:14:03','2026-07-25 01:14:03'),('0a7fd51a-6494-4202-89b6-94641b105fbb','mohamadfahmyiqbal',500000.00,2640000.00,900000.00,4040000.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,'2026-07-22 06:04:34','2026-07-22 06:04:34'),('46b677e9-84bf-4bfa-b940-998d004882a1','Ibu Bendahara',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,'2026-06-16 13:57:58','2026-06-16 13:57:58'),('4e0a7229-ead2-4d54-add6-05ca832a7815','Budi Santoso',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,'2026-07-25 01:14:03','2026-07-25 01:14:03'),('54520291-edd7-400a-b12a-44876c8aa5d7','Budi Santoso',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,'2026-07-25 01:14:03','2026-07-25 01:14:03'),('5e714c26-43e6-44a0-8a1e-def3f3290190','Avhan Hadi Bijaksa a',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,'2026-07-25 01:13:19','2026-07-25 01:13:19'),('7731a0b6-62b3-4235-80d7-4294957b9ab6','testsatu',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,'2026-07-25 01:14:03','2026-07-25 01:14:03'),('84f975b8-ed21-4021-b1c6-4f16933c3373','Bapak Pengawas',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,'2026-06-16 13:57:59','2026-06-16 13:57:59'),('b0024d1f-0605-47fe-891e-156ca72ddefc','Bapak Ketua',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,'2026-06-16 13:58:00','2026-06-16 13:58:00'),('df603033-5528-4dde-885f-407c1015e488','testsatu',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,'2026-07-25 01:28:18','2026-07-25 01:28:18');
/*!40000 ALTER TABLE `savings_report_lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings_reports`
--

DROP TABLE IF EXISTS `savings_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings_reports` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `year` int NOT NULL,
  `total_pokok` decimal(18,2) DEFAULT '0.00',
  `total_wajib` decimal(18,2) DEFAULT '0.00',
  `total_sukarela` decimal(18,2) DEFAULT '0.00',
  `total_all` decimal(18,2) DEFAULT '0.00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `savings_reports_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings_reports`
--

LOCK TABLES `savings_reports` WRITE;
/*!40000 ALTER TABLE `savings_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `savings_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings_transactions`
--

DROP TABLE IF EXISTS `savings_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings_transactions` (
  `savings_tx_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `savings_account_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `tx_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `tx_datetime` datetime NOT NULL,
  `method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approved_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `invoice_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`savings_tx_id`),
  KEY `savings_transactions_savings_account_id` (`savings_account_id`),
  KEY `savings_transactions_invoice_id` (`invoice_id`),
  KEY `savings_transactions_approved_status` (`approved_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `withdrawal_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `savings_account_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `member_saving_target_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `request_datetime` datetime DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approval_flow_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `current_step_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `invoice_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `midtrans_transaction_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `transfer_proof_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transfer_proof` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`withdrawal_id`),
  KEY `savings_account_id` (`savings_account_id`),
  KEY `member_id` (`member_id`),
  KEY `approval_flow_id` (`approval_flow_id`),
  KEY `current_step_id` (`current_step_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings_withdrawals`
--

LOCK TABLES `savings_withdrawals` WRITE;
/*!40000 ALTER TABLE `savings_withdrawals` DISABLE KEYS */;
INSERT INTO `savings_withdrawals` VALUES ('06e7d5c1-65f2-47fd-9a41-f8f293a5774c','8465c10e-771d-4f07-9f5f-076c23e5bab6',NULL,'0a7fd51a-6494-4202-89b6-94641b105fbb',50000.00,'TRANSFER','Mandiri','82728782837','2026-07-22 07:43:28','READY_TO_PAY','14b1b5ca-a82e-4dd8-a62c-55688eba7927',NULL,NULL,NULL,'2026-07-22 07:43:28','2026-07-22 07:43:28','uploads/transfers/06e7d5c1-65f2-47fd-9a41-f8f293a5774c_wd_1784691748865.png',NULL),('c1fb93f6-b0a3-461c-bdc2-c592588c848f','8465c10e-771d-4f07-9f5f-076c23e5bab6',NULL,'0a7fd51a-6494-4202-89b6-94641b105fbb',50000.00,'TRANSFER','Mandiri','82728782837','2026-07-22 06:21:13','READY_TO_PAY','14b1b5ca-a82e-4dd8-a62c-55688eba7927',NULL,NULL,NULL,'2026-07-22 06:21:13','2026-07-22 06:21:13','uploads/transfers/c1fb93f6-b0a3-461c-bdc2-c592588c848f_wd_1784676298160.png',NULL),('cb6cb9c5-ae22-420b-b1ac-aa53d6852ab7','8465c10e-771d-4f07-9f5f-076c23e5bab6',NULL,'0a7fd51a-6494-4202-89b6-94641b105fbb',50000.00,'TRANSFER','Mandiri','82728782837','2026-07-22 10:46:14','READY_TO_PAY','14b1b5ca-a82e-4dd8-a62c-55688eba7927',NULL,NULL,NULL,'2026-07-22 10:46:14','2026-07-22 10:46:14','uploads/transfers/cb6cb9c5-ae22-420b-b1ac-aa53d6852ab7_wd_1784692721282.png',NULL);
/*!40000 ALTER TABLE `savings_withdrawals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sukuk_issues`
--

DROP TABLE IF EXISTS `sukuk_issues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sukuk_issues` (
  `issue_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `issue_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(18,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('OPEN','CLOSED','FULLY_PAID') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OPEN',
  `issuer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'Koperasi',
  `type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Sukuk Ritel',
  `coupon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `min_investment` decimal(18,2) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT '100.00',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `tenor` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '12 Bulan',
  PRIMARY KEY (`issue_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `order_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `sukuk_issue_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `order_date` datetime NOT NULL,
  `status` enum('PENDING','READY_TO_PAY','WAITING_PAYMENT','APPROVED','PAID','REJECTED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `is_approved_pengawas` tinyint(1) NOT NULL DEFAULT '0',
  `is_approved_ketua` tinyint(1) NOT NULL DEFAULT '0',
  `is_approved_bendahara` tinyint(1) NOT NULL DEFAULT '0',
  `rejected_reason` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `transfer_proof` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `sukuk_issue_id` (`sukuk_issue_id`),
  KEY `member_id` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `payout_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payout_month` int DEFAULT NULL,
  `payout_year` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sukuk_payout_id`),
  KEY `fk_sukuk_schedule_issue` (`sukuk_issue_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `payout_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payout_no` int DEFAULT NULL,
  `payout_month` int DEFAULT NULL,
  `payout_year` int DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sukuk_payout_tx_id`),
  KEY `fk_sukuk_payout_order` (`sukuk_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `member_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
  `request_datetime` datetime DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approval_flow_id` bigint DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tabungan_withdrawal_id`),
  KEY `fk_tw_member_target` (`member_saving_target_id`),
  KEY `fk_tw_member` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabungan_withdrawals`
--

LOCK TABLES `tabungan_withdrawals` WRITE;
/*!40000 ALTER TABLE `tabungan_withdrawals` DISABLE KEYS */;
/*!40000 ALTER TABLE `tabungan_withdrawals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transaction_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `bill_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `midtrans_order_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `midtrans_transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `midtrans_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tx_type` enum('SETORAN','PENARIKAN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SETORAN',
  `is_ledger_recorded` tinyint(1) DEFAULT '0',
  `tx_category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `va_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `settlement_time` datetime DEFAULT NULL,
  `status` enum('PENDING','PAID','EXPIRED','CANCELED','FAILED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `fraud_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_message` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdf_url` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`transaction_id`),
  UNIQUE KEY `midtrans_order_id` (`midtrans_order_id`),
  KEY `member_id` (`member_id`),
  KEY `bill_id` (`bill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES ('06949128-770f-41db-b52c-f9409a138328','0a7fd51a-6494-4202-89b6-94641b105fbb','3fcced9e-390b-42ad-87ff-3139c39ecee0','BILL-3fcced9e-390b-42ad-87ff-3139c39ecee0-858D8F18',NULL,NULL,'SETORAN',1,'MEMBER_REGISTRATION','bank_transfer',NULL,NULL,NULL,54880000.00,'2026-07-22 13:50:43','PAID',NULL,NULL,NULL,'2026-07-22 13:50:20','2026-07-22 13:50:43'),('1749f92d-e104-4eff-868c-acbd35229833','0a7fd51a-6494-4202-89b6-94641b105fbb',NULL,'WD-06e7d5c1-65f2-47fd-9a41-f8f293a5774c-1784691749036',NULL,NULL,'PENARIKAN',0,'SS_SUKARELA',NULL,NULL,NULL,NULL,50000.00,'2026-07-22 10:42:29','PAID',NULL,NULL,NULL,'2026-07-22 10:42:29','2026-07-22 10:42:29'),('286d42b2-9373-4b65-a0f3-25f645e466ca','0a7fd51a-6494-4202-89b6-94641b105fbb','eef9d19f-ef8c-4426-956c-2bf9639a5245','BILL-eef9d19f-ef8c-4426-956c-2bf9639a5245-03B796CA',NULL,NULL,'SETORAN',1,'MEMBER_REGISTRATION','bank_transfer',NULL,NULL,NULL,220000.00,'2026-07-22 06:08:32','PAID',NULL,NULL,NULL,'2026-07-22 06:08:20','2026-07-22 06:08:32'),('36c28c7f-bc93-4a38-8ce4-ac244110675c','0a7fd51a-6494-4202-89b6-94641b105fbb',NULL,'WD-c1fb93f6-b0a3-461c-bdc2-c592588c848f-1784676298541',NULL,NULL,'PENARIKAN',0,'SS_SUKARELA',NULL,NULL,NULL,NULL,50000.00,'2026-07-22 06:24:58','PAID',NULL,NULL,NULL,'2026-07-22 06:24:58','2026-07-22 06:24:58'),('3a131f24-a462-4868-8efc-e1a71ae0f7cb','0a7fd51a-6494-4202-89b6-94641b105fbb','cd06f4e3-0609-4b46-a2ea-9d621a1d3679','BILL-cd06f4e3-0609-4b46-a2ea-9d621a1d3679-14DEC849',NULL,NULL,'SETORAN',0,'MEMBER_REGISTRATION','bank_transfer',NULL,NULL,NULL,220000.00,NULL,'EXPIRED',NULL,NULL,NULL,'2026-07-22 06:12:26','2026-07-23 06:13:29'),('3decfb65-739c-4ca7-bbfa-aa54c9e004af','0a7fd51a-6494-4202-89b6-94641b105fbb','0f05d180-9fd9-4852-904a-b9d84a2c9a30','BILL-0f05d180-9fd9-4852-904a-b9d84a2c9a30-8CD2A55E',NULL,NULL,'SETORAN',0,'MEMBER_REGISTRATION','bank_transfer',NULL,NULL,NULL,500000.00,NULL,'EXPIRED',NULL,NULL,NULL,'2026-07-22 06:20:36','2026-07-23 06:21:37'),('48858994-a865-4938-a7c1-a250994363ff','0a7fd51a-6494-4202-89b6-94641b105fbb','42d6c7c4-71ac-434d-a666-718d8b798216','BILL-42d6c7c4-71ac-434d-a666-718d8b798216-EAA18416',NULL,NULL,'SETORAN',1,'FINANCING_PAYMENT','bank_transfer',NULL,NULL,NULL,4736004.00,'2026-07-22 13:13:38','PAID',NULL,NULL,NULL,'2026-07-22 13:13:13','2026-07-22 13:13:39'),('8580da98-d038-457f-83ce-b1a3a672d9ea','0a7fd51a-6494-4202-89b6-94641b105fbb',NULL,'WD-cb6cb9c5-ae22-420b-b1ac-aa53d6852ab7-1784692721523',NULL,NULL,'PENARIKAN',0,'SS_SUKARELA',NULL,NULL,NULL,NULL,50000.00,'2026-07-22 10:58:41','PAID',NULL,NULL,NULL,'2026-07-22 10:58:41','2026-07-22 10:58:41'),('8688416c-8736-4e06-a4b0-011cf291ba7b','0a7fd51a-6494-4202-89b6-94641b105fbb','985ba766-0b10-4051-9cb8-4f06b723792c','BILL-985ba766-0b10-4051-9cb8-4f06b723792c-05FC2EE3',NULL,NULL,'SETORAN',1,'MEMBER_REGISTRATION','bank_transfer',NULL,NULL,NULL,220000.00,'2026-07-22 06:09:23','PAID',NULL,NULL,NULL,'2026-07-22 06:09:13','2026-07-22 06:09:23'),('897bac98-389f-484d-a06b-ba41caeda794','0a7fd51a-6494-4202-89b6-94641b105fbb','65056d7c-2caa-4726-821c-dabaa317a043','BILL-65056d7c-2caa-4726-821c-dabaa317a043-E9615240',NULL,NULL,'SETORAN',1,'MEMBER_REGISTRATION','bank_transfer',NULL,NULL,NULL,500000.00,'2026-07-22 06:18:30','PAID',NULL,NULL,NULL,'2026-07-22 06:18:18','2026-07-22 06:18:30'),('a2e0ead3-2ff5-4cdd-a0eb-cb6292e0e5f7','0a7fd51a-6494-4202-89b6-94641b105fbb','d14855d8-c991-41c2-97b6-66c6cbb4f1f1','BILL-d14855d8-c991-41c2-97b6-66c6cbb4f1f1-C324CCCF',NULL,NULL,'SETORAN',1,'MEMBER_REGISTRATION','bank_transfer',NULL,NULL,NULL,220000.00,'2026-07-22 06:07:12','PAID',NULL,NULL,NULL,'2026-07-22 06:07:04','2026-07-22 06:07:12'),('ad1911a5-0d85-46a8-89f3-591a90e22851','0a7fd51a-6494-4202-89b6-94641b105fbb','d3f37ba3-6af4-427f-be17-90aabf850f94','BILL-d3f37ba3-6af4-427f-be17-90aabf850f94-DB415CEC',NULL,NULL,'SETORAN',1,'MEMBER_REGISTRATION','bank_transfer',NULL,NULL,NULL,720000.00,'2026-07-22 06:05:09','PAID',NULL,NULL,NULL,'2026-07-22 06:04:57','2026-07-22 06:05:09'),('c39fb911-bbb3-4bcf-828c-90fe11d567ce','0a7fd51a-6494-4202-89b6-94641b105fbb','748217ca-c0df-4f65-8d91-543f2f3bd3a6','BILL-748217ca-c0df-4f65-8d91-543f2f3bd3a6-4A257437',NULL,NULL,'SETORAN',1,'MEMBER_REGISTRATION','bank_transfer',NULL,NULL,NULL,220000.00,'2026-07-22 06:12:44','PAID',NULL,NULL,NULL,'2026-07-22 06:12:33','2026-07-22 06:12:44'),('ca14d8d5-69be-4ff1-8227-e67dc4f4363a','0a7fd51a-6494-4202-89b6-94641b105fbb','432431cd-14d3-4041-b655-6536902620fc','BILL-432431cd-14d3-4041-b655-6536902620fc-C81715D8',NULL,NULL,'SETORAN',1,'FINANCING_PAYMENT','bank_transfer',NULL,NULL,NULL,1500000.00,'2026-07-22 11:39:29','PAID',NULL,NULL,NULL,'2026-07-22 11:38:51','2026-07-22 11:39:29'),('cd2fd2e3-ab1f-4f68-b0a5-5ff9a9463c8f','0a7fd51a-6494-4202-89b6-94641b105fbb','664ef54f-8f94-44a8-8b1e-64adff736a98','BILL-664ef54f-8f94-44a8-8b1e-64adff736a98-954FEC7B',NULL,NULL,'SETORAN',1,'MEMBER_REGISTRATION','bank_transfer',NULL,NULL,NULL,220000.00,'2026-07-22 06:07:40','PAID',NULL,NULL,NULL,'2026-07-22 06:07:30','2026-07-22 06:07:40'),('d7b8ee46-d646-4939-8bf8-2e78365db6a1','0a7fd51a-6494-4202-89b6-94641b105fbb','fffc762a-0113-431b-9d64-fadfc4b28155','BILL-fffc762a-0113-431b-9d64-fadfc4b28155-0119A73F',NULL,NULL,'SETORAN',1,'FINANCING_PAYMENT','bank_transfer',NULL,NULL,NULL,3000000.00,'2026-07-22 13:29:44','PAID',NULL,NULL,NULL,'2026-07-22 13:29:21','2026-07-22 13:29:44'),('db74ef21-9865-4615-839d-a3736a5dcd2d','0a7fd51a-6494-4202-89b6-94641b105fbb','c4f4ffb3-67a2-4826-9a41-d9dbe498a221','BILL-c4f4ffb3-67a2-4826-9a41-d9dbe498a221-4E69F338',NULL,NULL,'SETORAN',1,'MEMBER_REGISTRATION','bank_transfer',NULL,NULL,NULL,500000.00,'2026-07-22 06:20:57','PAID',NULL,NULL,NULL,'2026-07-22 06:20:48','2026-07-22 06:20:57'),('dc5f2e28-f521-4997-a903-1d027c984ee8','0a7fd51a-6494-4202-89b6-94641b105fbb','2d412bed-d575-4dce-b480-02d30c1545ce','BILL-2d412bed-d575-4dce-b480-02d30c1545ce-31D5D29B',NULL,NULL,'SETORAN',1,'MEMBER_REGISTRATION','bank_transfer',NULL,NULL,NULL,50000.00,'2026-07-22 06:16:35','PAID',NULL,NULL,NULL,'2026-07-22 06:16:27','2026-07-22 06:16:35'),('de6d2d03-cda3-41e1-a97b-78bb5ae2d63b','0a7fd51a-6494-4202-89b6-94641b105fbb','34d6482a-d551-4861-80e0-6f63856fc661','BILL-34d6482a-d551-4861-80e0-6f63856fc661-C9981760',NULL,NULL,'SETORAN',1,'MEMBER_REGISTRATION','bank_transfer',NULL,NULL,NULL,220000.00,'2026-07-22 06:14:17','PAID',NULL,NULL,NULL,'2026-07-22 06:14:07','2026-07-22 06:14:17'),('ffde429b-8b82-4cce-b1b0-75ecd341c0e8','0a7fd51a-6494-4202-89b6-94641b105fbb','2bf35276-cd60-44c5-aa98-20799b8d8c88','BILL-2bf35276-cd60-44c5-aa98-20799b8d8c88-920CAFFF',NULL,NULL,'SETORAN',1,'MEMBER_REGISTRATION','bank_transfer',NULL,NULL,NULL,220000.00,'2026-07-22 06:09:44','PAID',NULL,NULL,NULL,'2026-07-22 06:09:34','2026-07-22 06:09:44');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `role_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES ('6','Anggota Luar Biasa'),('5','Anggota Reguler'),('4','Bendahara'),('1','Calon Anggota'),('3','Ketua'),('2','Pengawas');
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
  `va_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`virtual_account_id`),
  UNIQUE KEY `va_number` (`va_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `virtual_accounts`
--

LOCK TABLES `virtual_accounts` WRITE;
/*!40000 ALTER TABLE `virtual_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `virtual_accounts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-01  0:00:06
