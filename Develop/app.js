const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

function getEmployeeInfo() {
    return new Promise(resolve => {
        const genQuestions = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter the name of the employee:'
            },
            {
                type: 'input',
                name: 'ID',
                message: "Enter the employee's ID: "
            },
            {
                type: 'input',
                name: 'email',
                message: 'Enter the email address of the employee:'
            },
            {
                type: 'list',
                name: 'employeeType',
                message: 'Please choose an employee type:',
                choices: ['Manager', 'Engineer', 'Intern']
            }
        ]
        inquirer.prompt(genQuestions).then(response => {
            switch (response.employeeType) {
                case "Manager":
                    const man = [
                        {
                            type: 'input',
                            name: 'officeNumber',
                            message: 'Enter the office number of the manager:'
                        },
                        {
                            type: 'list',
                            name: 'again',
                            message: 'Would you like to input the information of another employee?',
                            choices: ['Yes', 'No']
                        }
                    ];
                    inquirer.prompt(man).then(managerResponse => {
                        resolve([managerResponse.again === 'Yes', new Manager(response.name, response.ID, response.email, managerResponse.officeNumber)]);
                    });
                    break;
                case "Engineer":
                    const eng = [
                        {
                            type: 'input',
                            name: 'github',
                            message: 'Enter the Github username of the engineer:'
                        },
                        {
                            type: 'list',
                            name: 'again',
                            message: 'Would you like to input the information of another employee?',
                            choices: ['Yes', 'No']
                        }
                    ];
                    inquirer.prompt(eng).then(engineerResponse => {
                        resolve([engineerResponse.again === 'Yes' ,new Engineer(response.name, response.ID, response.email, engineerResponse.github)]);
                    });
                    break;
                case "Intern":
                    const intern = [
                        {
                            type: 'input',
                            name: 'school',
                            message: "Enter the name of the university the intern goes too."
                        },
                        {
                            type: 'list',
                            name: 'again',
                            message: 'Would you like to input the information of another employee?',
                            choices: ['Yes', 'No']
                        }
                    ];
                    inquirer.prompt(intern).then(internResponse => {
                        resolve(internResponse.again === 'Yes' ,[new Intern(response.name, response.ID, response.email, internResponse.school)]);
                    });
                    break;
            }
        });
    });
}

async function main() {
    let employees = [];
    let runPrompt = true;
    while (runPrompt) {
        let [again, employee] = await getEmployeeInfo();
        employees.push(employee);
        if (!again) {
            runPrompt = false;
        }
    }
    console.log(employees);
}

main();


// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

