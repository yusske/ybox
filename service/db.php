<?php
$db = array(
	'host' => '127.0.0.1',
	'user' => 'root',
	'pwd' => 'orion',
	'db' => 'ybox',
	'salt' => 'AS0234j1asik1249d'
);

$fb = array(
	'appid' => '156413491211564',
	'secret' => 'f4c94afd6564cec047a7e4b4a7ae974c'
);

$db_connection = false;

function db_connect() {
	global $db, $db_connection;
	$db_connection = new mysqli($db['host'], $db['user'], $db['pwd'], $db['db']);
	return $db_connection;
};

function db_insert($sql) {
	global $db_connection;
	$r = $db_connection->query($sql);
	if ($r) return $db_connection->insert_id;
	else return false;
}

function db_update($sql) {
	global $db_connection;
	$r = $db_connection->query($sql);
	if ($r) return true;
	else return false;
}

function db_select($sql) {
	global $db_connection;
	$result = array();
	$r = $db_connection->query($sql);
	$a = $r->fetch_assoc();
	while ($a) {
		$result[] = $a;
		$a = $r->fetch_assoc();
	}
	$r->close();
	return $result;
}

?>
