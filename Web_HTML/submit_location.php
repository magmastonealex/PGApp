<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');


$prepstate = $db->prepare('INSERT INTO tracker_table VALUES (NULL,NULL,?,?,?,?,?,NULL)');
   $userid = $db->mysqli_escape_string($_POST['userID']);
   $devid = $db->mysqli_escape_string($_POST['deviceID']);
   $interval= $db->mysqli_escape_string($_POST['interval']);
   $lat = $db->mysqli_escape_string($_POST['latitude']);
   $longit = $db->mysqli_escape_string($_POST['longitude']);
   $prepstate->bind_param("sssss", $devid,$userid,$interval,$lat,$longitude);
   if(!$prepstate->execute()){
   	  die('Error: ' + $db->error);
   }
?>