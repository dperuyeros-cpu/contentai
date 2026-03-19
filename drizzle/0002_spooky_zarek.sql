ALTER TABLE `generations` MODIFY COLUMN `type` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `generations` ADD `industry` varchar(64) DEFAULT 'general' NOT NULL;--> statement-breakpoint
ALTER TABLE `generations` ADD `imageUrl` text;--> statement-breakpoint
ALTER TABLE `generations` ADD `tone` varchar(32) DEFAULT 'professional' NOT NULL;