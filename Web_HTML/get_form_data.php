<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');
$userID=$db->real_escape_string($_GET["userID"]);

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
		//array_push($form_list, array($nameRow["frmName"],));
	$formID = $nameRow["formID"];
	$getFormFieldIDQuery='SELECT * FROM form_fields WHERE formID="'.$formID.'" ORDER BY formFieldID ASC';
	if(!$FFIDR=$db->query($getFormFieldIDQuery)){
		die("Error: " . $db->error);
	}

	$fFID_arr= $FFIDR->fetch_assoc();
	$fFID = $fFID_arr["formFieldID"];
    $subid=array();
	$subIDsQuery = 'SELECT * FROM submission WHERE formID="'.$formID.'" AND userID="'+$userID+'"';
	if(!$submissionIDs=$db->query($subIDsQuery)){
		die("Error: " . $db->error);
	}

	while($subIDRow = $submissionIDs->fetch_assoc()){
		
		array_push($subid, array($subIDRow["timeStamp"],$subIDRow["subID"]));
	}
		array_push($form_list, array($row["frmName"],$row["formID"],$subid));
	}
}
echo json_encode($form_list);
?>