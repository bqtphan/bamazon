DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR (100) NOT NULL,
    department_name VARCHAR (100) NOT NULL,
    price INT (10) NOT NULL,
    stock_quantity INTEGER (100)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("95-inch TVs", "Electronics", 2999, 4), ("Gaming PCs", "Electronics", 1899, 95), ("XboxTwos", "Electronics", 699, 105),
("Ugly T-shirts", "Clothing", 10, 201), ("Overrated Designer Pants", "Clothing", 2000, 28), ("One Sock", "Clothing", 11, 3),
("Chairs", "Home Goods", 50, 41), ("Towels", "Home Goods", 20, 45), ("Forks", "Home Goods", 20, 1),("Soap", "Home Goods", 4, 24);


SELECT * FROM products;