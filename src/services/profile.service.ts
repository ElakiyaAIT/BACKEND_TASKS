import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose/dist/common/mongoose.decorators";
import { Model } from "mongoose";
import { ERROR_MESSAGES } from "src/common/constants/error-messages";
import { User } from "src/schemas/user.schema";


@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel:Model<User>,
    ){}

    async getProfile(userId:string){
        try{
            return await this.userModel.findById(userId).select('-password');
        } catch(error){
            throw new InternalServerErrorException(ERROR_MESSAGES.PROFILE_FETCH_FAILED);
        }
        
    }
}