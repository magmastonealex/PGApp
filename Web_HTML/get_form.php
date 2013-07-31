<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');


$query = "SELECT formID FROM users_forms WHERE userID=444333";


if(!$result = $db->query($query)){
    die('Error: ' . $db->error . ']');
}

$allArray = array();
while($row = $result->fetch_assoc()){
	$formArray = array($row['formID']);
	$query2 = "SELECT * FROM forms WHERE formID=". (string)$row['formID'];
	if(!$result2 = $db->query($query2)){
   		 die('Error: ' . $db->error . ']');
	}
	while($row2 = $result2->fetch_assoc()){
		array_push($formArray, $row2['frmName']);
	}
    array_push($allArray, $formArray);
}
echo json_encode($allArray);
?>