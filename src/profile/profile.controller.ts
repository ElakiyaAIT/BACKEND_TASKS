import { Controller, Get, UseGuards, Request, InternalServerErrorException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport/dist/auth.guard";
import { ProfileService } from "./profile.service";
import { ERROR_MESSAGES } from "src/common/constants/error-messages";

@Controller('profile')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService)
    {}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getProfile(@Request() req){
        try{
            return await this.profileService.getProfile(req.user.userId);
        }
        catch(error){
            throw new InternalServerErrorException(ERROR_MESSAGES.PROFILE_FETCH_FAILED);
        }
    }
}