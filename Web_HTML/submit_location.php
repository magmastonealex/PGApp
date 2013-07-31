<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');


$prepstate = $db->prepare('INSERT INTO tracker_table VALUES (NULL,NULL,?,?,?,?,?,?)');
   $userid = $db->real_escape_string($_POST['userID']);
   $devid = $db->real_escape_string($_POST['deviceID']);
   $interval= $db->real_escape_string($_POST['interval']);
   $lat = $db->real_escape_string($_POST['latitude']);
   $longit = $db->real_escape_string($_POST['longitude']);
   $status="false"
   $prepstate->bind_param("sssss", $devid,$userid,$interval,$lat,$longitude,$status);
   if(!$prepstate->execute()){
   	  die('Error: ' + $db->error);
   }
?>