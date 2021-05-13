const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'employee_db',
});

connection.connect((err) => {
    if (err) throw err;
    runSearch();
  });
  
//   connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
//   });


const runSearch = () => {
    inquirer
      .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View all employees',
          'View all roles',
          'View all departments',
          'Add Employee',
          'Add Role',
          'Add Department',
          'Update Employee Role',
          'exit',
        ],
      })
  };
  

  connection.end();