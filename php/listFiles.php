<?php
header ("Content-Type:text/html"); 
$string = getcwd();
$string = str_replace("/php","",$string);


$files = getDirectoryList($string."/data");

//$html = "<select onchange='start(this.value);'>";
$html = "<select style='width:150px;' onchange='
                currentUrl=window.location.origin+window.location.pathname;
                window.location=currentUrl+\"?file=\"+this.value;           
        '>";
$html.="<option selected>[Select your Graph]</option>";
foreach($files as $file){
	$html.="<option>$file</option>";
}
$html.="</select>";
echo $html;

function getDirectoryList ($directory)  {
    $results = array();
    $handler = opendir($directory);
    while ($file = readdir($handler)) {
      if ($file != "." && $file != ".." && 
         (strpos($file,'gexf~'))==false && 
         (strpos($file,'gexf'))==true) {
        $results[] = $file;
      }
    }
    closedir($handler);
    return $results;
}
?>

