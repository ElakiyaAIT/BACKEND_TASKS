class Car {
    constructor(speed, fuel) {
        this.speed = speed;
        this.fuel = fuel;
    }

    display() {
        console.log("Speed:", this.speed, "kmps");
        console.log("Fuel:", this.fuel);
    }
}

let bmw = new Car(100, "Diesel");

bmw.display();
