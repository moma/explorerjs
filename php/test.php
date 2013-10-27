<?php

include('parameters_details.php');

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
	$restriction='';
	$factor=1;// factor for normalisation of stars
}

if($type=="semantic"){
	$table = "articles2terms";
	$column = "terms_id";
	$id = "wos_id";
	$restriction=' AND  title_or_abstract=0 ';
	$factor=3;
}

$sql = 'SELECT count(*),'.$id.'
	FROM '.$table.' where (';

foreach($elems as $elem){
	$sql.=' '.$column.'="'.$elem.'" OR ';
}
$sql = substr($sql, 0, -3);

$sql.=')'.$restriction.'
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
	$output.=imagestar($score,$factor).' ';
	$sql = 'SELECT data FROM ISITITLE WHERE id='.$id;
	foreach ($base->query($sql) as $row) {
		$output.='<a href="JavaScript:newPopup(\'php/doc_details.php?id='.$id.'	\')">'.$row['data']." </a> ";		
		$external_link="<a href=http://scholar.google.com/scholar?q=".urlencode('"'.$row['data'].'"')." target=blank>".' <img src="img/externallink.png"></a>';	
		//$output.='<a href="JavaScript:newPopup(''php/doc_details.php?id='.$id.''')"> Link</a>';	
	}

	// get the authors
	$sql = 'SELECT data FROM ISIAUTHOR WHERE id='.$id;
	foreach ($base->query($sql) as $row) {
		$output.=strtoupper($row['data']).', ';
	}
	$sql = 'SELECT data FROM ISIpubdate WHERE id='.$id;
	foreach ($base->query($sql) as $row) {
		$output.='('.$row['data'].') ';
	}

	

	//<a href="JavaScript:newPopup('http://www.quackit.com/html/html_help.cfm');">Open a popup window</a>'

	$output.=$external_link."</li><br>";
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

function imagestar($score,$factor) {
// produit le html des images de score
    $star_image = '';
    if ($score > .5) {
        $star_image = '';
        for ($s = 0; $s < min(5,$score/$factor); $s++) {
            $star_image.='<img src="img/star.gif" border="0" >';
        }
    } else {
        $star_image.='<img src="img/stargrey.gif" border="0">';
    }
    return $star_image;
}

?>
