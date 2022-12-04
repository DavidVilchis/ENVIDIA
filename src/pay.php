<?php
require ("./conexion.php");
require ("./requestDatabase.php");
if ($_POST) {
    $API = new API();
    $conexion = new Conexion();
    $membershipPack = $_POST['membershipPack'];
    $result = json_decode($API->selectInformationPack($conexion->getConexion(), $membershipPack));
    $conexion->getConexion()->close();
    if ($_POST['email'] != '' && $_POST['creditCard'] != $_POST['CCV']) {
        $conexion = new Conexion();
        if ($API->insertPayment($conexion->getConexion(), $_POST['CCV'], $_POST['email'], $_POST['membershipPack'], $_POST['creditCard'], $result->{'Price'})) {
            $array = array('status' => '200');
            echo json_encode($array);
        } else {
            $array = array('status' => '403');
            echo json_encode($array);
        }
    } else {
        $array = array('status' => '402');
        echo json_encode($array);
    }
}
