class Car {
    start() {
        console.log("Car is starting");
    }
}
class PetrolCar extends Car {
    start() {
        console.log("Petrol/Diesel car starts using fuel");
    }
}
class ElectricCar extends Car {
    start() {
        console.log("Electric car starts using battery");
    }
}

let car1 = new PetrolCar();
let car2 = new ElectricCar();

car1.start();
car2.start();
