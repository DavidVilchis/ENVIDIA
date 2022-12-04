<?php
class API{
    public function selectInformationPack(mysqli $mysqli, string $idMembership):string
    {
        $result = $mysqli->query("CALL selectInformation('".$idMembership."')");
        if ($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $array = array('Name-Pack' => $row["description"], 'Price' => $row['price']);
            }
        }
        return json_encode($array);
    }
    public function insertPayment(mysqli $mysqli, string $ccv, string $email, string $idMembership, string $numberCreditCard, float $amount):bool
    {   
        if($mysqli->query("CALL insertPayment('". $ccv ."','". $email ."','". $idMembership ."','". $numberCreditCard ."',". $amount .")")){
            return true;
        }
        else{
            return false;
        }
    }
    public function selectHistorial(mysqli $mysqli, string $email):mysqli_result
    {
        return $mysqli->query("CALL selectHistorial('". $email ."')");
    }
}
?>