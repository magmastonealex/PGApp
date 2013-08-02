<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');

$userID = $db->real_escape_string($_GET["userID"]);

$locQuery = 'SELECT * FROM submission WHERE userID="'+$userID+'"';

if(!$locations=$db->query($locQuery)){
		die("Error: " . $db->error);
}
$locationsArray=array();
while($locationRow=$locations->fetch_assoc()){
	array_push($locationsArray, array($locationRow["latitude"], $locationRow["longitude"], $locationRow["subID"]));
}
echo json_encode($locationsArray);
?>