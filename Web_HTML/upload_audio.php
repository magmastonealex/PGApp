<?php

if($_FILES['upFile']['type'] == "audio/amr" || $_FILES['upFile']['type'] == "audio/wav"){
$uploaddir = "upload_audio/";
$uploadfile = $uploaddir.basename( $_FILES['upFile']['name'] );
if(move_uploaded_file($_FILES['upFile']['tmp_name'], $uploadfile))
{
  echo "Done";
}
}
?>