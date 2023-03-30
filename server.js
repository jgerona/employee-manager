const mysql = require('mysql2');
const inquirer = require('inquirer');
//const { default: Choices } = require('inquirer/lib/objects/choices');
const questions = ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
const cTable = require('console.table');

var departments = [];
var departmentIDs = [];
var employees = [];
var employeeIDs = [];
var roles = [];
var roleIDs = [];
var managers = [];
var managerIDs = [];
//const roles 
require('dotenv').config();
const express = require('express');


const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: process.env.DB_PASSWORD,
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);

//for updating list of employees
function updateEmployees() {
    const sql = `SELECT id, first_name, last_name FROM employee;`;
    employees = [];
    employeeIDs = [];
    db.query(sql, (err,rows) => {
        if(err) {
            console.error(err);
            return
        }
        for(var i = 0; i < rows.length; i++) {
            employeeIDs.push(rows[i].id);
            employees.push(`${rows[i].first_name} ${rows[i].last_name}`);
        }
        // console.log(` employees ${employees}`)
        updateEmployeeRole();
    })
}

//for updating list of role titles,
function updateRoles() {
    const sql = `SELECT id, title FROM role;`;
    roles = [];
    roleIDs = [];
    db.query(sql, (err,rows) => {
        if (err) {
            console.error(err);
            return
        }
        for(var i =0; i < rows.length; i++){
            roles.push(rows[i].title);
            roleIDs.push(rows[i].id);
        }
        //console.log(` role ids ${roleIDs}`)
    });
}

//For updating departments (for adding a new role)
function updateDepts(){
    const sql = `SELECT id, name FROM department;`
    departments = [];
    departmentIDs =[];
    db.query(sql, (err,rows) => {
        if (err) {
            console.error(err)
            return;
        }
        for(var i = 0; i < rows.length; i++) {
            departmentIDs.push(rows[i].id);
            departments.push(rows[i].name);
        }
        console.log(` dept ${departments}`)
        addRole();
    })
}

//For updating list of managers
function updateManagers() {
    //const sql = `SELECT manager_id FROM employee WHERE manager_id;`;
    const sql = `SELECT m.id, m.first_name, m.last_name FROM employee e LEFT JOIN employee m ON (e.manager_id = m.id) WHERE e.manager_id;`
    managers = [];
    managerIDs = [];
    db.query(sql, (err,rows) => {
        if (err) {
            console.error(err);
            return;
        }
        //console.log(rows[0].id)
        for(var i = 0; i<rows.length; i++){
            if(rows[i].id){
                managers.push(`${rows[i].first_name} ${rows[i].last_name}`);
                managerIDs.push(rows[i].id);
            }
        }
        addEmployee();
        //console.log(`manager ids ${managerIDs}`)
    })
}

function getResponses() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'ans',
                choices: questions
            }
        ])
        .then((data) => {
            //console.log(data.ans);
            if (data.ans == "Quit") {

                return;
            }
            else if(data.ans == "View All Employees"){
                viewAllEmployees();
                getResponses();
            }
            else if(data.ans == "Add Employee"){
                updateRoles();
                updateManagers();
                //console.log(roles);
                // addEmployee(); // added to end of updateManagers();
                
            }
            else if(data.ans == "Update Employee Role"){
                updateRoles();
                updateEmployees();
                //console.log(employees)
                //updateEmployeeRole(); // put into updateEmployees function
            }
            else if(data.ans == "View All Roles"){
                viewAllRoles();
                getResponses();
            }
            else if(data.ans == "Add Role"){
                updateDepts();
                //addRole();
                //console.log(`deptIDs ${departmentIDs}`)
        
            }
            else if(data.ans == "View All Departments"){
                viewAllDepts();
                getResponses();
            }
            else if(data.ans == "Add Department"){
                addDepartment();
                //getResponses();
            }
        });
}

//show all employees into command line
function viewAllEmployees(){
    // const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id= department.id;`
    const sql = `SELECT e.id, e.first_name, e.last_name, role.title, role.salary, m.first_name AS Manager_first_name, m.last_name AS Manager_last_name, department.name AS department FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id= department.id LEFT JOIN employee m ON (e.manager_id = m.id);`

    db.query(sql, (err,rows) => {
        if (err) {
            console.error(err);
            return
        }
        console.log("\n")
        console.table([...rows]);

    });
}

//Add an Employee
function addEmployee(){
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter first name",
                name: "fName"
            },
            {
                type: "input",
                message: "Enter last name",
                name: "lName"
            },
            {
                type: "list",
                message: "Select employee's role",
                name: "role",
                choices: roles,
            },
            {
                type: "list",
                message: "Select employee's manager",
                choices: managers,
                name: "manager"
                //needs to get all employees and display for choosing
            }
        ])
        .then((data) => {
            //console.log(`${[managers.indexOf(data.manager)]}`);
            //create employee and add to db
            const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                VALUES ("${data.fName}","${data.lName}","${roleIDs[roles.indexOf(data.role)]}","${managerIDs[managers.indexOf(data.manager)]}")`;
                
            db.query(sql, (err, result) => {
                if (err){
                    console.error(err);
                }
            })
            getResponses();
        })
}
//change employee role title
function updateEmployeeRole() {
    // console.log(employees)
    inquirer
        .prompt([
            {
                type: "list",
                message: "Select an employee to update",
                choices: employees,
                name: "employee"
            },
            {
                type: "list",
                message: "Select a role title",
                choices: roles,
                name: "role"
            }
        ])
        .then((data) => {
            const sql = `UPDATE employee SET role_id = ${roleIDs[roles.indexOf(data.role)]} WHERE id = ${employeeIDs[employees.indexOf(data.employee)]}`
            db.query(sql, (err,result) => {
                if(err) {
                    console.error(err);
                    return;
                }

            })
            //console.log(sql);
            //console.log(employees)
            getResponses();
        })
}
function viewAllRoles(){
    const sql = `SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.error(err);
            return
        }
        console.log('\n');
        console.table([...rows]);
    })
}

function addRole() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter new title name",
                name: "title",
            },
            {
                type: "number",
                message: "Enter salary",
                name: "salary",
            },
            {
                type: "list",
                message: "Choose Department",
                name: "department",
                choices: departments
            }
        ])
            .then((data) => {
                const sql = `INSERT INTO role (title, salary, department_id) 
                    VALUES ("${data.title}", "${data.salary}","${departmentIDs[departments.indexOf(data.department)]}"); `;
                db.query(sql, (err,res)=>{
                    if(err){
                        console.error(err);
                        return;
                    }
                })
                
                getResponses();
            })
}

function viewAllDepts(){
    const sql = `SELECT id, name AS departments FROM department;`;
    db.query(sql, (err,rows) => {
        if(err){
            console.error(err);
            return;
        }
        console.log('\n');
        console.table([...rows])
    })
}
getResponses();

function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter new department name",
                name: "name",
            }
        ])
        .then((data) => {
            const sql = `INSERT INTO department (name)
                VALUES ("${data.name}");`;
            db.query(sql, (err,res) => {
                if (err){
                    console.error(err)
                    return;
                }
                getResponses();
            })
        })
}