<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');
$tokentest = 'SELECT * FROM devices WHERE authtoken="'.$db->real_escape_string($_COOKIE['token']).'"';
if(!$tokenresult = $db->query($tokentest)){
  die('Error: ' . $db->error);
}
if($tokenresult->num_rows == 0){
  die('Incorrect token');
}
$injson_proc = str_replace("\\", "", $_POST["formsubmission"]);
$injson = json_decode($injson_proc);


if($db->connect_errno > 0){
    die('Error :  ' . $db->connect_error);
}
$subid = md5(uniqid());
$name ="No Name";
foreach($injson as $field){
  $fieldidquery = "SELECT * FROM form_fields WHERE fldName='".mysqli_real_escape_string($db,$field[0])."';";
  if(!$result = $db->query($fieldidquery)){
      die('Error: ' . $db->error);
  }
  $fid = 0;
  while($resurow=$result->fetch_assoc()){
    $fid = $resurow["formFieldID"];
    if($resurow["fldStatus"] == 3){
      $name = $field[1];
    }
  }

  echo $fid;
   $prepstate = $db->prepare('INSERT INTO submission_details VALUES (NULL,?,?,?);');
   $prepstate->bind_param("iss", $fid, mysqli_real_escape_string($db,$field[1]),$subid);
   if(!$prepstate->execute()){
    die('Error: ' . $db->error);
   }
}

$prepstate = $db->prepare('INSERT INTO submission VALUES (?,NULL,?,?,?,?,?,?)');
   $userid = $db->real_escape_string($_POST["userID"]);
   $devid = $db->real_escape_string($_POST["deviceID"]);
   $lati = $db->real_escape_string($_POST["latitude"]);
   $longi = $db->real_escape_string($_POST["longitude"]);
   $prepstate->bind_param("sssisss", $subid, $userid,$devid,$_POST["formID"],$lati,$longi,$name);
   if(!$prepstate->execute()){
    die('Error: ' . $db->error);
   }
   $sql = 'INSERT INTO tracker_table VALUES (0,NULL,"'.$devid.'","'.$userid.'","F",'.$lati.','.$longi.',"")';
   file_put_contents("SQLSubmit.txt",$sql);
   if(!$db->query($sql)){
        file_put_contents("sqlerror.txt",$db->error);
        $sqlUpdate = 'UPDATE tracker_table SET `userID`="'.$userid.'",`interval`="F",`latitude`="'.$lati.'",`longitude`="'.$longi.'" WHERE `deviceID`="'.$devid.'";';
        file_put_contents("SQLSubmit-U.txt",$sqlUpdate);
        echo $sqlUpdate;
        if(!$db->query($sqlUpdate)){
         die ("error: ". $db->error);
        }
   }

?>