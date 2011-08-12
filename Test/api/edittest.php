<?php

//sleep(1);

$will_fail = $_GET['f'];
$item_id = $_GET['id'];

if($will_fail == 'php') {
	header("HTTP/1.0 500 Application Error");
	trigger_error("THIS IS A TEST ERROR MESSAGE", E_USER_ERROR);
	return;
}

if($will_fail == 'r') {
	// randomly fail or succeed
	$will_fail = (mt_rand() % 2 == 0)? 'y':'n';
}

if($will_fail == 'y') {
	send_error(601, "could not save for id: '$item_id'");
} else {
	send_result(200, "item_id '$item_id' saved!");
}

function send_error($code, $message) 
{
	header("HTTP/1.0 500 Application Error");
	send_result($code, $message);
}

function send_result($code, $message) 
{
	header('Content-type: application/json');
	print json_encode(array('code'=>$code, 'message'=>$message));
}

?>