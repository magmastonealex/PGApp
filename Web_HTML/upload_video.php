<?php

if($_FILES['upFile']['type'] == "video/3gpp" || $_FILES['upFile']['type'] == "video/quicktime"||$_FILES['upFile']['type'] == "video/mp4"){
$uploaddir = "upload_video/";
$uploadfile = $uploaddir . basename( $_FILES['upFile']['name'] ). "-".uniqid();
if(move_uploaded_file($_FILES['upFile']['tmp_name'], $uploadfile))
{
  echo "The file has been uploaded successfully";
}
}
?>