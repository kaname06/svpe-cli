#!/usr/bin/env node

const inquirer = require('inquirer')
const fs = require('fs-extra')
const path = require('path')

const GenerateFile = require('./generateFile')

MAIN_PATH = process.cwd()

let existingFile = fs.existsSync(path.resolve(MAIN_PATH,'authorization.key'))

let touchFile = async (args) => {
    let result = await GenerateFile(args.date, args.opt, args.auth)
    if(result) {
        return 'authorization.key created successfully'
    }
    else
        return 'An error ocurred while creating the file, check the information and try again'
}

let buildConfig = () => {
    inquirer.prompt([
        {
            type: 'text',
            name: 'auth',
            message: 'What is the auth code of the authorization?',
            default: null
        },
        {
            type: 'list',
            name: 'opt',
            message: 'What is the hashing option of the authorization?',
            choices: [
                'simple hashing',
                'medium hashing',
                'hard hashing'
            ]
        },
        {
            type: 'text',
            name: 'date',
            message: 'What is the max valid date of the authorization?',
            default: (new Date().getMonth() + 1) + "/" + (new Date().getDate()) + "/" + (new Date().getFullYear())
        }
    ])
    .then((answers) => {
        if(answers.opt.toString().includes('hard '))
            answers.opt = 2
        if(answers.opt.toString().includes('medium '))
            answers.opt = 1
        if(answers.opt.toString().includes('simple '))
            answers.opt = 0
        touchFile(answers).then(res => console.log(res))
    })
}

if(existingFile) {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'overwrite',
            message: 'authorization.key already exists! Would you like to overwrite it?',
            default: false
        }
    ])
    .then(answers => {
        if(answers.overwrite) {
            buildConfig()
        }
        else {
            console.log("Goodbye!");
        }
    })
}
else {
    buildConfig()
}