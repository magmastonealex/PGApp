<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');

file_put_contents("submittest.txt", file_get_contents("php://input"));


$injson_proc = str_replace("\\", "", $_POST["formsubmission"]);
$injson = json_decode($injson_proc);


if($db->connect_errno > 0){
    die('Error :  ' . $db->connect_error);
}
$subid = md5(uniqid());

foreach($injson as $field){
	$fieldidquery = "SELECT * FROM form_fields WHERE fldName='".mysqli_real_escape_string($db,$field[0])."';";
	if(!$result = $db->query($fieldidquery)){
    	die('Error: ' . $db->error);
	}
  $fid = 0;
	while($resurow=$result->fetch_assoc()){
		$fid = $resurow["formFieldID"];
	}
  echo $fid;
   $prepstate = $db->prepare('INSERT INTO submission_details VALUES (NULL,?,?,?);');
   $prepstate->bind_param("iss", $fid, mysqli_real_escape_string($db,$field[1]),$subid);
   if(!$prepstate->execute()){
   	die('Error: ' . $db->error);
   }
}

$prepstate = $db->prepare('INSERT INTO submission VALUES (?,NULL,?,?,?)');
   $userid = $db->real_escape_string($_POST["userID"]);
   $devid = $db->real_escape_string($_POST["deviceID"]);
   $prepstate->bind_param("sssi", $subid, $userid,$devid,$_POST["formID"]);
   if(!$prepstate->execute()){
   	die('Error: ' . $db->error);
   }

?>