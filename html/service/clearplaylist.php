<?php
	require_once("db.php");

	header("Access-Control-Allow-Origin: *");
	header("Content-type: text/json");
	
  $review = addslashes($review);
	$success = true;
	$message = "OK";
	
	$my = db_connect();
	if ($my->connect_error) {
		$success = false;
		$message = "Error Conexion:(".$my->connect_errno.") ".$my->connect_error;
	} else {
		$sql = "UPDATE playlist SET status = 'viewed' WHERE status != 'viewed' ";
		$id = db_insert($sql);
		$my->close();
	}
	
	$result = array ('success'=>$success);
    echo json_encode($result); 
?>
