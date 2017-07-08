var mysql = require("mysql");
var inquirer = require("inquirer")
var connection = mysql.createConnection({
	host	:"localhost",
	port	:3306,
	user	:"root",
	password:"",
	database:"bamazon"
});

//when app opens connect to mysql and display a list of products
connection.query("SELECT * FROM products", function(err,res){
	if(err) throw err;
	//set loop to traverse through all products in database and log them
	for(i=0;i<res.length;i++){
		//set var p as res for each iteration
		var p =res[i];
		console.log("["+p.id+"]" + " " + "-" + " " + p.product_name + " $" + p.price);
	};
});

function updateQuantity(quantity,key){
connection.query("UPDATE products SET ? WHERE ?",
	[
		{
			stock_quantity: quantity
		},
		{
			id: key
		}
	],function(err,res){
		if(err) throw err;
	});
}

function calculateCost(quantity,price,log){
	var totalCost = quantity * price;
	if (log){
	console.log("Your total cost for this transaction is "+totalCost+ " dollars");
	}
	return totalCost;
}

function updateProductSales(currentRevenue,addedRevenue,key){
	var totalSales = currentRevenue + addedRevenue;
	connection.query("UPDATE products SET ? WHERE ?",
		[
			{
				product_sales: totalSales
			},
			{
				id: key
			}
		]
		,function(err,res){
			if (err) throw err;
	});
}

inquirer.prompt([
{
	name: "product",
	message: "please enter the ID of the product you wish to purchase.."
},
{
	name: "quantity",
	message: "please enter the quantity.."
}
]).then(function(a){
	//connect to mysql and run query
	connection.query("SELECT * FROM products WHERE id="+a.product,function(err,res){
		//handle errors
		if (err) throw err;
		//defin check quantity function
		function checkQuantity(request,availability){
			//if the amount of products the customer requests exist in inventory
			if (request <= availability){
				//set var for remaining quantity
				var remainingQuantity = availability - request;
				//update quantity
				updateQuantity(remainingQuantity,res[0].id);
				//calculate cost and log
				calculateCost(request,res[0].price,"log");
				//update product sales
				updateProductSales(res[0].product_sales,calculateCost(request,res[0].price),res[0].id);
			}else{
				console.log("sorry not enough inventory to fulfill your order..");
			};
		};
		//run check quantity function
		checkQuantity(a.quantity,res[0].stock_quantity);
		//end connection
		connection.end();
	});
});

