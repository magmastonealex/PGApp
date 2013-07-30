<?php

if($_FILES['upFile']['type'] == "video/3gpp" || $_FILES['upFile']['type'] == "video/quicktime"||$_FILES['upFile']['type'] == "video/mp4"){
$uploaddir = "upload_video/";
$uuid = uniqid();
$uploadfile = $uploaddir . basename( $_FILES['upFile']['name'] ). "-".$uuid;
if(move_uploaded_file($_FILES['upFile']['tmp_name'], $uploadfile))
{
  echo $uuid;
}
}
?>