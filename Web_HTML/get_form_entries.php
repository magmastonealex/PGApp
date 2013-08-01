<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');
$formID=$db->real_escape_string($_POST["formID"]);

	$getFormFieldIDQuery='SELECT * from form_fields WHERE formID="'.$formID.'" SORT BY formFieldID ASC';
	if(!$FFIDR=$db->query($getFormFieldIDQuery)){
		die("Error: " . $db->error);
	}

	$fFID= $submissionIDs->fetch_assoc()["formFieldID"];
	echo $fFID;

    $subid=array();
	$subIDsQuery = 'SELECT * FROM submission WHERE formID="'.$formID.'"';
	if(!$submissionIDs=$db->query($subIDsQuery)){
		die("Error: " . $db->error);
	}
	while($subIDRow = $submissionIDs->fetch_assoc()){
		array_push($subid, $subIDRow["subID"]);
	}

echo json_encode($subID);
?>