class Pencil {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }

    display() {
        console.log("Name:", this.name);
        console.log("Price:", this.price);
    }
}


let p1 = new Pencil("Doms", 10);
let p2 = new Pencil("Apsara", 15);


p1.display();
p2.display();