import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import {JwtService} from '@nestjs/jwt'
import {PassportStrategy} from'@nestjs/passport'
import { TokenPayload } from "../interfaces/tokenPayload.interface";
import { User } from "src/user/entities/user.entity";
import {Injectable} from '@nestjs/common'



@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService : ConfigService,
        private readonly userService : UserService,
        private readonly jwtService : JwtService
    ) {

        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : configService.get('JWT_ACCESS_TOKEN_SECRET')
        })


    }
    async validate(payload : TokenPayload) : Promise<User> {
        return await this.userService.findUById(payload.userId)
    }
}