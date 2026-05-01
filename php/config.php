<?php

    // load dependencies 
    require __DIR__ . '/../vendor/autoload.php';
    use Dotenv\Dotenv;

    $dotenv = Dotenv::createImmutable(__DIR__.'/../');
    $dotenv->load();

    // set variables 
    $host = $_ENV["DB_HOST"];
    $dbName = $_ENV["DB_NAME"];
    $user = $_ENV["DB_USER"];
    $password = $_ENV["DB_PASSWORD"];

    // try to see if connection to db works 
    
    try {
        // make connection 
        $connect = new PDO("mysql:host={$host};dbname={$dbName}", $user, $password);
        $connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo ("Success");

    }
    catch (PDOException $e) {
        echo "Error : " . $e->getMessage() . "<br/>";
        die();
    }

?>