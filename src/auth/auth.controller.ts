import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from './interfaces/requestWithUser';
import { EmailCheckDto } from './dto/email-check.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() c: CreateUserDto) {
    return this.authService.CreateUser(c);
  }

  // @Post('/login')
  // async loginUser(@Body() l:LoginUserDto) {
  //   //return this.authService.Loginuser(l)
  //   const user = await this.authService.Loginuser(l)
  //   const token = await this.authService.generateAccessToken(user.id)
  //   return token
  // }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginUser(@Req() r:RequestWithUser) {
    //return this.authService.Loginuser(l)
    const {user} = r
    const token = await this.authService.generateAccessToken(user.id)
    return token
  }

  @Post('/email/send')
  async verificationemail(@Body("email") email:string) {
    return this.authService.emailverification(email)
  }

  @Post('/email/check')
  async emailverificationcheck(@Body() emailcheckdto : EmailCheckDto) {
    return this.authService.emailcheck(emailcheckdto)
  }


}
