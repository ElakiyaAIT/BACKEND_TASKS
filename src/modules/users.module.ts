import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose/dist/mongoose.module";
import { User, UserSchema } from "../schemas/user.schema";
import { UsersService } from "../services/users.service";
import { UsersController } from "../controllers/user.controller";


@Module({
    imports:[
        MongooseModule.forFeature([{name:User.name, schema:UserSchema}])
    ],
     controllers: [UsersController],
  providers: [UsersService],
    exports:[MongooseModule],
})
export class UsersModule{}