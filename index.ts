#! /usr/bin/env node

// CLI My Bank App: By using Object Oriented Programming (OOP).

import inquirer from 'inquirer';
import chalk from 'chalk';

class Customer {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    mobileNumber: string;
    accountNumber: number;

    constructor(firstName: string, lastName: string, age: number, gender: string, mobileNumber: string, accountNumber: number) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.gender = gender;
        this.mobileNumber = mobileNumber;
        this.accountNumber = accountNumber;
    }
}

class BankAccount {
    customer: Customer;
    balance: number;

    constructor(customer: Customer, balance: number = 0) {
        this.customer = customer;
        this.balance = balance;
    }

    debit(amount: number) {
        let fee = Math.floor(amount / 100); // $1 fee for every $100 debited
        let totalAmount = amount + fee;
        
        if (totalAmount > this.balance) {
            console.log(chalk.red.bold('\nTransaction cancelled: Insufficient funds.'));
        } else {
            this.balance -= totalAmount;
            console.log(chalk.bold(`\nTransaction successful: ${chalk.cyan.bold(amount)} debited with a $${chalk.cyan.bold(fee)} fee.`));
        }
        this.checkBalance();
    }

    credit(amount: number) {
        this.balance += amount;
        console.log(chalk.bold(`\nTransaction successful: ${chalk.cyan.bold(amount)} credited.`));
        this.checkBalance();
    }

    checkBalance() {
        console.log(chalk.bold(`\nCurrent balance: ${chalk.cyan.bold(this.balance)}\n`));
    }
}

function generateAccountNumber(): number {
    return Math.floor(Math.random() * 1000000000); // Generates a 9-digit account number
}

async function main() {
    const answers = await inquirer.prompt([
        { name: 'firstName', message: chalk.blue.bold('Enter your first name:') },
        { name: 'lastName', message:  chalk.blue.bold('Enter your last name:') },
        { name: 'age', message:  chalk.blue.bold('Enter your age:'), validate: (value) => !isNaN(value) && value > 0 ? true :  chalk.blue.bold('Please enter a valid age.') },
        { name: 'gender', message:  chalk.blue.bold('Enter your gender:') },
        { name: 'mobileNumber', message:  chalk.blue.bold('Enter your mobile number:') }
    ]);

    const accountNumber = generateAccountNumber();
    console.log(chalk.bold(`\nYour account number is: ${chalk.cyan.bold(accountNumber)}\n`));

    const customer = new Customer(
        answers.firstName,
        answers.lastName,
        parseInt(answers.age),
        answers.gender,
        answers.mobileNumber,
        accountNumber
    );

    const bankAccount = new BankAccount(customer);

    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: chalk.green.bold('What would you like to do?\n'),
                choices: ['Check Balance', 'Credit Money', 'Debit Money', 'Exit']
            }
        ]);

        if (action === 'Check Balance') {
            bankAccount.checkBalance();
        } else if (action === 'Credit Money') {
            const { amount } = await inquirer.prompt([
                { name: 'amount', message:  chalk.blue.bold('Enter amount to credit:'), validate: (value) => !isNaN(value) && value > 0 ? true :  chalk.blue.bold('Please enter a valid amount.') }
            ]);
            bankAccount.credit(parseFloat(amount));
        } else if (action === 'Debit Money') {
            const { amount } = await inquirer.prompt([
                { name: 'amount', message:  chalk.blue.bold('Enter amount to debit:'), validate: (value) => !isNaN(value) && value > 0 ? true :  chalk.blue.bold('Please enter a valid amount.' )}
            ]);
            bankAccount.debit(parseFloat(amount));
        } else if (action === 'Exit') {
            console.log(chalk.cyan.bold('\nThank you for using My Bank App.'));
            break;
        }
    }
}

main();
