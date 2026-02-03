class ATM {
    #pin = 1234;     
    #balance = 5000; 

    withdraw(inputPin, amount) {
        if (inputPin === this.#pin) {
            this.#balance -= amount;
            console.log("Cash withdrawn");
        } else {
            console.log("Wrong PIN");
        }
    }

    checkBalance(inputPin) {
        if (inputPin === this.#pin) {
            console.log("Balance:", this.#balance);
        } else {
            console.log("Wrong PIN");
        }
    }
}

let atm = new ATM();

atm.withdraw(1234, 1000);
atm.checkBalance(1234);
