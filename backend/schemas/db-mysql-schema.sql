DROP DATABASE IF EXISTS `delivery-system`;
CREATE DATABASE `delivery-system` /*!40100 COLLATE 'utf8_general_ci' */;

USE `delivery-system`;

DROP TABLE IF EXISTS `resident`;
CREATE TABLE `resident` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`address` VARCHAR(50) NULL DEFAULT NULL,
	`unit_number` VARCHAR(50) NULL DEFAULT NULL,
	`email` VARCHAR(50) NULL DEFAULT NULL,
	`password` VARCHAR(50) NULL DEFAULT NULL,
	`name` VARCHAR(50) NULL DEFAULT NULL,
	`phone_number` VARCHAR(50) NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
)
COLLATE='utf8_general_ci'
;

DROP TABLE IF EXISTS `active_session`;
CREATE TABLE `active_session` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`private_key` VARCHAR(50) NULL DEFAULT NULL,
	`is_admin` BIT(1) NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
)
COLLATE='utf8_general_ci'
;


DROP TABLE IF EXISTS `package_unit`;
CREATE TABLE `package_unit` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`code` VARCHAR(50) NULL DEFAULT NULL,
	`package_is_delivered` BIT(1) NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
)
COLLATE='utf8_general_ci'
;

DROP TABLE IF EXISTS `building`;
CREATE TABLE `building` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`address` VARCHAR(50) NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
)
COLLATE='utf8_general_ci'
;

DROP TABLE IF EXISTS `security_admin`;
CREATE TABLE `security_admin` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NULL DEFAULT NULL,
	`password` VARCHAR(50) NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
)
COLLATE='utf8_general_ci'
;

ALTER TABLE `resident`
	ADD CONSTRAINT `fk_resident_package_unit` FOREIGN KEY (`id`) REFERENCES `package_unit` (`id`);

ALTER TABLE `building`
	ADD CONSTRAINT `fk_building_package_unit` FOREIGN KEY (`id`) REFERENCES `package_unit` (`id`);

