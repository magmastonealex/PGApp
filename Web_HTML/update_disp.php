<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');
$tokentest = 'SELECT * FROM devices WHERE authtoken="'.$db->real_escape_string($_COOKIE['token']).'"';
if(!$tokenresult = $db->query($tokentest)){
  die('Error: ' . $db->error);
}
if($tokenresult->num_rows == 0){
  die('Incorrect token');
}

$dispid    = $db->real_escape_string($_POST["dispid"]));
$name      = $db->real_escape_string($_POST["name"]));
$address   = $db->real_escape_string($_POST["address"]));
$apartment = $db->real_escape_string($_POST["apartment"]));
$city      = $db->real_escape_string($_POST["city"]));
$state     = $db->real_escape_string($_POST["state"]));
$zip       = $db->real_escape_string($_POST["zip"]));
$subid     = $db->real_escape_string($_POST["subid"]));
$disp      = $db->real_escape_string($_POST["disp"]));



?>