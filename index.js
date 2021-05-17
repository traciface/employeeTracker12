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
            getManagers();
            break;
          case 'Add Role':
            addRole();
            break;
          case 'Add Department':
            addDepartment();
            break;
          case 'Update Employee Role':
            getEmployees();
            break;
          case "Exit":
              connection.end();
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
        runSearch();
    });

};

const viewRoles = () => {
  const query = `select role.id, title, salary, department.name department from role
  inner join department on department_id = department.id`;
  connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      runSearch();
  });

};
const viewDepartments = () => {
  const query = 'SELECT * FROM employee_db.department';
  connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      runSearch();
  });

};
const addDepartment = () =>{
  inquirer
  .prompt(
    {
    name: 'department',
    type: 'input',
    message: 'What is the name of the department are you adding?'
  })
  .then((answer) => {
    const query = `insert into department SET ?`
    connection.query(query, {
      name: answer.department
    })
    runSearch();
  })
};

const addRole = () =>{
  connection.query("SELECT * FROM department", (err, res) => 
  {
    if (err) throw err;
   departmentChoices = res.map(({ id, name }) => ({
      name: name,
      value: id
    }))
  
  inquirer
  .prompt([
    {
    name: 'title',
    type: 'input',
    message: 'What is the title of the new role?'
  },
  {
    name: 'salary',
    type: 'input',
    message: 'What is this salary of this role?'
  },
  {
    name: 'departmentID',
    type: 'list',
    message: 'What is the department ID',
    choices: departmentChoices
  }
  ])
  
  .then((answer) => {
    const query = `insert into role SET ?`
    connection.query(query, {
      title: answer.title,
      salary: answer.salary,
      department_id: answer.departmentID
    })
    runSearch();
  })
})
};

const getManagers = () =>
{
  connection.query("SELECT * FROM employee", (err, res) => 
  {
    if (err) throw err;
   managerChoices = res.map(({ id, first_name, last_name }) => ({
      name: first_name + last_name,
      value: id
    }))
    getRoles(managerChoices)
  })
  };

  const getRoles = (managerChoices) =>
{
  connection.query("SELECT * FROM role", (err, res) => 
  {
    if (err) throw err;
   roleChoices = res.map(({ id, title }) => ({
      name: title,
      value: id
    }))
    addEmployee(managerChoices, roleChoices);
  })
  
  };

const addEmployee = (managerChoices, roleChoices) =>
{
  
  inquirer
  .prompt([
    {
    name: 'firstName',
    type: 'input',
    message: 'What is the first name of the employee?'
  },
  {
    name: 'lastName',
    type: 'input',
    message: 'What is last name of the employee?'
  },
  {
    name: 'roleID',
    type: 'list',
    message: 'What is the role ID',
    choices: roleChoices
  },
  {
     name: 'managerID',
    type: 'list',
    message: 'What is the manager ID',
    choices: managerChoices
  }
  ])
  
  .then((answer) => {
    const query = `insert into employee SET ?`
    connection.query(query, {
      first_name: answer.firstName,
      last_name: answer.lastName,
      role_id: answer.roleID,
      manager_id: answer.managerID

    })
    runSearch();
  })
};


const getEmployees = () =>
{
  connection.query("SELECT * FROM employee", (err, res) => 
  {
    if (err) throw err;
    employeechoices = res.map(({ id, first_name, last_name }) => ({
      name: first_name + last_name,
      value: id
    }))
    getEmployeeRoles(employeechoices)
  })
  };

  const getEmployeeRoles = (employeechoices) =>
{
  connection.query("SELECT * FROM role", (err, res) => 
  {
    if (err) throw err;
   roleChoices = res.map(({ id, title }) => ({
      name: title,
      value: id
    }))
    updateEmployeeRole(employeechoices, roleChoices);
  })
  
  };

const updateEmployeeRole = (employeechoices, roleChoices) =>
{
  
  inquirer
  .prompt([
    {
    name: 'employeeID',
    type: 'list',
    message: 'Who is the employee that will be changed?',
    choices: employeechoices
  },
  {
    name: 'newRole',
    type: 'list',
    message: 'Select new role',
    choices: roleChoices
  }
  ])
  
  .then((answer) => {
    const query = `update employee SET role_ID = ? WHERE id = ?`
    connection.query(query, [
       answer.newRole,
       answer.employeeID
    ])
    runSearch();
  })
};

