<?php
	require_once("db.php");

	$place_id = $_REQUEST['pid'];
	$clientid = $_REQUEST['cid'];
	$clientid = is_null($clientid) ? 'null' : $clientid;

	$user_cond = " ";
	$s = 0;
	$w = 10;
	
	$output = array();
	$my = db_connect();
	if ($my->connect_error) {
		$success = false;
		$output = "Error Conexion:(".$my->connect_errno.") ".$my->connect_error;
	} else {
		$r = db_select("SELECT id,songName,creationDate,status,clientid FROM playlist WHERE status !='viewed' and  clientid = coalesce(".$clientid.",clientid) order by status desc");
		$output= $r;
		$my->close();
	}

	//$input = array('place_id' => $place_id);
 	$result = array ('success'=>true, 'input' => $input, 'output' => $output);
	
	header("Access-Control-Allow-Origin: *");
	header("Content-type: text/json");
  echo json_encode($result);
?>