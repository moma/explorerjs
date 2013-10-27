<?php

include('parameters_details.php');
$output = "<ul>"; // string sent to the javascript for display
$id=$_GET["id"];
//$elems = json_decode($query);
	$output.="<li'>";
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
		$output.="<a href=http://scholar.google.com/scholar?q=".urlencode('"'.$row['data'].'"').">".$row['data']."</a>";		
	}
	$sql = 'SELECT data FROM ISIABSTRACT WHERE id='.$id;
	foreach ($base->query($sql) as $row) {
		$output.='<br/><b>Abstract :</b><i>'.$row['data'].' </i>';
		$output.="</li><br>";		
	}
	$output.=


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
