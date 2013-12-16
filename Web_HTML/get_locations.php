<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');
$tokentest = 'SELECT * FROM devices WHERE authtoken="'.$db->real_escape_string($_COOKIE['token']).'"';
if(!$tokenresult = $db->query($tokentest)){
	die('Error: ' . $db->error);
}
if($tokenresult->num_rows == 0){
	die('Incorrect token');
}
$userID = $db->real_escape_string($_GET["userID"]);

$locQuery = 'SELECT * FROM `leadsAssign` WHERE userID="'.$userID.'"';

if(!$locations=$db->query($locQuery)){
		die("Error: " . $db->error);
}
$locationsArray=array();
while($locationRow=$locations->fetch_assoc()){
	$disp = 'SELECT * FROM `disposition` WHERE `id`='.$locationRow["leadID"];
	
	$disps=$db->query($disp);
	$dispRow = $disps->fetch_assoc();

	array_push($locationsArray, array($locationRow["dispid"],array($dispRow["name"], $dispRow["address"], $dispRow["apartment"], $dispRow["city"], $dispRow["state"], $dispRow["zip"], $dispRow["disp"], $dispRow["subid"])));
}
echo json_encode($locationsArray);
?>