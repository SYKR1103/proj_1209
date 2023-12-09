
import { BaseEntity } from 'src/common/base.entity';
import {Column, BeforeInsert, Entity} from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { InternalServerErrorException } from '@nestjs/common';


@Entity()
export class User extends BaseEntity {

    @Column()
    public nickname : string

    @Column()
    public email : string

    @Column()
    public password : string


    @BeforeInsert()
    async hashPassword() : Promise<void> {
        try{
        const saltValue = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, saltValue)
        } catch(e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }


    async checkPassword(aPassword : string) : Promise<boolean> {
        const isMatched = await bcrypt.compare(aPassword, this.password)
        if (!isMatched) throw new InternalServerErrorException()
        return isMatched
    }


}
