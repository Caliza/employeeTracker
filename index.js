const { prompt } = require("inquirer");
const db = require('./db/connection');
require('console.table');
const util = require('util');
db.query = util.promisify(db.query);

async function appMenu() {
    const answer = await prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'View All Departments',
                    value: 'VIEW_ALL_DEPARTMENTS'
                },
                {
                    name: 'View All Roles',
                    value: 'VIEW_ALL_ROLES'
                },
                {
                    name: 'View All Employees',
                    value: 'VIEW_ALL_EMPLOYEES'
                },
                {
                    name: 'Add A Department',
                    value: 'ADD_A_DEPARTMENT'
                },
                {
                    name: 'Add A Role',
                    value: 'ADD_A_ROLE'
                },
                {
                    name: 'Add An Employee',
                    value: 'ADD_AN_EMPLOYEE'
                },
                {
                    name: 'Update An Employee Role',
                    value: 'UPDATE_AN_EMPLOYEE_ROLE'
                },
            ]
        }
    ]).then(res => {
        console.log('beta', 
        res);
        let choice = res.choice;

        switch (choice) {
            case 'VIEW_ALL_DEPARTMENTS':
                viewAllDepartments();
                break;
            case 'VIEW_ALL_ROLES':
                viewAllRoles();
                break;
            case 'VIEW_ALL_EMPLOYEES':
                viewAllEmployees();
                break;
            case 'ADD_A_DEPARTMENT':
                addADepartment();
                break;
            case 'ADD_A_ROLE':
                addARole();
                break;
            case 'ADD_AN_EMPLOYEE':
                addAnEmployee();
                break;
            case 'ADD_AN_EMPLOYEE':
                addAnEmployee();
                break;
            case 'UPDATE_AN_EMPLOYEE_ROLE':
                updateAnEmployeeRole();
                break;

            default:
                quit();
        }
    })

}

async function viewAllDepartments() {
    const departments = await db.query('select * from department')
    console.table(departments)
    appMenu()
}

async function viewAllRoles() {
    const role = await db.query('select * from role')
    console.table(role)
    appMenu()
}

async function viewAllEmployees() {
    const employee = await db.query('select * from employee')
    console.table(employee)
    appMenu()
}

async function addADepartment() {
    const departments = await db.query("insert into department (name) values('new_department')")
    console.table(departments)
    appMenu()
}

function quit() {
    console.log('Good Bye!!');
    process.exit();
}

appMenu();

// if (answer.choice === 'View All Departments') {
//     viewDepartments()
// }`