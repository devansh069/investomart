/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `ad_banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ad_banner` (
  `ad_id` int NOT NULL,
  `ad_name` varchar(255) NOT NULL,
  `ad_image_name` varchar(255) NOT NULL,
  `ad_url` varchar(255) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: inactive 1 active',
  `time` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `amenities` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `app_personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `app_personal_access_tokens_token_unique` (`token`),
  KEY `app_personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `app_personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `app_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_users` (
  `id` int NOT NULL,
  `mobile_number` varchar(15) NOT NULL,
  `referral_code` varchar(12) DEFAULT NULL,
  `user_type` varchar(20) NOT NULL DEFAULT 'broker',
  `referred_by` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `City` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `country_code` varchar(5) NOT NULL DEFAULT '+91',
  `status` int NOT NULL DEFAULT '1',
  `isdelete` int NOT NULL DEFAULT '0',
  `delete_by` int DEFAULT NULL,
  `delete_at` datetime DEFAULT NULL,
  `add_by` int NOT NULL DEFAULT '0',
  `update_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `baner_img`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baner_img` (
  `cid` int NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `m_image` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `bank_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bank_name` (
  `id` int NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `logo` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `bilder_proj`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bilder_proj` (
  `bid` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `pname` varchar(255) NOT NULL,
  `pid` int NOT NULL AUTO_INCREMENT,
  `plogo` varchar(255) DEFAULT NULL,
  `pimage` varchar(255) DEFAULT NULL,
  `pdescription` varchar(20000) NOT NULL,
  `status` int DEFAULT '1',
  `created_by` int DEFAULT '1',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `builder_img`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `builder_img` (
  `cid` int NOT NULL,
  `cname` varchar(255) NOT NULL,
  `show_home` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0 :not show 1: show',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `m_image` varchar(255) NOT NULL,
  `overview` longtext NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `career_page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `career_page` (
  `id` int NOT NULL,
  `designation` varchar(255) NOT NULL,
  `job_location` varchar(255) NOT NULL,
  `qualification` varchar(255) NOT NULL,
  `ctc` varchar(255) NOT NULL,
  `experience` varchar(255) NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `add_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `city` (
  `id` int NOT NULL AUTO_INCREMENT,
  `city` varchar(222) DEFAULT NULL,
  `title` text,
  `description` text,
  `keywords` text,
  `content` text,
  `commercial_projects_content` text,
  `property_content` text,
  `new_projects_content` text,
  `state_id` int DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `show_on_home` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `citymain`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citymain` (
  `id` int NOT NULL,
  `main city` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contents` (
  `id` int NOT NULL,
  `cont_title` varchar(255) NOT NULL DEFAULT '',
  `title` longtext NOT NULL,
  `metatag` longtext NOT NULL,
  `discription` longtext NOT NULL,
  `contents` longtext NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `countrylist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countrylist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cname` varchar(255) NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `enquiry1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enquiry1` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `property_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `assigned_member_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files` (
  `fid` int NOT NULL,
  `mnumber` varchar(255) NOT NULL,
  `mnumber2` varchar(255) NOT NULL,
  `mnumber3` varchar(255) NOT NULL,
  `mnumber4` varchar(255) NOT NULL,
  `mnumber5` varchar(255) NOT NULL,
  `bemail` varchar(255) NOT NULL,
  `status` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `footer_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `footer_link` (
  `adid` int NOT NULL,
  `link_1` varchar(255) NOT NULL,
  `adstatus` binary(1) NOT NULL DEFAULT ' ',
  `bannername` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `form_otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_otp` (
  `id` bigint NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `mobile` bigint DEFAULT NULL,
  `otp` int DEFAULT NULL,
  `add_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `forums_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forums_comment` (
  `id` int NOT NULL,
  `memid` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `cat` varchar(255) NOT NULL,
  `sub_cat` int NOT NULL,
  `description` longtext NOT NULL,
  `fcity` varchar(22) NOT NULL,
  `flocality` varchar(22) NOT NULL,
  `status` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `forums_reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forums_reply` (
  `id` int NOT NULL,
  `memid` int NOT NULL,
  `forum_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `cat` varchar(255) NOT NULL,
  `sub_cat` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `fcity` varchar(22) NOT NULL,
  `flocality` varchar(22) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `hero_banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hero_banner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT '',
  `subtitle` varchar(255) DEFAULT '',
  `banner_image` varchar(255) NOT NULL,
  `mobile_banner_image` varchar(255) DEFAULT NULL,
  `target_url` varchar(500) DEFAULT '',
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `home_slider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `home_slider` (
  `id` int NOT NULL,
  `slider_image` varchar(255) NOT NULL,
  `purl` varchar(255) NOT NULL,
  `project_id` int NOT NULL DEFAULT '0',
  `status` int NOT NULL DEFAULT '1',
  `isdelete` int NOT NULL DEFAULT '0',
  `add_date` datetime DEFAULT NULL,
  `update_date` datetime DEFAULT NULL,
  KEY `idx_proj` (`project_id`,`status`,`isdelete`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `homepage_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homepage_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `link_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `im_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `im_accounts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `legacy_user_id` bigint unsigned DEFAULT NULL,
  `country_code` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '+91',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'client',
  `provider_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_name` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile` json DEFAULT NULL,
  `phone_verified_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `im_accounts_phone_unique` (`phone`),
  UNIQUE KEY `im_accounts_legacy_user_id_unique` (`legacy_user_id`),
  KEY `im_accounts_email_index` (`email`),
  KEY `im_accounts_role_index` (`role`),
  KEY `im_accounts_provider_type_index` (`provider_type`),
  KEY `im_accounts_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `im_admin_audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `im_admin_audit_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `actor_account_id` bigint unsigned DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `im_admin_audit_logs_actor_account_id_foreign` (`actor_account_id`),
  KEY `im_admin_audit_logs_subject_type_subject_id_index` (`subject_type`,`subject_id`),
  KEY `im_admin_audit_logs_action_index` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `im_inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `im_inquiries` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `listing_source` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `listing_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_account_id` bigint unsigned DEFAULT NULL,
  `client_account_id` bigint unsigned DEFAULT NULL,
  `channel` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'form',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `client_name` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_email` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `move_in_date` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `contacted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `im_inquiries_client_account_id_foreign` (`client_account_id`),
  KEY `im_inquiries_provider_account_id_status_created_at_index` (`provider_account_id`,`status`,`created_at`),
  KEY `im_inquiries_listing_source_listing_id_index` (`listing_source`,`listing_id`),
  KEY `im_inquiries_channel_index` (`channel`),
  KEY `im_inquiries_status_index` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `im_listing_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `im_listing_favorites` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `account_id` bigint unsigned NOT NULL,
  `listing_source` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `listing_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `im_favorites_unique_listing` (`account_id`,`listing_source`,`listing_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `im_listing_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `im_listing_media` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `listing_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `disk` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 's3',
  `object_key` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `media_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'image',
  `sort_order` smallint unsigned NOT NULL DEFAULT '0',
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `im_listing_media_listing_id_sort_order_index` (`listing_id`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `im_listing_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `im_listing_plans` (
  `code` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_paise` int unsigned NOT NULL,
  `additional_slots` smallint unsigned NOT NULL,
  `duration_days` smallint unsigned NOT NULL DEFAULT '30',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`code`),
  KEY `im_listing_plans_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `im_listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `im_listings` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_account_id` bigint unsigned NOT NULL,
  `reference` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `property_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `listing_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(14,2) NOT NULL,
  `price_period` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bedrooms` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bathrooms` tinyint unsigned DEFAULT NULL,
  `area` decimal(12,2) DEFAULT NULL,
  `area_unit` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `furnishing` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deposit` decimal(14,2) DEFAULT NULL,
  `city` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `amenities` json DEFAULT NULL,
  `details` json DEFAULT NULL,
  `contact_name` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primary_image_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approval_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `provider_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `capacity_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'eligible',
  `slot_priority` int unsigned NOT NULL DEFAULT '0',
  `review_note` text COLLATE utf8mb4_unicode_ci,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `approved_by_account_id` bigint unsigned DEFAULT NULL,
  `views_count` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `im_listings_reference_unique` (`reference`),
  KEY `im_listing_provider_state_idx` (`provider_account_id`,`approval_status`,`provider_status`),
  KEY `im_listing_public_state_idx` (`approval_status`,`provider_status`,`capacity_status`),
  KEY `im_listings_property_type_index` (`property_type`),
  KEY `im_listings_listing_type_index` (`listing_type`),
  KEY `im_listings_bedrooms_index` (`bedrooms`),
  KEY `im_listings_area_index` (`area`),
  KEY `im_listings_furnishing_index` (`furnishing`),
  KEY `im_listings_city_index` (`city`),
  KEY `im_listings_location_index` (`location`),
  KEY `im_listings_approval_status_index` (`approval_status`),
  KEY `im_listings_provider_status_index` (`provider_status`),
  KEY `im_listings_capacity_status_index` (`capacity_status`),
  KEY `im_listings_slot_priority_index` (`slot_priority`),
  KEY `im_listings_submitted_at_index` (`submitted_at`),
  KEY `im_listings_approved_at_index` (`approved_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `im_otp_challenges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `im_otp_challenges` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country_code` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '+91',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL DEFAULT '0',
  `sent_at` timestamp NOT NULL,
  `expires_at` timestamp NOT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `request_fingerprint` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `im_otp_challenges_phone_index` (`phone`),
  KEY `im_otp_challenges_expires_at_index` (`expires_at`),
  KEY `im_otp_challenges_request_fingerprint_index` (`request_fingerprint`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `im_plan_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `im_plan_orders` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_account_id` bigint unsigned NOT NULL,
  `plan_code` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount_paise` int unsigned NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INR',
  `receipt` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gateway` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'razorpay',
  `gateway_order_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gateway_payment_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
  `gateway_payload` json DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `im_plan_orders_receipt_unique` (`receipt`),
  UNIQUE KEY `im_plan_orders_gateway_order_id_unique` (`gateway_order_id`),
  UNIQUE KEY `im_plan_orders_gateway_payment_id_unique` (`gateway_payment_id`),
  KEY `im_plan_orders_provider_account_id_status_index` (`provider_account_id`,`status`),
  KEY `im_plan_orders_status_index` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `im_provider_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `im_provider_subscriptions` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_account_id` bigint unsigned NOT NULL,
  `plan_order_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plan_code` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `additional_slots` smallint unsigned NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `starts_at` timestamp NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `im_provider_subscriptions_plan_order_id_unique` (`plan_order_id`),
  KEY `im_sub_provider_active_idx` (`provider_account_id`,`status`,`expires_at`),
  KEY `im_provider_subscriptions_status_index` (`status`),
  KEY `im_provider_subscriptions_starts_at_index` (`starts_at`),
  KEY `im_provider_subscriptions_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `localities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `localities` (
  `lid` int NOT NULL,
  `lname` varchar(255) NOT NULL,
  `title` text,
  `description` text,
  `keywords` text,
  `content` mediumtext,
  `lcity` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `login_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_attempts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `attempts` int DEFAULT '0',
  `IP` varchar(50) DEFAULT '',
  `user` varchar(100) DEFAULT '',
  `pass` varchar(255) DEFAULT '',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `login_ip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_ip` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ip` varchar(50) NOT NULL,
  `attempts` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ip` (`ip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `maincategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maincategory` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `manage_assure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manage_assure` (
  `cid` int NOT NULL,
  `cname` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `m_image` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `marbanner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marbanner` (
  `cid` int NOT NULL,
  `cname` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `m_image` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `member_vew`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_vew` (
  `mem_id` int NOT NULL,
  `mem_name` varchar(255) NOT NULL,
  `mem_view` varchar(255) NOT NULL,
  `member` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `money`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `money` (
  `id` int NOT NULL,
  `name` varchar(200) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `news_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news_tbl` (
  `n_id` bigint NOT NULL,
  `newstitle` varchar(255) NOT NULL,
  `ndate` varchar(255) NOT NULL,
  `newsdescript` longtext NOT NULL,
  `newsstatus` binary(1) NOT NULL,
  `newsimage` varchar(255) NOT NULL,
  `status` binary(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `offer_page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offer_page` (
  `id` int NOT NULL,
  `pname` varchar(255) NOT NULL,
  `paddress` varchar(255) NOT NULL,
  `plogo` varchar(255) NOT NULL,
  `ptype` varchar(255) NOT NULL,
  `pplan` varchar(255) NOT NULL,
  `pstartat` varchar(255) NOT NULL,
  `pOffer` varchar(255) NOT NULL,
  `pdescription` text NOT NULL,
  `purl` varchar(255) NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `isdelete` int NOT NULL DEFAULT '0',
  `add_date` datetime NOT NULL,
  `update_date` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otps` (
  `id` int NOT NULL,
  `mobile_number` varchar(15) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plans` (
  `id` int NOT NULL,
  `p_name` varchar(50) NOT NULL,
  `p_type` enum('owner','broker') NOT NULL DEFAULT 'owner',
  `p_duration` int NOT NULL COMMENT 'Duration in months',
  `p_listing_no` int NOT NULL COMMENT 'Number of listings allowed',
  `p_price` decimal(10,2) DEFAULT '0.00',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `p_price_monthly` decimal(10,2) NOT NULL DEFAULT '0.00',
  `p_listing_expiry_months` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `pojectplann`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pojectplann` (
  `prplan_id` int NOT NULL AUTO_INCREMENT,
  `ppid` varchar(255) NOT NULL,
  `pbedroom` varchar(255) DEFAULT NULL,
  `ptarea` int NOT NULL,
  `ptareaunit` varchar(255) NOT NULL DEFAULT 'Sq.Ft',
  `view` int DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `pbsp` varchar(255) DEFAULT NULL,
  `pedc_idc` varchar(255) DEFAULT NULL,
  `pparking` varchar(255) DEFAULT NULL,
  `pclubchage` varchar(255) DEFAULT NULL,
  `ptprice` varchar(255) DEFAULT NULL,
  `pbamount` int DEFAULT NULL,
  `floorplan` varchar(255) NOT NULL,
  `jkhk` varchar(255) DEFAULT NULL,
  `bedroom` varchar(255) NOT NULL,
  `balconies` int DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`prplan_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` int NOT NULL,
  `category` int NOT NULL,
  `builder` int NOT NULL,
  `city` int NOT NULL,
  `localiy` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `size` varchar(255) NOT NULL,
  `ps` varchar(10) NOT NULL,
  `unitsize` varchar(255) NOT NULL,
  `ps2` varchar(10) NOT NULL,
  `plan` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `money` int NOT NULL,
  `subtype` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `completiondate` varchar(255) NOT NULL,
  `overview` longtext NOT NULL,
  `about_builder` longtext NOT NULL,
  `feature` longtext NOT NULL,
  `other_feature` longtext NOT NULL,
  `other_project` longtext NOT NULL,
  `builder_logo` varchar(255) NOT NULL,
  `project_logo` varchar(255) NOT NULL,
  `project_baner` varchar(255) NOT NULL,
  `spotlight_baner` varchar(255) DEFAULT NULL,
  `project_site` text,
  `location_plan` text,
  `specification_plan` longtext NOT NULL,
  `payment_plan` text,
  `app_form` varchar(255) NOT NULL,
  `brochure` varchar(255) NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `til` longtext NOT NULL,
  `con` longtext NOT NULL,
  `meta` longtext NOT NULL,
  `searching` longtext NOT NULL,
  `createdby` int NOT NULL DEFAULT '1',
  `ppricelist` varchar(255) NOT NULL,
  `ppunit` varchar(255) DEFAULT NULL,
  `pplan` varchar(255) DEFAULT NULL,
  `project_siteb` text NOT NULL,
  `ppricelistt` longtext NOT NULL,
  `payment_plant` longtext NOT NULL,
  `pricem` varchar(255) NOT NULL,
  `completiondatem` varchar(255) NOT NULL,
  `type1` int NOT NULL DEFAULT '1',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `projid` varchar(11) NOT NULL,
  `add_time` varchar(255) NOT NULL,
  `amenities` varchar(255) NOT NULL,
  `bank` varchar(255) NOT NULL,
  `pageview` int NOT NULL DEFAULT '0',
  `show_home` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0 :not show 1: show',
  `spotlight` int NOT NULL DEFAULT '0' COMMENT '0 no 1 yes',
  `show_ready_to_move` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0 :not show 1: show',
  `tower_name` varchar(255) DEFAULT 'Tower',
  `notower` varchar(255) DEFAULT NULL,
  `nounit` varchar(255) DEFAULT NULL,
  `configurations` varchar(255) DEFAULT NULL,
  `property_price` varchar(255) DEFAULT NULL,
  `rera` varchar(255) NOT NULL,
  `project_rera_qr_code` varchar(255) DEFAULT NULL,
  `archname` varchar(255) NOT NULL,
  `p_title` varchar(255) NOT NULL,
  `p_description` varchar(255) NOT NULL,
  `p_keywords` varchar(255) NOT NULL,
  `url_type` int DEFAULT '1' COMMENT '1 : old 2 : new',
  `features_dec` text,
  `location_dec` text,
  `site_plan_dec` text,
  `floor_plan_dec` text,
  `faq` text,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `video_link` text,
  `add_by` int DEFAULT '1',
  `update_by` int DEFAULT '1',
  `update_lock` int DEFAULT '1' COMMENT '1 for no 2 for yes',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `project_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_category` (
  `lid` int NOT NULL,
  `lname` varchar(255) NOT NULL,
  `lcity` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `project_faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_faq` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question` text,
  `answer` text,
  `reference_id` int NOT NULL,
  `type` int NOT NULL COMMENT '1 for proj 2 for property',
  `is_delete` int NOT NULL DEFAULT '0',
  `add_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `project_galery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_galery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `galery_image` varchar(222) DEFAULT NULL,
  `decription` text,
  `reference_id` int NOT NULL,
  `type` int NOT NULL COMMENT '1 for proj 2 for property',
  `is_delete` int NOT NULL DEFAULT '0',
  `add_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `project_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_review` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `project_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_phone` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` decimal(2,1) NOT NULL DEFAULT '5.0',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `review` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `ip_address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `property`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property` (
  `pro_id` int NOT NULL,
  `user_plan_id` int DEFAULT NULL COMMENT 'FK → user_plans.id — which plan slot was consumed for this listing',
  `pro_for` varchar(100) NOT NULL,
  `pro_type` varchar(100) NOT NULL,
  `pro_cat` int NOT NULL,
  `pro_name` varchar(100) NOT NULL,
  `pro_city` varchar(100) NOT NULL,
  `por_location` varchar(100) NOT NULL,
  `por_builder` varchar(100) NOT NULL,
  `por_size` varchar(100) NOT NULL,
  `por_sq1` varchar(10) NOT NULL,
  `por_plan` varchar(100) NOT NULL,
  `por_inr` varchar(100) NOT NULL,
  `por_money` varchar(100) NOT NULL,
  `por_unit` varchar(100) DEFAULT NULL,
  `ppunit` varchar(255) DEFAULT NULL,
  `por_sq2` varchar(10) NOT NULL,
  `por_sub` varchar(100) NOT NULL,
  `por_bed` varchar(10) NOT NULL,
  `pro_bath` varchar(100) DEFAULT NULL,
  `pro_bal` varchar(100) DEFAULT NULL,
  `garden` int DEFAULT NULL,
  `reserve_Parking` int DEFAULT NULL,
  `visitor_Parking` int DEFAULT NULL,
  `swimming` int DEFAULT NULL,
  `powerbackup` int DEFAULT NULL,
  `lift` int DEFAULT NULL,
  `club` int DEFAULT NULL,
  `security` int DEFAULT NULL,
  `gym` int DEFAULT NULL,
  `por_logo` varchar(100) DEFAULT NULL,
  `por_contact` varchar(100) DEFAULT NULL,
  `por_rent` longtext,
  `bus` varchar(255) DEFAULT NULL,
  `rls` varchar(255) DEFAULT NULL,
  `atm` varchar(255) DEFAULT NULL,
  `school` varchar(255) DEFAULT NULL,
  `hospital` varchar(255) DEFAULT NULL,
  `por_overview` longtext,
  `por_other_feat` longtext,
  `por_other_pro` longtext,
  `por_baner` varchar(100) DEFAULT NULL,
  `por_img_1` varchar(100) DEFAULT NULL,
  `por_img_2` varchar(100) DEFAULT NULL,
  `por_img_3` varchar(100) DEFAULT NULL,
  `por_img_4` varchar(100) DEFAULT NULL,
  `por_img_5` varchar(100) DEFAULT NULL,
  `por_img_6` varchar(255) DEFAULT NULL,
  `por_img_7` varchar(255) DEFAULT NULL,
  `status` int DEFAULT '0',
  `til` longtext,
  `con` longtext,
  `meta` longtext,
  `fet` int DEFAULT NULL,
  `mam_id` varchar(255) DEFAULT NULL,
  `searching` longtext,
  `pro_locmap` varchar(255) DEFAULT NULL,
  `pro_posdate` varchar(255) DEFAULT NULL,
  `pro_ptype` varchar(255) DEFAULT NULL,
  `pro_pstatus` varchar(255) DEFAULT NULL,
  `amenities` varchar(255) DEFAULT NULL,
  `floorNumber` varchar(255) DEFAULT NULL,
  `totalFloorNumber` varchar(255) DEFAULT NULL,
  `transactionType` varchar(255) DEFAULT NULL,
  `completiondatem` varchar(255) DEFAULT NULL,
  `crore` int DEFAULT NULL,
  `lakh` int DEFAULT NULL,
  `thousand` int DEFAULT NULL,
  `hundred` int DEFAULT NULL,
  `availFromMonth` varchar(255) DEFAULT NULL,
  `maintenance` varchar(100) DEFAULT NULL,
  `brokerExcuse` varchar(255) DEFAULT NULL,
  `proj` varchar(255) DEFAULT NULL,
  `userid` varchar(255) NOT NULL,
  `postdate` varchar(255) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `projid` int NOT NULL,
  `add_time` varchar(255) NOT NULL,
  `pageview` int NOT NULL DEFAULT '0',
  `por_master` varchar(255) DEFAULT NULL,
  `por_locationmap` varchar(255) DEFAULT NULL,
  `pooja_rooms` varchar(255) DEFAULT NULL,
  `study_rooms` varchar(255) DEFAULT NULL,
  `servant_rooms` varchar(255) DEFAULT NULL,
  `others_rooms` varchar(255) DEFAULT NULL,
  `parking` varchar(255) DEFAULT NULL,
  `overlooking` varchar(255) DEFAULT NULL,
  `facing` varchar(255) DEFAULT NULL,
  `flat_view` varchar(255) DEFAULT NULL,
  `property_type` varchar(255) DEFAULT NULL,
  `property_age` varchar(255) DEFAULT NULL,
  `floor_number` varchar(255) DEFAULT NULL,
  `avg_price` varchar(255) DEFAULT NULL,
  `super_area` varchar(255) DEFAULT NULL,
  `project_area` varchar(255) DEFAULT NULL,
  `configuration` varchar(255) DEFAULT NULL,
  `transaction_type` varchar(255) DEFAULT NULL,
  `total_unit` varchar(255) DEFAULT NULL,
  `total_tower` varchar(255) DEFAULT NULL,
  `car_parking` int DEFAULT NULL,
  `show_home` enum('0','1') DEFAULT '0',
  `price_breakup` varchar(255) DEFAULT NULL,
  `booking_amount` varchar(255) DEFAULT NULL,
  `unit_no` varchar(255) DEFAULT NULL,
  `landmarks` varchar(255) DEFAULT NULL,
  `flooring` varchar(255) DEFAULT NULL,
  `type_of_ownership` varchar(255) DEFAULT NULL,
  `additional_rooms` varchar(255) DEFAULT NULL,
  `water_availability` varchar(255) DEFAULT NULL,
  `status_of_electricity` varchar(255) DEFAULT NULL,
  `video_link` varchar(255) DEFAULT NULL,
  `update_time` datetime DEFAULT '2025-12-19 15:18:23',
  `is_delete` int DEFAULT '0' COMMENT '0 no 1 yes',
  `delete_date` datetime DEFAULT NULL,
  `delete_by` int DEFAULT NULL,
  `is_boosted` tinyint(1) NOT NULL DEFAULT '0',
  `boosted_at` datetime DEFAULT NULL,
  `boost_expires_at` datetime DEFAULT NULL,
  `listing_expires_at` date DEFAULT NULL,
  `listing_expired` tinyint(1) NOT NULL DEFAULT '0',
  `project_id` int DEFAULT NULL,
  `mobile_status` enum('pending','approved','rejected','paused','archived') DEFAULT NULL,
  `rejection_reason` text,
  `submitted_at` datetime DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `approved_by` int unsigned DEFAULT NULL,
  `source` enum('website','mobile') NOT NULL DEFAULT 'website',
  KEY `property_mobile_status_index` (`mobile_status`),
  KEY `property_source_index` (`source`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `property_cat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_cat` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `property_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_status_history` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int unsigned NOT NULL,
  `from_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
  `acted_by_admin_id` int unsigned DEFAULT NULL,
  `acted_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `source` enum('mobile_app','admin_api','web_admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin_api',
  PRIMARY KEY (`id`),
  KEY `property_status_history_property_id_index` (`property_id`),
  KEY `property_status_history_acted_at_index` (`acted_at`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `propertyf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `propertyf` (
  `pro_id` int NOT NULL,
  `pro_for` varchar(100) NOT NULL,
  `pro_type` varchar(100) NOT NULL,
  `pro_cat` varchar(100) NOT NULL,
  `pro_name` varchar(100) NOT NULL,
  `pro_city` varchar(100) NOT NULL,
  `por_location` varchar(100) NOT NULL,
  `por_builder` varchar(100) NOT NULL,
  `por_size` varchar(100) NOT NULL,
  `por_plan` varchar(100) NOT NULL,
  `por_inr` varchar(100) NOT NULL,
  `por_money` varchar(100) NOT NULL,
  `por_unit` varchar(100) NOT NULL,
  `por_sub` varchar(100) NOT NULL,
  `por_bed` int NOT NULL,
  `pro_bath` varchar(100) NOT NULL,
  `pro_bal` varchar(100) NOT NULL,
  `garden` int NOT NULL,
  `reserve_Parking` int NOT NULL,
  `visitor_Parking` int NOT NULL,
  `swimming` int NOT NULL,
  `powerbackup` int NOT NULL,
  `lift` int NOT NULL,
  `club` int NOT NULL,
  `security` int NOT NULL,
  `gym` int NOT NULL,
  `por_logo` varchar(100) NOT NULL,
  `por_contact` varchar(100) NOT NULL,
  `por_rent` longtext NOT NULL,
  `bus` varchar(255) NOT NULL,
  `rls` varchar(255) NOT NULL,
  `atm` varchar(255) NOT NULL,
  `school` varchar(255) NOT NULL,
  `hospital` varchar(255) NOT NULL,
  `por_overview` longtext NOT NULL,
  `por_other_feat` longtext NOT NULL,
  `por_other_pro` longtext NOT NULL,
  `por_baner` varchar(100) NOT NULL,
  `por_img_1` varchar(100) NOT NULL,
  `por_img_2` varchar(100) NOT NULL,
  `por_img_3` varchar(100) NOT NULL,
  `por_img_4` varchar(100) NOT NULL,
  `por_img_5` varchar(100) NOT NULL,
  `por_img_6` varchar(255) NOT NULL,
  `por_img_7` varchar(255) NOT NULL,
  `status` int NOT NULL,
  `til` longtext NOT NULL,
  `con` longtext NOT NULL,
  `meta` longtext NOT NULL,
  `mam_id` varchar(255) NOT NULL,
  `searching` longtext NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `prperty_for`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prperty_for` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `redirect_urls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `redirect_urls` (
  `id` int NOT NULL,
  `current_url` varchar(255) NOT NULL,
  `new_url` varchar(255) NOT NULL,
  `add_date` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sqf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sqf` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `statelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statelist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `country_id` int NOT NULL DEFAULT '236',
  `sname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `country_id` (`country_id`),
  KEY `sname` (`sname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `tbl_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `tbl_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_setting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `tbl_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_fullname` varchar(255) DEFAULT '',
  `user_email` varchar(255) DEFAULT '',
  `roleid` varchar(50) DEFAULT 'admin',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `last_login` datetime DEFAULT NULL,
  `lastactive` datetime DEFAULT NULL,
  `roletype` tinyint(1) DEFAULT '0',
  `parrent_id` int DEFAULT '0',
  `proj_create` tinyint(1) DEFAULT '0',
  `proj_edit` tinyint(1) DEFAULT '0',
  `proj_del` tinyint(1) DEFAULT '0',
  `pro_create` tinyint(1) DEFAULT '0',
  `pro_edit` tinyint(1) DEFAULT '0',
  `pro_del` tinyint(1) DEFAULT '0',
  `content_update` tinyint(1) DEFAULT '0',
  `update_con_email` tinyint(1) DEFAULT '0',
  `last_update_by` int DEFAULT '0',
  `builder_access` tinyint(1) DEFAULT '0',
  `review_access` tinyint(1) DEFAULT '0',
  `enquiry_access` tinyint(1) DEFAULT '0',
  `member_access` tinyint(1) DEFAULT '0',
  `setting_access` tinyint(1) DEFAULT '0',
  `property_approve` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test` (
  `id` int NOT NULL AUTO_INCREMENT,
  `json` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `add_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `city` varchar(255) DEFAULT '',
  `status` int DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (1,'2026_10_23_000000_create_app_personal_access_tokens_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (2,'2026_10_24_000000_create_investormart_application_tables',2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (3,'2026_10_24_000001_convert_investormart_tables_to_innodb',3);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (4,'2026_10_24_002649_create_cache_table',4);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (5,'2026_11_02_000001_add_mobile_property_workflow',5);
