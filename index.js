const { prompt } = require("inquirer");
const db = require('./db/connection');
// const db1 = require('./db');
require('console.table');
const util = require('util');
db.query = util.promisify(db.query);
// const findAllDepartments = db.query(`slect * from department`);

// console.log('beta2', findAllDepartments );

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
        },
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
    const answers = await prompt ([
        {
            type: 'input',
            name: 'name',
            message: 'Department name?'
        },
    ]).then((answers) =>{
        const departments = db.query(`insert into department SET ?`, answers)
        console.log('beta1', answers);
        addAnother()
    })
}

async function addARole(){
    const departmentChoices = await db.query(`select * from department`);
    const answers = await prompt ([
        // {
        //     type: "list",
        //     name: "department_id",
        //     message: "Which department does the role belong to?",
        //     choices: departmentChoices
        // },
        {
            type: 'input',
            name: 'title',
            message: 'Add title?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Add salary?'
        },
        {
             type: "list",
            name: "department_id",
            message: "Which department does the role belong to?",
            choices: departmentChoices
        },
    ]).then((answers) =>{
        const role = db.query(`insert into role SET ?`, (answers.title, answers.salary, answers.department))
        console.log('beta1', answers);
        addAnother()
    })
}

async function addAnother() {
    
    const answer = await prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'Do you want to do something else?',
            choices: ['Yes', 'No'],
        }
    ]).then((answer) => {
        if (answer.choice === "Yes") {
            appMenu();
        } else {
            quit();
        }
    })
  }

function quit() {
    console.log('Good Bye!!');
    process.exit();
}



appMenu();

// if (answer.choice === 'View All Departments') {
//     viewDepartments()
// }`