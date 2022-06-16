CREATE DATABASE db_contacts;
CREATE user 'springuser'@'%' identified BY 'ThePassword';
GRANT all ON db_contacts.* TO 'springuser'@'%';
USE db_contacts;

CREATE TABLE `tag` (
  `id` bigint NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tag_title_unq` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `contact` (
  `id` bigint NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `version` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `contact_tag` (
  `contact_id` bigint NOT NULL,
  `tag_id` bigint NOT NULL,
  PRIMARY KEY (`contact_id`,`tag_id`),
  KEY `FKpneddg7gg88c2k534t9ird6b5` (`tag_id`),
  CONSTRAINT `FK4kjpbhoeb2bb2xrcxt1cj2c9f` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`),
  CONSTRAINT `FKpneddg7gg88c2k534t9ird6b5` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci