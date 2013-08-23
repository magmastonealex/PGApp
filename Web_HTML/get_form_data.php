<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');
$tokentest = 'SELECT * FROM devices WHERE authtoken="'.$db->real_escape_string($_COOKIE['token']).'"';
if(!$tokenresult = $db->query($tokentest)){
	die('Error: ' . $db->error);
}
if($tokenresult->num_rows == 0){
	die('Incorrect token');
}

$userID=$db->real_escape_string($_GET["userID"]);

$formIDQuery = 'SELECT * FROM users_forms WHERE userID="'.$userID.'"';
if(!$allFormIds=$db->query($formIDQuery)){
	die("Error1: " . $db->error);
}
$form_list=array();
while($row = $allFormIds->fetch_assoc()){
	$formNamesQuery = 'SELECT * FROM forms WHERE formID="'.$row["formID"].'"';
	if(!$formNames=$db->query($formNamesQuery)){
		die("Error2: " . $db->error);
	}
	while($nameRow = $formNames->fetch_assoc()){
		//array_push($form_list, array($nameRow["frmName"],));
	$formID = $nameRow["formID"];
    $subid=array();
	$subIDsQuery = 'SELECT * FROM submission WHERE formID="'.$formID.'" AND userID="'.$userID.'" ORDER BY timeStamp DESC';
	if(!$submissionIDs=$db->query($subIDsQuery)){
		die("Error4: " . $db->error);
	}

	while($subIDRow = $submissionIDs->fetch_assoc()){
		
		array_push($subid, array($subIDRow["Name"],$subIDRow["subID"]));
	}
		array_push($form_list, array($nameRow["frmName"],$row["formID"],$subid));
	}
}
echo json_encode($form_list);
?>