<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');
   $userid = $db->real_escape_string($_POST['userID']);
   $devid = $db->real_escape_string($_POST['deviceID']);
   $interval= $db->real_escape_string($_POST['interval']);
   $lat = $db->real_escape_string($_POST['latitude']);
   $longit = $db->real_escape_string($_POST['longitude']);
   file_put_contents("file.txt", $userid."@".$devid."@".$interval."@".$lat."@".$longit);
   $status="false";
   $sql = 'INSERT INTO tracker_table VALUES (0,NULL,"'.$devid.'",'.$userid.','.$interval.','.$lat.','.$longit.','.$status.')';
   echo $sql.'<br>';
   if(!$db->query($sql)){
        $sqlUpdate = 'UPDATE tracker_table SET `userID`='.$userid.',`interval`='.$interval.',`latitude`="'.$lat.'",`longitude`="'.$longit.'" WHERE `deviceID`="'.$devid.'";';
        echo $sqlUpdate;
        if(!$db->query($sqlUpdate)){
         die ("error: " + $db->error);
        }
   }
die('Error: ' + $db->error);
?>