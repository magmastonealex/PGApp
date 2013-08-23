<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');
$tokentest = 'SELECT * FROM devices WHERE authtoken="'.$db->real_escape_string($_COOKIE['token']).'"';
if(!$tokenresult = $db->query($tokentest)){
	die('Error: ' . $db->error);
}
if($tokenresult->num_rows == 0){
	die('Incorrect token');
}


$userID = $db->real_escape_string($_GET["userID"]);

$query = 'SELECT formID FROM users_forms WHERE userID="'.$userID.'"';


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
		$query_field = "SELECT * FROM form_fields WHERE formID=".mysqli_real_escape_string($db,$row['formID'])." ORDER BY fldOrder ASC;";

		if(!$result_field = $db->query($query_field)){
			die('Error: ' . $db->error);
		}
		$fieldforForm = array();
		while($row = $result_field->fetch_assoc()){
			$fieldData = $row['fieldOptions'];
			$fieldArray =  array($row['fldType'], $row['fldName'],explode(';', $fieldData));
			array_push($fieldforForm, $fieldArray);
		}
		array_push($formArray, $fieldforForm);
	}
	array_push($allArray, $formArray);
}
echo json_encode($allArray);
?>