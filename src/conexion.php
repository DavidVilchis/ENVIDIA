<?php
class Conexion{
    //* Attributes for connection to app's database
    private mysqli $mysqli;

    //* Class constructor
    public function __construct() {
        $this->mysqli = new mysqli("localhost", "root", "", "envidia_database");
    }

    //* Function GET, returns the string's connection to database
    public function getConexion():mysqli
    {
        return $this->mysqli;
    }
}
