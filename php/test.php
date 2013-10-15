<?php

/*
class Match{
	function setFoo(){
		echo "inside this function";
	}
}
*/


//header ("Content-Type:application/json");

$dbname='homework-20750-1-homework-db.db';
$base = new PDO("sqlite:" . $dbname);
$output = "<ul>"; // string sent to the javascript for display

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

$sql = 'SELECT count(*),'.$id.'
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
$sum=0;

// array of all relevant documents with score
foreach ($base->query($sql) as $row) {
        $wos_ids[$row[$id]] = $row["count(*)"];
        $sum = $row["count(*)"] +$sum;
}

foreach ($wos_ids as $id => $score) {
	$output.="<li title='".$score."'>";
	// get the authors
	$sql = 'SELECT data FROM ISIAUTHOR WHERE id='.$id;
	foreach ($base->query($sql) as $row) {
		$output.=strtoupper($row['data']).', ';
	}
	$sql = 'SELECT data FROM ISIpubdate WHERE id='.$id;
	foreach ($base->query($sql) as $row) {
		$output.='('.$row['data'].') ';
	}

	$sql = 'SELECT data FROM ISITITLE WHERE id='.$id;
	foreach ($base->query($sql) as $row) {
		$output.="<a href=http://scholar.google.com/scholar?q=".urlencode('"'.$row['data'].'"').">".$row['data']."</a></li><br>";		
	}

}

$output .= "</ul>";
echo $output;
 
function pt($string){
    // juste pour afficher avec retour à la ligne
echo $string."<br/>";
}

function pta($array){
    print_r($array);
    echo '<br/>';
}
//echo json_encode($titles);

/*
SELECT wos_id
FROM articles2terms 
where (terms_id="polution" OR terms_id="biological diversity" OR terms_id="pollution")
GROUP BY wos_id
ORDER BY count(wos_id) DESC
LIMIT 6
*/
/*
 void BubbleSort(int *nums, int n)
{
for (int i=0; i<n-1; i++)
for (int j=n-1; j>i; j--)
if(nums[j] < nums[j-1]
swap(j,j-1);
}
 */

?>
