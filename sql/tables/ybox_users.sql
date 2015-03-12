
DROP TABLE IF EXISTS ybox_users;

CREATE TABLE ybox_users (
	id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(64) NOT NULL UNIQUE,
	password CHAR(40) NOT NULL,--sha encoded
	fname VARCHAR(64) NOT NULL,
	lname VARCHAR(64) NOT NULL,
	role ENUM('user','dj','bar','admin') NOT NULL DEFAULT 'user',
	created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	active ENUM('true','false') DEFAULT 'false',
	
	#Password recovery stuff
	pwdtoken CHAR(40) NULL DEFAULT '',--sha encoded
	pwdtoken_expires DATETIME NULL
);

