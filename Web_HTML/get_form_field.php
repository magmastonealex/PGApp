<?php
$db = new mysqli('localhost', 'appd2dpr_php', '9&3mPMjCJM8+uKy6o', 'appd2dpr_mobileApp');

$query = "SELECT * FROM form_fields WHERE formID=2 ORDER BY fldOrder ASC;";
$formID=2;

if(!$result = $db->query($query)){
    die('Error: ' . $db->error . ']');
}
echo "Here";
$allArray = array();
while($row = $result->fetch_assoc()){
    $fieldArray =  array($row['fldType'], $row['fieldOptions'].explode(';'));
    array_push($allArray, $fieldArray);
}
print_r($allArray);
?>