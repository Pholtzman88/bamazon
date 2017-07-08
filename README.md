# bamazon

## setup

In order to run this application properly you will need to install the following dependencies

![dependencies](/images/dependencies.PNG)

Then you will need to update the var connection in the bamazonCustomer,bamazonManager and bamazonSupervisor
JS files to match your server connection to mysql.

![connection](/images/connection.PNG)

Once your files have been updated you will need to create a new database in mysql called bamazon. Open
mysql and Enter into a new query tab the code shown below. You must enter this exact code for the JS files
to recognize and interact with the database,tables and data rows properly.

![mysql](/images/mysql.PNG)



## bamazonCustomer.js

Triggering this file in node will allow the user to purchase items from
the mysql database products table.

## bamazonManager.js

Triggering this file in node will allow the user to either view all 
products in the mysql database, check which products are running low
on inventory, add inventory to selected products or add a new product
to the mysql database.

## bamazonSupervisor

Triggering this file will allow the user to track departmental sales and
profits as well as allow the user to add a new department.
 

click
[here](https://youtu.be/7nOvEGPtCss)
to access a demonstration of how users can interact with this application..



