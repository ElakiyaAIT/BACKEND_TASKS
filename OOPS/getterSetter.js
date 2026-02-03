class ATM {
    #balance = 0;   
    set deposit(amount) {
        if (amount > 0) {
            this.#balance += amount;
        }
    }
    get balance() {
        return this.#balance;
    }
}

let atm = new ATM();
atm.deposit = 5000;
console.log("Balance:", atm.balance);
