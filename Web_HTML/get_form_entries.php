<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');
$formID=$db->real_escape_string($_POST["formID"]);

	$getFormFieldIDQuery='SELECT * FROM form_fields WHERE formID="'.$formID.'" ORDER BY formFieldID ASC';
	if(!$FFIDR=$db->query($getFormFieldIDQuery)){
		die("Error: " . $db->error);
	}

	$fFID_arr= $FFIDR->fetch_assoc();
	$fFID = $fFID_arr["formFieldID"];
    $subid=array();
	$subIDsQuery = 'SELECT * FROM submission WHERE formID="'.$formID.'"';
	if(!$submissionIDs=$db->query($subIDsQuery)){
		die("Error: " . $db->error);
	}
	
	while($subIDRow = $submissionIDs->fetch_assoc()){
		$firstResultGet='SELECT * FROM submission_details WHERE subID="'.$subIDRow["subID"].'" AND formFieldID="'.$fFID.'"';
		if(!$firstResult=$db->query($firstResultGet)){
			die("Error: " . $db->error);
		}
		$fResult_tmp = $firstResult->fetch_assoc();
		$fResult=$fResult_tmp["submissionValue"];
		array_push($subid, array($fResult,$subIDRow["subID"]));
	}

echo json_encode($subid);
?>