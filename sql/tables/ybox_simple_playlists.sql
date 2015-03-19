
DROP TABLE IF EXISTS ybox_simple_playlists;

CREATE TABLE ybox_simple_playlists (
	id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	track VARCHAR(128) NOT NULL,
	counter INT NOT NULL DEFAULT 0,
	mode ENUM('DJ','BAR') NOT NULL,
	slug VARCHAR(32) NOT NULL,
	user_id BIGINT NOT NULL,
	status ENUM('new','played','discarded') NOT NULL DEFAULT 'new',
	created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	INDEX IX_ybox_playlist_user_id (user_id)
);

