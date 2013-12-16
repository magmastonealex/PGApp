<?php

if($_FILES['upFile']['type'] == "image/jpg"){
$uploaddir = "upload_picture/";
$uploadfile = $uploaddir.basename($_FILES['upFile']['name']);
if(move_uploaded_file($_FILES['upFile']['tmp_name'], $uploadfile))
{
  echo "Done";
}
}
?>