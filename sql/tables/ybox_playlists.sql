
DROP TABLE IF EXISTS ybox_playlists;

CREATE TABLE ybox_playlists (
	id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	track_id VARCHAR(32) NULL,
	artist VARCHAR(64) NOT NULL,
	track VARCHAR(64) NOT NULL,
	counter INT NOT NULL DEFAULT 0,
	mode ENUM('DJ','BAR') NOT NULL,
	slug VARCHAR(32) NOT NULL,
	user_id BIGINT NOT NULL,
	status ENUM('new','played','viewed') NOT NULL DEFAULT 'new',
	created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	#CONSTRAINT UNIQUE UN_ybox_playlists_source (mode, slug, track_id),
	INDEX IX_ybox_playlist_user_id (user_id)
);

