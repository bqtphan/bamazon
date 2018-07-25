var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    productList();
});

function productList() {
    console.log("LIST OF AVAILABLE PRODUCTS");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        listOfProducts = [];
        for (let i = 0; i < res.length; i++) {
            listOfProducts.push(res[i])
            console.log("Item ID: " + listOfProducts[i].item_id +
                " | Name: " + listOfProducts[i].product_name +
                " | Price: $" + listOfProducts[i].price +
                " | Quantity: " + listOfProducts[i].stock_quantity);
        }
         customerAsk();
    });
}

function customerAsk() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                    name: "productChoice",
                    type: "input",
                    message: "\nEnter the item ID of what would you like to buy: ",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                          return true;
                        }
                        return false;
                      }
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "Enter the quantity to buy: ",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                          return true;
                        }
                        return false;
                      }
                }
            ])
            .then(function (answer) {
                var chosenItem
                for (var i = 0; i < res.length; i++) {
                    if (res[i].item_id === parseInt(answer.productChoice)) {
                        chosenItem = res[i];
                    }
                }
                if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
                    let newQuantity = chosenItem.stock_quantity-parseInt(answer.quantity);
                    let totalPrice = chosenItem.price * parseInt(answer.quantity)
                    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?" , [newQuantity,parseInt(answer.productChoice)],
                        function (err) {
                            if (err) throw err;
                            console.log("Total Price: $" + totalPrice);
                            console.log("Purchased successfully!\n");
                            productList();
                        })
                } else {
                    console.log("Insufficient quantity! \n");
                    productList();
                }
            });
    });
}