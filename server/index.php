<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

if (isset($_GET["code"]))  $_GET["code"] = "delvar System;delvar File;\n" . $_GET["code"];
else                        die("");


function random ($length) {
    return substr(str_shuffle(str_repeat($x="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", ceil($length/strlen($x)) )),1,$length);
}

function error_handler ($errno, $errstr) {
    echo "error: unknown error";
    die();
}
set_error_handler("error_handler");
$code = str_replace('&amp;','&',$_GET["code"]);
$fn = random(12);
$kg = $fn . ".kg";
file_put_contents($kg, $code);
$cmnd = "kagsa " . $kg ;//. " > " > $txt;
$output = shell_exec($cmnd);
//$output = file_get_contents($txt);
$output = str_replace("\n","<br>",$output);
$output = str_replace($kg,"(file)",$output);
$output = str_replace("\x1b[1;31m","",$output);
$output = str_replace("\x1b[0m","",$output);
$output = str_replace("\x1b[0;36m","",$output);
$output = str_replace("\x1b[0;33m","",$output);

unlink($kg);
echo $output;
?>