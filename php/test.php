<?php
$dbname='homework-20750-1-homework-db.db';
$base = new PDO("sqlite:" . $dbname);
$
$sql = "SELECT count(*),wos_id FROM articles2terms where (terms_id="")";
?>
