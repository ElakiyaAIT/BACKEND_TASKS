import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose/dist/mongoose.module";
import { User, UserSchema } from "./schemas/user.schema";


@Module({
    imports:[
        MongooseModule.forFeature([{name:User.name, schema:UserSchema}])
    ],
    exports:[MongooseModule],
})
export class UsersModule{}