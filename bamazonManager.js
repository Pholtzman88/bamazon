var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
	host	:"localhost",
	port	:3306,
	user	:"root",
	password:"",
	database:"bamazon"
});
var count = 0;
var productsArr = [];
inquirer.prompt(
	{
		name: "action",
		message: "select an action",
		type: "checkbox",
		choices: 
		[
		"view products for sale",
		"view low inventory",
		"add to inventory",
		"add product"
		]
	}
).then(function(answer){
	var option = answer.action[0];
	if(option === "view products for sale"){
		viewProductsForSale();
	}else if (option === "view low inventory"){
		viewLowInventory();
	}else if (option === "add to inventory"){
		addToInventory();
	}else if(option === "add product"){
		inquirer.prompt([
			{
				name: "name",
				message: "What is the name of your product?"
			},
			{
				name: "department",
				message: "what department does your product belong to?"
			},
			{
				name: "price",
				message: "how much is your product worth?"
			},
			{
				name: "quantity",
				message: "How many of these product would you like to add?"
			}									
		]).then(function(answer){
			addProduct(answer.name,answer.department,answer.price,answer.quantity);
		});	
	}else{
		//
	};
});

function viewProductsForSale(){
	connection.query("SELECT * FROM products", function(err,res){
		if (err) throw err;

		for(i=0;i<res.length;i++){
			var p =res[i];
			console.log("");			
			console.log("ID - "+p.id+"\n" + "Product - " + p.product_name + "\n" +
			 "Price - " + " $" + p.price + "\n" + "Quantity - " + p.stock_quantity);
			console.log("----------------------------------------");
		};	
		connection.end();	
	});
};

function viewLowInventory(){
	connection.query("SELECT * FROM products", function(err,res){
		if (err) throw err;

		for(i=0;i<res.length;i++){
			var p =res[i];
			if ( p.stock_quantity < 5){
			console.log("");			
			console.log("ID - "+p.id+"\n" + "Product - " + p.product_name + "\n" +
			 "Price - " + " $" + p.price + "\n" + "Quantity - " + p.stock_quantity);
			console.log("----------------------------------------");				
			};
		};	
		connection.end();	
	});
};

function addToInventory(){
	//increase count by 1 each time function recurrs
	count ++;
	//get all products from database
	connection.query("SELECT * FROM products", function(err,res){
		//set index var
		var index = count - 1;
		//set product var
		var p = res[index];
		//set recursion to traverse through each product in database
		if (count <= res.length){
			//push product to products array
			productsArr.push("id: "+ p.id+ "   " + "Product: " + p.product_name + "   " +
			 "Price: " + p.price + "   " + "Quantity: " + p.stock_quantity);
			//trigger recursion
			addToInventory();
		}else{
			//when recursion is finished and all products have been pushed to array prompt usser to select a product
			inquirer.prompt([
			{
				name: "action",
				message: "select a product to update the quantity of..",
				type: "checkbox",
				choices: productsArr 
			},
			{
				name: "quantity",
				message: "how many units would you like to add?"
			}
			]).then(function(answer){
				//split answers 
				var result = answer.action[0].split(" ");
				//set id variable
				var id = result[1];
				//set initial inventory var
				var inventory = parseInt(result[13]);
				//set added inventory var
				var addedInventory = parseInt(answer.quantity);
				//set product name var
				var product = result[5];
				//update data in database to reflect the added inventory
				connection.query(
					"UPDATE products SET ? WHERE ?",
					[
						{
							stock_quantity: inventory + addedInventory
						},
						{
							id: result[1]
						}
					]
					,function(err,res){
						if (err) throw err;
						//set plural var for console log
						var plural = "s";
						//if more than 1 item is added to inventory make product plural else do not
						if(addedInventory > 1){
						console.log("You have added "+addedInventory.toString()+ " " + product + plural);	
						}else{
							console.log("You have added "+addedInventory.toString()+ " " + product);						
						}
						//end connection to mysql
						connection.end();
					}
				);
			});			
		};
	});
}

function addProduct(productName,departmentName,productPrice,stockQuantity){
	connection.query("INSERT INTO products SET ?",
		{
			product_name: productName,
			department_name: departmentName,
			price: productPrice,
			stock_quantity: stockQuantity
		}
	,function(err,res){
		if (err) throw err;
		//end connection to mysql
		connection.end();
	});
}