<?php
	require_once("db.php");

	$songId = $_REQUEST['id'];
	$status =$_REQUEST['s'];
	$output = array();
	$my = db_connect();
	if ($my->connect_error) {
		$success = false;
		$output = "Error Conexion:(".$my->connect_errno.") ".$my->connect_error;
	} else {
		$sql = "UPDATE playlist SET status='".$status."'  WHERE id =".$songId;
		$r=db_update($sql);
		if ($r){
			$sql = "SELECT * FROM playlist WHERE id =".$songId;
			$r=db_select($sql);
		}
		$output= $r;
		$my->close();
	}

	//$input = array('place_id' => $place_id);
 	$result = array ('success'=>true, 'input' => $input, 'output' => $output);
	
	header("Access-Control-Allow-Origin: *");
	header("Content-type: text/json");
  echo json_encode($result); 
  
?>