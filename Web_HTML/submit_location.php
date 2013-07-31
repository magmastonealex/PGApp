<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');


   

   $userid = $db->real_escape_string($_POST['userID']);
   $devid = $db->real_escape_string($_POST['deviceID']);
   $interval= $db->real_escape_string($_POST['interval']);
   $lat = $db->real_escape_string($_POST['latitude']);
   $longit = $db->real_escape_string($_POST['longitude']);
   $status="false";
   $sql = 'INSERT INTO tracker_table VALUES (NULL,NULL,'.$devid.','.$userid.','.$interval.','.$lat.','.$longit.','.$status.')';
   echo $sql;
   if(!$db->query($sql)){
   	  die('Error: ' + $db->error);
   }
?>