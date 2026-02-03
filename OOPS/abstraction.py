class Car:
    def start(self):
        print("Starting the car..")
        self.__engine_process()

    def __engine_process(self):
        print("Fuel injected")
        print("Engine mechanics working...")
        print("Car started successfully")

car = Car()
car.start()