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
		$ourtoken = gen_uuid();
		setcookie("token", $ourtoken);
			$query = 'INSERT INTO devices VALUES ("'.$db->real_escape_string($_POST["deviceID"]).'", "'.$db->real_escape_string($_POST["userid"]).'","'.$ourtoken.'",NULL)';
if(!$result=$db->query($query)){
    $query = 'UPDATE devices SET userid="'.$db->real_escape_string($_POST["userid"]).'",authtoken="'.$ourtoken.'" WHERE deviceid="'.$db->real_escape_string($_POST["deviceID"]).'"';
    if(!$result=$db->query($query)){
    	die("Error updating:" . $db->error);
	}
}
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

function gen_uuid() {
    return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        // 32 bits for "time_low"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),

        // 16 bits for "time_mid"
        mt_rand( 0, 0xffff ),

        // 16 bits for "time_hi_and_version",
        // four most significant bits holds version number 4
        mt_rand( 0, 0x0fff ) | 0x4000,

        // 16 bits, 8 bits for "clk_seq_hi_res",
        // 8 bits for "clk_seq_low",
        // two most significant bits holds zero and one for variant DCE1.1
        mt_rand( 0, 0x3fff ) | 0x8000,

        // 48 bits for "node"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
    );
}


?>