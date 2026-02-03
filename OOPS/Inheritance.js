class Car{ 

display (speed, fuel){ 

  console.log("Speed:", speed, "kmps"); 

   console.log("Fuel:",fuel); 

} 

} 

class BMW  extends Car{} 

let b= new BMW(); 

b.display(100,"diesel"); 