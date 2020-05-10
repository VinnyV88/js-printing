const mysql = require("mysql");

let connection;
try {
	connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'Bajaisles88',
		port     : '3306',
		database : 'srspf_check_print',
		timeout: 1000000000
	});
	// Make connection.
	connection.connect();

} catch (e) {
	console.log("connection error: " + e.message);
}



// Export connection for our ORM to use.
module.exports = connection;