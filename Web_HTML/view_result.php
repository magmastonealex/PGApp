<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');
$tokentest = 'SELECT * FROM devices WHERE authtoken="'.$db->real_escape_string($_COOKIE['token']).'"';
if(!$tokenresult = $db->query($tokentest)){
	die('Error: ' . $db->error);
}
if($tokenresult->num_rows == 0){
	die('Incorrect token');
}
$subID = $db->real_escape_string($_GET["subID"]);
$formIDQuery = 'SELECT * FROM submission WHERE `subID`="'.$subID.'"';
if(!$formIDResult=$db->query($formIDQuery)){
	die("error with query: " . $db->error);
}
$formID=0;
$subUser="";
$subDevice="";
while($row = $formIDResult->fetch_assoc()){
	$formID=$row["formID"];
	$subUser=$row["userID"];
	$subDevice=$row["deviceID"];
}
$formName="";
$formNameQuery = 'SELECT * FROM forms WHERE `formID`="'.$formID.'"';
if(!$formNameResult=$db->query($formNameQuery)){
	die("error with query: " . $db->error);
}
while($row = $formNameResult->fetch_assoc()){
	$formName=$row["frmName"];
}
$fieldNames = array();

$fieldNamesQuery = 'SELECT * from form_fields WHERE formID='.$formID.' ORDER BY formFieldID ASC;';
if(!$fieldNameResult=$db->query($fieldNamesQuery)){
	die("error with query: " . $db->error);
}
while($row = $fieldNameResult->fetch_assoc()){
	array_push($fieldNames, array($row["fldName"], $row["fldType"]));
}

$resultsQuery= 'SELECT * from submission_details WHERE subID="'.$subID.'" ORDER BY formFieldID ASC';
if(!$finalResult=$db->query($resultsQuery)){
	die("error with query: " . $db->error);
}
$finalarray=array();
$increment = 0;
$increment_fldnames = 0;
while($row = $finalResult->fetch_assoc()){
	
	if($fieldNames[$increment_fldnames][1] == "text"){
		$increment_fldnames=$increment_fldnames+1;
	}
	array_push($finalarray, array($fieldNames[$increment_fldnames],$row["submissionValue"]));

	$increment = $increment+1;
	$increment_fldnames=$increment_fldnames+1;
}
echo json_encode($finalarray);
?>