//require dependencies
var mysql = require("mysql");
var inquirer = require("inquirer")
//set var connection to create connection to mysql database
var connection = mysql.createConnection({
	host	:"localhost",
	port	:3306,
	user	:"root",
	password:"",
	database:"bamazon"
});
var data = [];
//run prompt when app opens
inquirer.prompt(
	{
		name: "action",
		message: "Please choose an action..",
		type: "checkbox",
		choices: [
		"view product sales by department",
		"create a new department"
		]
	}
).then(function(answer){
	//set var choice to user choice
	var choice = answer.action[0];
	//trigger appropriate function based on user choice
	if (choice === "view product sales by department"){
		//run viewDepartmentSales
		viewDepartmentSales();
	}else{
		//run createNewDepartment
		createNewDepartment();
	};
});

function viewDepartmentSales(){
	//set selections from database in query
	var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales ";
	//set left table
	query += "FROM departments ";
	//set right table and join
	query += "INNER JOIN products ON departments.department_name = products.department_name";
	//connect to mysql and run query
	connection.query(query,function(err,res){
		//error handler
		if (err) throw err;
		//set loop to traverse through query response
		for (var i = 0; i < res.length; i++){
			//push data for each iteration to data array
			data.push([res[i].department_id,res[i].department_name,res[i].over_head_costs,res[i].product_sales]);
			// console.log("ID)" + res[i].department_id + "  Dept)"+res[i].department_name + "  OHC)" + res[i].over_head_costs + "  Sales)" +res[i].product_sales);
		}
		//log array after all data has been pushed
		console.log(data);
		//end connection
		connection.end()
	});
}

function createNewDepartment(){
	inquirer.prompt([
	{
		name: "name",
		message: "What is the name of your new department?"
	},
	{
		name: "overhead",
		message: "What are the over head costs?"
	}
	]).then(function(answers){
		//set var name for department name
		var name = answers.name;
		//set var overhead for over head costs
		var overhead = parseInt(answers.overhead);
		//set query to insert new data row in departments table
		var query = "INSERT INTO departments SET ?"
		//connect to mysql and run query
		connection.query(query,{
			department_name: name,
			over_head_costs: overhead
		},function(err,res){
			//handle errors
			if (err) throw err;
			//end connection
			connection.end();
		})
	});
}