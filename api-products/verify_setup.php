<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'api_products';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables in $db: " . implode(', ', $tables) . "\n";
    
    $userCount = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    echo "Users in database: $userCount\n";
    
    $productCount = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
    echo "Products in database: $productCount\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
