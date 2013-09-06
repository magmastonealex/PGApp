<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');
/*$tokentest = 'SELECT * FROM devices WHERE authtoken="'.$db->real_escape_string($_COOKIE['token']).'"';
if(!$tokenresult = $db->query($tokentest)){
	die('Error: ' . $db->error);
}
if($tokenresult->num_rows == 0){
	die('Incorrect token');
}
*/
$userID = $db->real_escape_string($_GET["userID"]);
$devID = $db->real_escape_string($_GET["devID"]);
file_put_contents("recent.txt", "GET" . file_get_contents("php://input"));
$locQuery = 'SELECT * FROM tracker_table WHERE userID="'.$userID.'" AND deviceID="'.$devID.'"';

if(!$locations=$db->query($locQuery)){
		die("Error: " . $db->error);
}
$loc = array();
while($locationRow=$locations->fetch_assoc()){
	$loc = array($locationRow["latitude"], $locationRow["longitude"]);
}
echo json_encode($loc);
?>