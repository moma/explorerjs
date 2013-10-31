<?php

include('parameters_details.php');

$output = "<ul>"; // string sent to the javascript for display

#http://localhost/branch_ademe/php/test.php?type=social&query=[%22marwah,%20m%22]
#http://localhost/branch_ademe/php/test.php?type=social&query=[%22murakami,%20s%22,%22tasaki,%20t%22,%22oguchi,%20m%22,%22daigo,%20i%22]

#http://localhost/branch_ademe/php/test.php?type=semantic&query=[%22life%20span%22,%22Japan%22]


$type = $_GET["type"];
$q=$_GET["query"] ;
$query = str_replace( '__and__', '&', $_GET["query"] );
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
	$table = "ISIterms";
	$column = "data";
	$id = "id";
	$restriction=' AND  rank=0 ';
	$factor=3;
}

$sql = 'SELECT count(*),'.$id.'
	FROM '.$table.' where (';

foreach($elems as $elem){
	$sql.=' '.$column.'="'.$elem.'" OR ';
}
$sql = substr($sql, 0, -3);
$sql = str_replace( ' & ', '" OR '.$column.'="', $sql );

$sql.=')'.$restriction.'
	GROUP BY '.$id.'
	ORDER BY count('.$id.') DESC
	LIMIT 1000';

$wos_ids = array();
$sum=0;
//echo $sql;//The final query!
// array of all relevant documents with score


foreach ($base->query($sql) as $row) {
        $wos_ids[$row[$id]] = $row["count(*)"];
        $sum = $row["count(*)"] +$sum;
}

$number_doc=count($wos_ids);
$count=0;

foreach ($wos_ids as $id => $score) {
	if ($count<$max_item_displayed){
		$count+=1;
			$output.="<li title='".$score."'>";
	$output.=imagestar($score,$factor).' ';
	$sql = 'SELECT data FROM ISITITLE WHERE id='.$id;
	
	foreach ($base->query($sql) as $row) {
		$output.='<a href="JavaScript:newPopup(\'php/doc_details.php?id='.$id.'\')">'.$row['data']." </a> ";		
		$external_link="<a href=http://google.com/scholar?q=".urlencode(''.$row['data'].'')." target=blank>".' <img width=8% src="img/externallink.png"></a>';	
		//$output.='<a href="JavaScript:newPopup(''php/doc_details.php?id='.$id.''')"> Link</a>';	
	}

	// get the authors
	$sql = 'SELECT data FROM ISIAUTHOR WHERE id='.$id;
	foreach ($base->query($sql) as $row) {
		$output.=strtoupper($row['data']).', ';
	}
	// $sql = 'SELECT data FROM ISIpubdate WHERE id='.$id;
	//foreach ($base->query($sql) as $row) {
	//$output.='('.$row['data'].') ';
	//}

	

	//<a href="JavaScript:newPopup('http://www.quackit.com/html/html_help.cfm');">Open a popup window</a>'

		$output.=$external_link."</li><br>";
	}else{
	continue;
	}
}

$output .= "</ul>[".$max_item_displayed." top items over ".$number_doc.']';

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

echo $output;

?>
