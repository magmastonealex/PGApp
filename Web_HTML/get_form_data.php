<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');
$userID=$db->real_escape_string($_POST["userID"]);

$formIDQuery = 'SELECT * FROM users_forms WHERE userID="'.$userID.'"';
if(!$allFormIds=$db->query($formIDQuery)){
	die("Error: " . $db->error);
}
$form_list=array();
while($row = $allFormIds->fetch_assoc()){
	$formNamesQuery = 'SELECT * FROM forms WHERE formID="'.$row["formID"].'"';
	if(!$formNames=$db->query($formNamesQuery)){
		die("Error: " . $db->error);
	}
	while($nameRow = $formNames->fetch_assoc()){
		array_push($form_list, array($nameRow["frmName"],$nameRow["formID"]));
	}
}
echo json_encode($form_list);
?>