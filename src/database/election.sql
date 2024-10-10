CREATE TABLE IF NOT EXISTS `users` (
   `id_number` INT(10) NOT NULL PRIMARY KEY,
   `firstname` VARCHAR(255) NOT NULL,
   `lastname` VARCHAR(255) NOT NULL,
   `middlename` VARCHAR(255),
   `email` VARCHAR(100),
   `cp_number` VARCHAR(25),
   `course` VARCHAR(50) NOT NULL,
   `year_level` VARCHAR(10),
   `section` VARCHAR(255),
   `program_description` VARCHAR(255),
	`is_active` TINYINT(1),
	`user_group` VARCHAR(255),
	`password` VARCHAR(255),
	`year_active` INT(4),
   `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `elections` (
   `election_id` VARCHAR(50) NOT NULL PRIMARY KEY,
   `election_name` VARCHAR(50) NOT NULL,
   `date_start` DATE NOT NULL,
   `time_start` TIME NOT NULL,
   `date_end` DATE NOT NULL,
   `time_end` TIME NOT NULL,
   `is_active` TINYINT(1) DEFAULT 1,
   `is_close` TINYINT(1) DEFAULT 0,
   `total_populations` INT DEFAULT 0,
   `deleted_at` TIMESTAMP NULL,
   `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `roles` (
   `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   `id_number` INT(10) NOT NULL, 
   `admin` TINYINT(1) DEFAULT 0,
   `voter` TINYINT(1) DEFAULT 0,
   `program_head` TINYINT(1) DEFAULT 0,
   FOREIGN KEY (`id_number`) REFERENCES `users`(`id_number`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `voters` (
   `voter_id` VARCHAR(50) NOT NULL PRIMARY KEY,
   `id_number` INT(10) NOT NULL, 
   `voted` TINYINT(1) DEFAULT 0,
   `election_id` VARCHAR(50),
   FOREIGN KEY (`id_number`) REFERENCES `users`(`id_number`),
   FOREIGN KEY (`election_id`) REFERENCES `elections`(`election_id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `candidates` (
   `candidate_id` VARCHAR(50) NOT NULL PRIMARY KEY,
   `id_number` INT(10) NOT NULL,
   `position` VARCHAR(50) NOT NULL,
   -- `alias` VARCHAR(50) NOT NULL,
   `department` VARCHAR(50) NOT NULL,
   `party` VARCHAR(50) NOT NULL,
   `enabled` TINYINT(1) NOT NULL DEFAULT 1,
   `deleted` TIMESTAMP NULL,
   `vote_count` INT DEFAULT 0,
   `candidate_profile` VARCHAR(250),
   `election_id` VARCHAR(50),
   `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (`id_number`) REFERENCES `users`(`id_number`),
   FOREIGN KEY (`election_id`) REFERENCES `elections`(`election_id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `votes` (
   `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
   `voter_id` INT(10) NOT NULL, 
   `candidate_id` INT(10) NOT NULL,
   `position` VARCHAR(50) NOT NULL,
   `time_casted` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   `election_id` VARCHAR(50),
   FOREIGN KEY (`voter_id`) REFERENCES `users`(`id_number`),
   FOREIGN KEY (`candidate_id`) REFERENCES `users`(`id_number`),
   FOREIGN KEY (`election_id`) REFERENCES `elections`(`election_id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `election_logs` (
   `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
   `election_id` VARCHAR(50),
   `total_voters` INT DEFAULT 0, 
   `total_voted` INT DEFAULT 0,
   FOREIGN KEY (`election_id`) REFERENCES `elections`(`election_id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `election_results` (
   `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
   `election_id` VARCHAR(50),
   `department` VARCHAR(50) NOT NULL, 
   `id_number` INT(10) NOT NULL,
   `total_votes` INT DEFAULT 0,
   `position` VARCHAR(50) NOT NULL,
   `date_elected` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (`id_number`) REFERENCES `users`(`id_number`),
   FOREIGN KEY (`election_id`) REFERENCES `elections`(`election_id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `register_devices` (
   `uuid` VARCHAR(50) NOT NULL PRIMARY KEY,
   `codename` VARCHAR(50) NOT NULL,
   `date_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
   `is_registered` TINYINT(1) DEFAULT 0,
   `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   `deleted_at` TIMESTAMP NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `otp_codes` (
   `id` VARCHAR(50) NOT NULL PRIMARY KEY,
   `id_number` VARCHAR(50) NOT NULL,
   `otp_code` INT(6), 
   `expiration` TIMESTAMP NOT NULL,
   `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   `is_used` TINYINT(1) DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `face_image` (
   `id` VARCHAR(50) NOT NULL PRIMARY KEY,
   `id_number` INT(10) NOT NULL,
   `face_image` BLOB, 
   `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (`id_number`) REFERENCES `users`(`id_number`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `program_populations` (
   `id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
   `program_code` VARCHAR(100) NOT NULL,
   `program_population` INT DEFAULT 0,
   `election_id` VARCHAR(50),
   FOREIGN KEY (`election_id`) REFERENCES `elections`(`election_id`)
) ENGINE=InnoDB;

CREATE TABLE ip_address (
   `ip_address_id` INT AUTO_INCREMENT PRIMARY KEY,
   `program_name` VARCHAR(99) NOT NULL,
   `ip_address` VARCHAR(45) NOT NULL,
   `network_name` VARCHAR(99) NOT NULL,   
   `deleted_at` TIMESTAMP NULL, 
   `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
) ENGINE=InnoDB;

CREATE TABLE departments (
   `department_id` INT AUTO_INCREMENT PRIMARY KEY,
   `department_code` VARCHAR(99) NOT NULL,
   `max_select_senator` INT DEFAULT 1,
   `deleted_at` TIMESTAMP NULL, 
   `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
) ENGINE=InnoDB;

CREATE TABLE programs (
   `program_id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
   `program_code` VARCHAR(99) NOT NULL,
   `department` INT NOT NULL,
   `deleted_at` TIMESTAMP NULL,
   `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (`department`) REFERENCES `departments`(`department_id`)
) ENGINE=InnoDB;

CREATE TABLE positions (
   `position_id` INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
   `position` VARCHAR(99) NOT NULL,
   `deleted_at` TIMESTAMP NULL,
   `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;