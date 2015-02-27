<?php
	require_once("db.php");

	$songName = $_REQUEST['sn'];
	$clientId = $_REQUEST['cid'];

	
	header("Access-Control-Allow-Origin: *");
	header("Content-type: text/json");
	$input = array('songName' => $songName);
	$output = array();
    $review = addslashes($review);
	$success = true;
	$message = "OK";
	
	$my = db_connect();
	if ($my->connect_error) {
		$success = false;
		$message = "Error Conexion:(".$my->connect_errno.") ".$my->connect_error;
	} else {
		$sql = "INSERT INTO playlist (songName,clientId) VALUES ('".$songName."','".$clientId."')";
		$id = db_insert($sql);
		//$r = $my->query($sql);
		
		if ($id) {
			$r = db_select("SELECT * FROM playlist WHERE id = $id");
			$output = $r[0];
		} else {
			$success = false;
			$message = "Error al hacer insert: ".$my->error." : $sql";
		}
		$my->close();
	}
	
	$result = array ('success'=>$success, 'message' => $message, 'input' => $input, 'output' => $output, 'id' => $id);
    echo json_encode($result); 
?>
