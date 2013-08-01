<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');

if($db->connect_errno > 0){
    die('Error :  ' . $db->connect_error);
}
$query = 'INSERT INTO devices VALUES ("'.$db->real_escape_string($_POST["deviceID"]).'", "'.$db->real_escape_string($_POST["userID"]).'",NULL)';
if(!$result=$db->query($query)){
    $query = 'UPDATE devices SET userid="'.$db->real_escape_string($_POST["userID"]).'" WHERE deviceid="'.$db->real_escape_string($_POST["deviceID"]).'"';
    if(!$result=$db->query($query)){
    	die("Error updating:" . $db->error);
	}
}
?>