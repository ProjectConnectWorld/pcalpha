<?php

$file = fopen("../data/maunew.csv", "r");
$arr= array();

for ($i=0; $i < 9; $i++) {
    array_push($arr, array());
}


while (! feof($file)) {
    $school=fgetcsv($file);
    $response = new stdClass;
    $mbps=intval(ceil($school[7]));
    if (is_numeric($school[7]) && $school[7]==0) {
        echo "shit";
        $response->{'name'}= $str = mb_convert_encoding($school[3], "UTF-8");
        $response->{'lat'}= $school[2];
        $response->{'lon'}= $school[1];
        $response->{'classrooms'}= $school[4];
        $response->{'students'}= $school[5];
        $response->{'teachers'}= $school[6];
        $response->{'mbps'}= $school[7];
        array_push($arr[0], $response);
        // print_r($arr[0]);
    } elseif ($mbps<=8) {
        $response->{'name'}= $str = mb_convert_encoding($school[3], "UTF-8");
        $response->{'lat'}= $school[2];
        $response->{'lon'}= $school[1];
        $response->{'classrooms'}= $school[4];
        $response->{'students'}= $school[5];
        $response->{'teachers'}= $school[6];
        $response->{'mbps'}= $school[7];
        array_push($arr[$mbps], $response);
    }
}
fclose($file);
// array_shift($arr);
// array_pop($arr);
$end = json_encode($arr);
$file = fopen("../data/maujson.js", "w");
// $towrite='';
// foreach ($arr as $key => $value) {
//
// }
fwrite($file, "var maudata=".$end);
fclose($file);

//echo $end;
