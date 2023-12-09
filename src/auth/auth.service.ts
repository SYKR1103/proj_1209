import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import {Inject} from '@nestjs/common'
import {CACHE_MANAGER} from '@nestjs/cache-manager'
import {Cache} from 'cache-manager'
import { EmailCheckDto } from './dto/email-check.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService : UserService,
    private readonly jwtService : JwtService,
    private readonly configService : ConfigService,
    private readonly emailService : EmailService,
    @Inject(CACHE_MANAGER) private cacheManager : Cache
  ) {}

  async CreateUser(c:CreateUserDto) {
    return await this.userService.createU(c)
  }

  async Loginuser(l:LoginUserDto) {
    const user = await this.userService.findUByEmail(l.email)
    const ispwMatched = await user.checkPassword(l.password)
    if (!ispwMatched) throw new InternalServerErrorException()
    return user
  }

  public generateAccessToken(userId : string) {

    const payload : TokenPayload = {userId}
    const token = this.jwtService.sign(payload, {

      secret : this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn : this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),

    })
    return token
  }

  async emailverification(email:string) {
    const verificationcode = this.generateOTP()
    await this.cacheManager.set(email, verificationcode)
    console.log(email, verificationcode)
    await this.emailService.sendMail({
      to : email,
      subject : 'verification code',
      text : `verification code is ${verificationcode}`
    })
    return 'success'
  }

  async emailcheck(emailcheckdto : EmailCheckDto) {
    const oricode = await this.cacheManager.get(emailcheckdto.email)
    if (oricode != emailcheckdto.code) throw new HttpException('not matched', HttpStatus.BAD_REQUEST)
    await this.cacheManager.del(emailcheckdto.email)
    return true
  }

  generateOTP() {
    let OTP = ''
    for (let i=1; i<=6; i++) {
      OTP += Math.floor(Math.random()*10)
    }
    return OTP
  }


}
