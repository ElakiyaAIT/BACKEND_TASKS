import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
 async register(@Body() dto: RegisterDto) {
  try{
    return this.authService.register(dto);
  }
  catch(error){
    throw error;      
  }
}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try{
      return this.authService.login(dto);
    }
    catch(error){
      throw error;
    } 
  }
}
