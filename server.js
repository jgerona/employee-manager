const mysql = require('mysql2');
const inquirer = require('inquirer');
//const { default: Choices } = require('inquirer/lib/objects/choices');
const questions = ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
const cTable = require('console.table');

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
                addEmployee();
                
            }
            else if(data.ans == "Update Employee Role"){
                
                getResponses();
            }
            else if(data.ans == "View All Roles"){
                
                getResponses();
            }
            else if(data.ans == "Add Role"){

                getResponses();
            }
            else if(data.ans == "View All Departments"){
                
                getResponses();
            }
            else if(data.ans == "Add Department"){

                getResponses();
            }
        });
}

//show all employees into command line
function viewAllEmployees(){
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id= department.id;`
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
//TODO: how do i add roles to employees while prompt?
function addEmployee(){
    //const roles = [];
    let roles = db.query(`SELECT role.title FROM role`)
    console.log(roles);
    // , (err,rows) => {
    //     if (err) {
    //         console.error(err);
    //         //return;
    //     }
    //     //console.log("\n");
    //     roles = rows;
    //     console.log(roles);
    // })
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
                choices: [],
            },
            {
                type: "list",
                message: "Select employee's manager",
                choices: [],
                name: "manager"
                //needs to get all employees and display for choosing
            }
        ])
        .then((data) => {
            //create employee and add to db
            const sql = `INSERT INTO employee (first_name, last_name, role_id)
                VALUES (?,?,?)`;
            db.query(sql, data.fName, data.lName, data.role, (err, result) => {
                if (err){
                    console.error(err);
                }
            })
            getResponses();
        })
}

getResponses();