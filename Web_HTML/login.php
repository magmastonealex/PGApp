<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');
$password_hash = sha1($db->real_escape_string($_POST["password"]));
$loginQuery = 'SELECT * FROM users_passwords WHERE userID="'.$db->real_escape_string($_POST["userid"]).'" AND password_hash="'.$password_hash.'"';

if(!$login_results = $db->query($loginQuery)){
	die("Error: " . $login_results);
}
if($login_results->num_rows == 1){

if($row = $login_results->fetch_assoc()){
	if($row['password_hash'] == $password_hash){
		echo "SUCCESS";
	}else{
		echo "Login Failed (SQL injection?)";
	}
}else{
	die("Login Error: " + $result->error);
}
} else{
	echo "Login Failed (Check username and password)";
}
?>