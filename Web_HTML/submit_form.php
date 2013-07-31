<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');

if($db->connect_errno > 0){
    die('Error :  ' . $db->connect_error);
}

$query = $db->prepare("INSERT INTO formsubmit_temp VALUES (?,?,?,?,?);");
$id = uniqid();
$formid = 44932;
$deviceid= 44422;
$userid=44293923;
$form_data="Test Data";

$query->bind_param('iiiis', $id, $formid, $deviceid, $userid, $form_data);
$query->execute();
?>