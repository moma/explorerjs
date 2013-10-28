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
foreach ($base->query($sql) as $row) {
        $wos_ids[$row[$id]] = $row["count(*)"];
        $sum = $row["count(*)"] +$sum;
}

$sql = 'SELECT id,data FROM ISITITLE WHERE (';
foreach ($wos_ids as $key => $value){
	$sql.=" id=".$key." OR";
}
$sql = substr($sql, 0, -2);
$sql.=")";

$titles = array();
foreach ($base->query($sql) as $row) {
	//array_push($titles, $row['data']);
        $i = $row['id'];
        $info = array();
        $info["title"] = $row['data'];
        $info["occ"] = $wos_ids[$i];
        $titles[$i] = $info;
}

$output = "<ul>";

foreach($titles as $key => $data) {
        //echo $key." : ".var_dump($data)."<br>";
	$output.="<li title='".$data["occ"]."'><a href=http://scholar.google.com/scholar?q=".urlencode('"'.$data["title"].'"').">".$data["title"]."</a></li><br>";
}
$output .= "</ul>";
echo $output;
 


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
