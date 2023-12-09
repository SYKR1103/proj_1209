import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepo : Repository<User>
  ) {}

    async createU(c:CreateUserDto) {
      const newuser = await this.userRepo.create(c)
      await this.userRepo.save(newuser)
      return newuser
    }

    async findUByEmail(email:string) {
      const user =  await this.userRepo.findOneBy({email})
      if (!user) throw new HttpException('not found', HttpStatus.NOT_FOUND)
      return user
    }

    async findUById(id :string) {
      const user =  await this.userRepo.findOneBy({id})
      if (!user) throw new HttpException('not found', HttpStatus.NOT_FOUND)
      return user
    }


}
