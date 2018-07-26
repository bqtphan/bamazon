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
    init();
});

function init() {
    inquirer
        .prompt({
            name: "userChoice",
            type: "list",
            message: "Select from the following options:",
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        })
        .then(function (answer) {
            switch (answer.userChoice) {
                case 'View Products for Sale':
                    viewProducts();
                    break;
                case 'View Low Inventory':
                    lowInventory();
                    break;
                case 'Add to Inventory':
                    addInventory();
                    break;
                case 'Add New Product':
                    addProduct();
                    break;
            }
        })
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var listOfProducts = [];
        for (let i = 0; i < res.length; i++) {
            listOfProducts.push(res[i])
            console.log("Item ID: " + listOfProducts[i].item_id +
                " | Name: " + listOfProducts[i].product_name +
                " | Price: $" + listOfProducts[i].price +
                " | Quantity: " + listOfProducts[i].stock_quantity);
        }
    })
    connection.end();
}

function lowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {
        if (err) throw err;
        var listOfProducts = [];
        for (let i = 0; i < res.length; i++) {
            listOfProducts.push(res[i])
            console.log("Item ID: " + listOfProducts[i].item_id +
                " | Name: " + listOfProducts[i].product_name +
                " | Price: $" + listOfProducts[i].price +
                " | Quantity: " + listOfProducts[i].stock_quantity);
        }
    })
    connection.end();
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                    name: "productChoice",
                    type: "input",
                    message: "\nEnter the item ID of what would you like to add to: ",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "Enter the quantity to add: ",
                    validate: function (value) {
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
                let newQuantity = chosenItem.stock_quantity + parseInt(answer.quantity);
                connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuantity, parseInt(answer.productChoice)],
                    function (err) {
                        if (err) throw err;
                        console.log("Added " + answer.quantity + " units of " + chosenItem.product_name);
                        connection.end();
                    })
            })
    })
}

function addProduct() {
    inquirer
        .prompt([{
                name: "newItemName",
                type: "input",
                message: "What is the name of the item?"
            },
            {
                name: "newItemDept",
                type: "input",
                message: "What department is the item in?"
            },
            {
                name: "newItemPrice",
                type: "input",
                message: "What is the price of the item?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "newItemQuantity",
                type: "input",
                message: "How many items to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO products SET ?", {
                    product_name: answer.newItemName,
                    department_name: answer.newItemDept,
                    price: answer.newItemPrice,
                    stock_quantity: answer.newItemQuantity
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your item was added successfully!");
                    connection.end();
                }
            )
        })
};