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
    const role = await db.query('select role.id, role.title, role.salary, department.name as department_name from role left join department on department.id = role.department_id')
    console.table(role)
    appMenu()
}

async function viewAllEmployees() {
    const employee = await db.query(`SELECT employee.id, employee.first_name AS "first name", employee.last_name 
    AS "last name", role.title, department.name AS department, role.salary, 
    concat(manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee manager
    ON manager.id = employee.manager_id`)
    console.table(employee)
    appMenu()
}

async function addADepartment() {
    const answers = await prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Department name?'
        },
    ]).then((answers) => {
        const departments = db.query(`insert into department SET ?`, answers)
        console.log('beta1', answers);
        addAnother()
    })
}

async function addARole() {
    const departmentChoices = await db.query(`select id as value, name from department`);
    console.log(departmentChoices);
    const answers = await prompt([
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
    ]).then((answers) => {
        console.log('beta1', answers);
        const role = db.query(`insert into role SET ?`, answers)

        addAnother()
    })
}

async function addAnEmployee() {
    const newEmployee = await db.query(`select id as value, concat(first_name, ' ', last_name) as name from employee`);
    const roles = await db.query(`select id as value, title as name from role`)
    console.log(newEmployee);
    const answers = await prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Employees first name?'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Employees lastname?'
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Role id?',
            choices: roles
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Manager id?',
            choices: newEmployee
        },
    ]).then((answers) => {
        console.log('beta1', answers);
        const employee = db.query(`insert into employee SET ?`, answers)

        addAnother()
    })
}

async function updateAnEmployeeRole() {
    const newEmployee = await db.query(`select id as value, concat(first_name, ' ', last_name) as name from employee`);
    const roles = await db.query(`select id as value, title as name from role`)
    const answers = await prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Which employee are we updating?',
            choices: newEmployee
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'What is their new role?',
            choices: roles
        },
    ])
    await db.query(`update employee set role_id = ? where id = ?`, [answers.role_id, answers.employee_id])
    console.log('employee updated');
    addAnother();
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
