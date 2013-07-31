<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');
$injson_proc = str_replace("\\", "", $_POST["formsubmission"]);
$injson = json_decode($injson_proc);


if($db->connect_errno > 0){
    die('Error :  ' . $db->connect_error);
}
$subid = uniqid();
echo $_POST["formsubmission"];
echo "<br>";
echo $injson_proc;
echo "<br>";
echo $injson;
foreach($injson as $field){
	$fieldidquery = "SELECT formfieldID FROM form_fields WHERE fldName=".mysqli_real_escape_string($db,$field[0]).";";
	if(!$result = $db->query($fieldidquery)){
    	die('Error: ' . $db->error);
	}
	if(!$fid=$result->fetch_field()){
		die('Error: ' . $db->error);
	}
   $prepstate = $db->prepare('INSERT INTO submission_details VALUES (NULL,?,?,"?")');
   $prepstate->bind_param("iis", $subid, $fid, mysqli_real_escape_string($db,$field[1]));
   if(!$prepstate->execute()){
   	die('Error: ' . $db->error);
   }
}

?>