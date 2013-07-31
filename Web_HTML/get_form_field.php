<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');

$query = $db->prepare("SELECT * FROM form_fields WHERE formID=? ORDER BY fldOrder ASC;");
$formID=2;
$query->bind_param('i', $formid);
$query->execute();
echo $db->error;
echo $query->error;
$query->bind_result($fldID, $formID, $fldType, $fieldOptions, $fldOrder, $fldStatus);
while($query->fetch()){
	echo $db->error;
	echo $query->error;
	echo $fldID."<br>";
}
echo $db->error;
echo $query->error;
?>