const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

/*
  getEmployeeInfo is an async process since its completion depends on the user answering the prompt.
  This function returns a new Employee object corresponding to the user's prompt answers, as a well
  as a boolean indicating whether another series of prompts will be displayed to the or not.
*/
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
                    inquirer.prompt(man).then(answer => {
                        resolve([answer.again === 'Yes', new Manager(response.name, response.ID, response.email, answer.officeNumber)]);
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
                    inquirer.prompt(eng).then(answer => {
                        resolve([answer.again === 'Yes', new Engineer(response.name, response.ID, response.email, answer.github)]);
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
                    inquirer.prompt(intern).then(answer => {
                        resolve(answer.again === 'Yes', [new Intern(response.name, response.ID, response.email, answer.school)]);
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
    let html = render(employees);
    if (!fs.existsSync(OUTPUT_DIR)) {
        console.log("Error");
        fs.mkdirSync(OUTPUT_DIR);
    }
    fs.writeFile(outputPath, html, () => {});
}

main();

