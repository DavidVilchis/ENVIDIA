<?php
require ("./conexion.php");
require ("./requestDatabase.php");
if ($_POST) {
    $API = new API();
    $conexion = new Conexion();
    $membershipPack = $_POST['membershipPack'];
    echo $API->selectInformationPack($conexion->getConexion(), $membershipPack);
}
