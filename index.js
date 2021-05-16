const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

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
          'View all Employees',
          'View all Roles',
          'View all Departments',
          'Add Employee',
          'Add Role',
          'Add Department',
          'Update Employee Role',
          'Exit',
        ],
      })
      .then((answer) => {
        switch (answer.action) {
          case 'View all Employees':
            viewEmployees();
            break;
          case 'View all Roles':
           viewRoles();
           break;
          case "View all Departments":
            viewDepartments();
            break;
          case 'Add Employee':
            addDepartment();
            break;
          case 'Add Role':
            addRole();
            break;
          case 'Add Department':
            addDepartment();
            break;
          case 'Update Employee Role':
            updateRole();
            break;
          case 'Exit':
            exit();
            break;
          default:
            console.log(`Invalid action: ${answer.action}`);
            break;
          
        }
        
    });
};


const viewEmployees = () => {
    const query = `SELECT emp.id, emp.first_name, emp.last_name, title, 
    mngr.first_name managerFirstName, mngr.last_name managerLastName
    FROM employee_db.employee emp
    inner join role on role_id = role.id
    left join employee mngr on mngr.id = emp.manager_id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    });

};

const viewRoles = () => {
  const query = `select role.id, title, salary, department.name department from role
  inner join department on department_id = department.id`;
  connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
  });

};
const viewDepartments = () => {
  const query = 'SELECT * FROM employee_db.department';
  connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
  });

};
