<?php

include('parameters_details.php');
echo '
<html>
        <head>
  <meta charset="utf-8" />
  <title>Document details</title>
  <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
  <script src="http://code.jquery.com/jquery-1.9.1.js"></script>
  <script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
  
  <script>
  $(function() {
    $( "#tabs" ).tabs({
      collapsible: true
    });
  });
  </script>
</head>
          
    <body>
    <div id="tabs">
  <ul>
    <li><a href="#tabs-1">Selected Document</a></li>';
    //<li><a href="#tabs-2">Starred</a></li>    
  echo '</ul>';

echo '<div id="tabs-1">';
$output = ""; // string sent to the javascript for display
$id=$_GET["id"];
//$elems = json_decode($query);
	$sql = 'SELECT data FROM ISITITLE WHERE id='.$id;
	foreach ($base->query($sql) as $row) {
		$output.='<h2>'.$row['data'].'</h2>';
		$find.="<br/><a href=http://scholar.google.com/scholar?q=".urlencode('"'.$row['data'].'"')." target='blank'>[ Search on the web ] </a>";		
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
	$sql = 'SELECT data FROM ISIABSTRACT WHERE id='.$id;
	foreach ($base->query($sql) as $row) {
		$output.='<br/><p><b>Abstract : </b><i>'.$row['data'].' </i></p>';
		$output.="<br>";		
	}

echo $output.$find;
echo '</div>';
//echo '<div id="tabs-2">
//    <p><strong>Click this tab again to close the content pane.</strong></p>
//    <p>Morbi tincidunt, dui sit amet facilisis feugiat, odio metus gravida ante, ut pharetra massa metus id nunc. Duis scelerisque molestie turpis. Sed fringilla, massa eget luctus malesuada, metus eros molestie lectus, ut tempus eros massa ut dolor. Aenean aliquet fringilla sem. Suspendisse sed ligula in ligula suscipit aliquam. Praesent in eros vestibulum mi adipiscing adipiscing. Morbi facilisis. Curabitur ornare consequat nunc. Aenean vel metus. Ut posuere viverra nulla. Aliquam erat volutpat. Pellentesque convallis. Maecenas feugiat, tellus pellentesque pretium posuere, felis lorem euismod felis, eu ornare leo nisi vel felis. Mauris consectetur tortor et purus.</p>
//  </div>';


echo '</div>';
 
function pt($string){
    // juste pour afficher avec retour à la ligne
echo $string."<br/>";
}

function pta($array){
    print_r($array);
    echo '<br/>';
}


?>
