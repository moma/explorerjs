<?php

/*
class Match{
	function setFoo(){
		echo "inside this function";
	}
}
*/


$dbname='homework-20750-1-homework-db.db';
$base = new PDO("sqlite:" . $dbname);


#http://localhost/branch_ademe/php/test.php?type=social&query=[%22marwah,%20m%22]
#http://localhost/branch_ademe/php/test.php?type=social&query=[%22murakami,%20s%22,%22tasaki,%20t%22,%22oguchi,%20m%22,%22daigo,%20i%22]

#http://localhost/branch_ademe/php/test.php?type=semantic&query=[%22life%20span%22,%22Japan%22]


$type = $_GET["type"];
$query = $_GET["query"];
$elems = json_decode($query);
$table = "";
$column = "";
$id="";

if($type=="social"){
	$table = "ISIAUTHOR";
	$column = "data";
	$id = "id";
}

if($type=="semantic"){
	$table = "articles2terms";
	$column = "terms_id";
	$id = "wos_id";
}

$sql = 'SELECT '.$id.'
	FROM '.$table.' where (';

foreach($elems as $elem){
	$sql.=' '.$column.'="'.$elem.'" OR ';
}
$sql = substr($sql, 0, -3);

$sql.=')
	GROUP BY '.$id.'
	ORDER BY count('.$id.') DESC
	LIMIT 6';


$wos_ids = array();
foreach ($base->query($sql) as $row) {
	array_push($wos_ids, $row[$id]);
}




$sql = 'SELECT data FROM ISITITLE WHERE (';
foreach ($wos_ids as $wos_id){
	$sql.=" id=$wos_id OR";
}
$sql = substr($sql, 0, -2);
$sql.=")";


$titles = array();
foreach ($base->query($sql) as $row) {
	array_push($titles, $row['data']);
}

#echo json_encode($titles);

$output = "<ul>";
foreach($titles as $title) {
	$output.="<li>$title</li><br>";
}
$output .= "</ul>";

echo $output;





/*
SELECT wos_id
FROM articles2terms 
where (terms_id="polution" OR terms_id="biological diversity" OR terms_id="pollution")
GROUP BY wos_id
ORDER BY count(wos_id) DESC
LIMIT 6
*/

/*

*/



?>
