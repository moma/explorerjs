<?php
header ("Content-Type:text/xml");  

/*
 * Génère le gexf des scholars à partir de la base sqlite
 */
include ("parametres.php");
include ("normalize.php");
//include("../common/library/fonctions_php.php");


define('_is_utf8_split', 5000);

function is_utf8($string) {

    // From http://w3.org/International/questions/qa-forms-utf-8.html
    return preg_match('%^(?:
          [\x09\x0A\x0D\x20-\x7E]            # ASCII
        | [\xC2-\xDF][\x80-\xBF]             # non-overlong 2-byte
        |  \xE0[\xA0-\xBF][\x80-\xBF]        # excluding overlongs
        | [\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}  # straight 3-byte
        |  \xED[\x80-\x9F][\x80-\xBF]        # excluding surrogates
        |  \xF0[\x90-\xBF][\x80-\xBF]{2}     # planes 1-3
        | [\xF1-\xF3][\x80-\xBF]{3}          # planes 4-15
        |  \xF4[\x80-\x8F][\x80-\xBF]{2}     # plane 16
    )*$%xs', $string);
}

$scholars = array();
$scholars_colors = array(); // pour dire s'il y a des jobs postés sur ce scholar
$terms_colors = array(); // pour dire s'il y a des jobs postés sur ce term
//phpinfo();
/* $gexf = '<?xml version="1.0" encoding="UTF-8"?>'; */
$gexf = '';
$edgesXML='';
//echo $_GET['query']."<br/>";
$loginraw = explode("*", $_GET['login']);
$login = $loginraw[0];
$base = new PDO("sqlite:" . $dbname);


if ($login) {
    if (sizeof($login) > 0) {
// liste des chercheurs
        $sql = "SELECT keywords_ids FROM scholars where unique_id='" . $login . "'";
        #pt($sql);
        foreach ($base->query($sql) as $row) {
            $keywords_ids = split(',', $row['keywords_ids']);
            $scholar_array = array();
            foreach ($keywords_ids as $keywords_id) {
                $sql2 = "SELECT * FROM scholars2terms where term_id=" . trim($keywords_id);
                #pt($sql2);
                foreach ($base->query($sql2) as $row) {
                    $scholar_array[$row['scholar']] = 1;
                }
            }
        }
        $scholar_list = array_keys($scholar_array);
        foreach ($scholar_list as $scholar_id) {
            $sql = "SELECT * FROM scholars where unique_id='" . $scholar_id . "'";
            foreach ($base->query($sql) as $row) {
                $info = array();
                $info['id'] = $row['id'];
                $info['unique_id'] = $row['unique_id'];
                $info['photo_url'] = $row['photo_url'];
                $info['first_name'] = $row['first_name'];
                $info['initials'] = $row['initials'];
                $info['last_name'] = $row['last_name'];
                $info['nb_keywords'] = $row['nb_keywords'];
                $info['css_voter'] = $row['css_voter'];
                $info['css_member'] = $row['css_member'];
                $info['keywords_ids'] = explode(',', $row['keywords_ids']);
                $info['keywords'] = $row['keywords'];
                //$info['status'] =  $row['status'];
                $info['country'] = $row['country'];
                $info['homepage'] = $row['homepage'];
                $info['lab'] = $row['lab'];
                $info['affiliation'] = $row['affiliation'];
                $info['lab2'] = $row['lab2'];
                $info['affiliation2'] = $row['affiliation2'];
                $info['homepage'] = $row['homepage'];
                $info['title'] = $row['title'];
                $info['position'] = $row['position'];
                $info['job_market'] = $row['job_market'];
                $info['login'] = $row['login'];
                //print_r($row);
                $scholars[$row['unique_id']] = $info;
            }
        }
    }
}

// génère le gexf
include('gexf_generator.php');


exec("rm -R gexfs/*");
$showdate = date('Y-m-d_H:i:s') . "." . microtime_float();
$handle = fopen('gexfs/' . $showdate . '.gexf', "w", "UTF-8");
fputs($handle, $gexf);
fclose($handle);
$gexf=NULL;
//echo date('Y-m-d_H:i:s').": Writing gexf DONE<br>";
//echo date('Y-m-d_H:i:s').": Calling jar...<br>";
exec("/usr/bin/java -jar tinaviz-2.0-SNAPSHOT.jar gexfs/$showdate.gexf ".$loginraw[1], $outputo);
//echo date('Y-m-d_H:i:s').": output = ".$outputo[0];

$xml = simplexml_load_file($outputo[0]);
$xml_array = object2array($xml);
$newpositions=array();
foreach ($xml_array['graph']['nodes'] as $nodes) {
    for ($i = 0; $i < count($nodes); $i++) {
        $info = array();
        $info['x'] = $nodes[$i] ["@attributes"]['x'];
        $info['y'] = $nodes[$i] ["@attributes"]['y']; 
        $newpositions[$nodes[$i]["@attributes"]['id']]=$info;
    }
    break;
}

$gexf='';
$gexf .= '<gexf xmlns="http://www.gexf.net/1.1draft" xmlns:viz="http://www.gephi.org/gexf/viz" version="1.1"> ';
$gexf .= '<meta lastmodifieddate="20011-11-11">'."\n";
$gexf .= ' </meta>'."\n";
$gexf .= '<graph type="static">' . "\n";
$gexf .= '<attributes class="node" type="static">' . "\n";
$gexf .= ' <attribute id="0" title="category" type="string">  </attribute>' . "\n";
$gexf .= ' <attribute id="1" title="occurrences" type="float">    </attribute>' . "\n";
$gexf .= ' <attribute id="2" title="content" type="string">    </attribute>' . "\n";
$gexf .= ' <attribute id="3" title="keywords" type="string">   </attribute>' . "\n";
$gexf .= ' <attribute id="4" title="weight" type="float">   </attribute>' . "\n";
$gexf .= '</attributes>' . "\n";
$gexf .= '<attributes class="edge" type="float">' . "\n";
$gexf .= ' <attribute id="5" title="cooc" type="float"> </attribute>' . "\n";
$gexf .= ' <attribute id="6" title="type" type="string"> </attribute>' . "\n";
$gexf .= "</attributes>" . "\n";
$gexf .= "<nodes>" . "\n";
foreach ($terms_array as $term) {
	$nodeId = 'N::' . $term['id'];
	$nodeLabel = str_replace('&', ' and ', $terms_array[$term['id']]['term']);
	$gexf .= '<node id="' . $nodeId . '" label="' . $nodeLabel . '">' . "\n";
	$gexf .= '<viz:color b="19" g="'.max(0,180-(100*$terms_colors[$term['id']])).'"  r="244"/>' . "\n";
	$gexf .= '<viz:position x="'.($newpositions['N::' . $term['id']]['x']).'" y="'.($newpositions['N::'.$term['id']]['y']) . '"  z="0" />' . "\n";
	$gexf .= '<attvalues> <attvalue for="0" value="NGram"/>' . "\n";
	$gexf .= '<attvalue for="1" value="' . $terms_array[$term['id']]['occurrences'] . '"/>' . "\n";
	$gexf .= '<attvalue for="4" value="' . $terms_array[$term['id']]['occurrences'] . '"/>' . "\n";
	$gexf .= '</attvalues></node>' . "\n";
}


foreach ($scholars as $scholar) {
    $uniqueId = $scholar['unique_id'];
    if (!array_key_exists($uniqueId, $scholarsMatrix)) {
        continue;
    }
    if (count($scholarsMatrix[$uniqueId]['cooc']) >= $min_num_friends) {
        $nodeId = 'D::' . $uniqueId;
        $theID = $scholar['id'];
        $nodeLabel = $scholar['title'] . ' ' . $scholar['first_name'] . ' ' . $scholar['initials'] . ' ' . $scholar['last_name'];
        $content = '';        
        if ($scholar['photo_url'] != null) {
            $content .= '<img  src=http://main.csregistry.org/' . $scholar['photo_url'] . ' width=' . $imsize . 'px  style=float:left;margin:5px>';
        } else {
            if (count($scholars) < 2000) {
                $im_id = floor(rand(0, 11));
                $content .= '<img src=http://communityexplorer.csregistry.org/img/' . $im_id . '.png width=' . $imsize . 'px   style=float:left;margin:5px>';
            }
        }

        $content .= '<b>Country: </b>' . $scholar['country'] . '</br>';

        if ($scholar['position'] != null) {
            $content .= '<b>Position: </b>' . str_replace('&', ' and ', $scholar['position']) . '</br>';
		}
		$affiliation = '';
		if ($scholar['lab'] != null) {
			$affiliation .= $scholar['lab'] . ',';
		}
		if ($scholar['affiliation'] != null) {
			$affiliation .= $scholar['affiliation'];
		}
		if (($scholar['affiliation'] != null) | ($scholar['lab'] != null)) {
			$content .= '<b>Affiliation: </b>' . str_replace('&', ' and ', $affiliation) . '</br>';
		}

		if (strlen($scholar['keywords']) > 3) {
			$content .= '<b>Keywords: </b>' . str_replace(',', ', ', substr($scholar['keywords'], 0, -1)) . '.</br>';
		}

		if (substr($scholar['homepage'], 0, 3) === 'www') {
			$content .= '[ <a href=' . str_replace('&', ' and ', 'http://' . $scholar['homepage']) . ' target=blank > View homepage </a ><br/>]';
		} elseif (substr($scholar['homepage'], 0, 4) === 'http') {
			$content .= '[ <a href=' . str_replace('&', ' and ', $scholar['homepage']) . ' target=blank > View homepage </a >]<br/>';
		}
		if ($scholars_colors[$scholar['login']] ==1) {
			$color = 'b="243" g="183"  r="19"';
		} elseif (strcmp ($scholar['job_market'],'Yes')==0){
                        $color = 'b="139" g="28"  r="28"';
                }else{
			$color = 'b="78" g="193"  r="127"';
		}
                
                if (is_utf8($nodeLabel)) {
                        $gexf .= '<node id="D::' . $theID. '" label="' . $nodeLabel . '">' . "\n";
			//$gexf .= '<viz:color b="'.(243-min(243,(200*$scholars_colors[$scholar['login']]))).'" g="183"  r="19"/>' . "\n";
			$gexf .= '<viz:color '.$color.'/>' . "\n";
			$gexf .= '<viz:position x="' . ($newpositions['D::' .$theID]['x']) . '"    y="' . ($newpositions['D::' .$theID]['y']) . '"  z="0" />' . "\n";
			$gexf .= '<attvalues> <attvalue for="0" value="Document"/>' . "\n";
			if (true) {
				$gexf .= '<attvalue for="1" value="12"/>' . "\n";
				$gexf .= '<attvalue for="4" value="12"/>' . "\n";

			} else {
				$gexf .= '<attvalue for="1" value="10"/>' . "\n";
				$gexf .= '<attvalue for="4" value="10"/>' . "\n";

			}
			if (is_utf8($content)) {
				$gexf .= '<attvalue for="2" value="' . htmlspecialchars($content) . '"/>' . "\n";
			}
			$gexf .= '</attvalues></node>' . "\n";
		}
	}

}
$gexf .= "</nodes>" . "\n";

$gexf .= "<edges>" . "\n";
$gexf .=" ".$edgesXML;
$gexf .= "</edges>" . "\n";

$gexf .= "</graph>" . "\n";
$gexf .= "</gexf>" . "\n";
echo $gexf;

function object2array($object) {
    return @json_decode(@json_encode($object), 1);
}

function microtime_float() {
    list($usec, $sec) = explode(" ", microtime());
    return ((float) $usec + (float) $sec);
}

function pt($string) {
    echo $string . '<br/>';
}

function jaccard($occ1, $occ2, $cooc) {
    if (($occ1 == 0) || ($occ2 == 0)) {
        return 0;
    } else {
        return ($cooc * $cooc / ($occ1 * $occ2));
    }
}

function scholarlink($term_occurrences, $scholars1_nb_keywords, $scholars2nb_keywords) {
    if (($term_occurrences > 0) && ($scholars1_nb_keywords > 0) && ($scholars2_nb_keywords > 0)) {
        return 1 / log($term_occurrences) * 1 / log($scholars1_nb_keywords) * 1 / $scholars2_nb_keywords;
    } else {
        return 0;
    }
}

?>
