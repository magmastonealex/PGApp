<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');

$userID=$db->real_escape_string($_POST["userID"]);

$linkQuery = "SELECT * FROM users_passwords WHERE userID='".$userID."';";

if(!$linkResult=$db->query($linkQuery)){
	die("error: " . $db->error);
}

$linkarr= $linkResult->fetch_assoc();
echo $linkarr["logo"];
?>
