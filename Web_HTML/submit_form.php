<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');

if($db->connect_errno > 0){
    die('Error :  ' . $db->connect_error);
}
$query = "INSERT INTO devices VALUES (4901313441, 994832,99223344)";
if(!$result=$db->query($query)){
    die('Insert error: '.$db->error);
}
?>