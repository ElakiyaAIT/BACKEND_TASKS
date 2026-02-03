class BankAccount {
    #balance = 0; 

    deposit(amount) {
        this.#balance += amount;
        console.log("Balance after deposit:", this.#balance);
    }
}

let acc = new BankAccount();
acc.deposit(5000);
