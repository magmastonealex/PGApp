<?php

if($_FILES['upFile']['type'] == "audio/amr" || $_FILES['upFile']['type'] == "audio/wav"){
$uploaddir = "upload_video/";
$uploadfile = $uploaddir . basename( $_FILES['upFile']['name']);
if(move_uploaded_file($_FILES['upFile']['tmp_name'], $uploadfile))
{
  echo "The file has been uploaded successfully";
}
else
{
  echo "There was an error uploading the file";
}
}
?>