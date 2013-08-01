<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');
$subID = $db->real_escape_string($_POST["subID"]);
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
echo "<h2><b>Form: " . $formName . "</b></h2><br>";
echo "<h3><b>User: " . $subUser . " on device: " .$subDevice."</b></h3>";
echo "<br><hr><br>";
$fieldNames = array();

$fieldNamesQuery = 'SELECT * from form_fields WHERE formID='.$formID.' ORDER BY formFieldID ASC;';
if(!$fieldNameResult=$db->query($fieldNamesQuery)){
	die("error with query: " . $db->error);
}
while($row = $fieldNameResult->fetch_assoc()){
	array_push($fieldNames, $row["fldName"]);
}

$resultsQuery= 'SELECT * from submission_details WHERE subID="'.$subID.'" ORDER BY formFieldID ASC';
if(!$finalResult=$db->query($resultsQuery)){
	die("error with query: " . $db->error);
}
$increment = 0
while($row = $finalResult->fetch_assoc()){
	echo "<br>" . $fieldNames[$increment]; . ": " . $row["submissionValue"];
	$increment = $increment+1;
}

?>