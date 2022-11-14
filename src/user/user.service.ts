import { ui_projection_field } from './user.projection';
import { FilterQueryDto } from './dto/find-users.dto';
import { CloudinaryService } from './../cloudinary/cloudinary.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { privateField, UserDocument } from './schema/user.schema';
import { MailService } from 'src/mail/mail.service';
import { addHours } from 'date-fns';
import { omit } from 'lodash';
import { VerifyEmailDto } from './dto/verifiy-email.dto';
import crypto, { randomUUID } from 'crypto'
import { NotFoundException } from '@nestjs/common/exceptions';
import { UserWithoutPassword } from './dto/user-without-password.dto';

@Injectable()
export class UserService {

    HOURS_TO_VERIFY = 2
    HOURS_TO_BLOCK = 6
    LOGIN_ATTEMPTS_TO_BLOCK = 5

    constructor(
        @InjectModel('User') private readonly UserModel: Model<UserDocument>,
        private readonly mailService: MailService,
        private readonly cloudinary: CloudinaryService
        ) {}

    async createUser(input: CreateUserDto) {
        const { fullName, email, password, address, avatar } = input
        await this.isEmailTaken(email)

        const image = await this.cloudinary.uploadFile(avatar)

        const verification = randomUUID()

        const verificationExpires = addHours(new Date(), this.HOURS_TO_VERIFY)
        const user = await this.UserModel.create({
            fullName,
            email,
            password,
            verification,
            address,
            verificationExpires,
            avatar: image.secure_url,
            avatarId: image.public_id
        })

        await this.mailService.sendUserConfirmationEmail(user, verification)
        return omit(user.toJSON(), privateField)

    }

    async verifyUser({verification}: VerifyEmailDto, id: string) {
        const user = await this.UserModel.findOne({verification})
        if(user.verification === null && user.verified === true) {
            throw new BadRequestException('User Already Verified! Please Try To Login')
        }

        if(user.verificationExpires < new Date()) {
            await this.UserModel.deleteMany({_id: id, })
            throw new BadRequestException('Verification Link Has Been Expired! Please Request Again')
        }

        if(!user.verification) {
            throw new BadRequestException('Invalid Verification Token! Please Check Inbox')
        }

        user.verified = true
        user.verification = null,
        user.verificationExpires = null
        await user.save()
        return omit(user.toJSON(), privateField)
    }

    async findUserById(id: string) {
        const user = await this.UserModel.findById(id)
        if(!user) {
            throw new NotFoundException('No User Found With ID')
        }

        return omit(user.toJSON(), privateField)
    }

    async findAll(query: FilterQueryDto): Promise<UserWithoutPassword[]> {

        // Search Logic
        const search = query.search ? { $or: [ 
            { fullName: new RegExp(query.search.toString(), 'i')}, 
            { email: new RegExp(query.search.toString(), 'i')} 
        ] } : {}

       return await this.UserModel.find(search).select(ui_projection_field)
    }

    private async isEmailTaken(email: string) {
        const user = await this.UserModel.findOne({email, verified: true})
        if(user) throw new BadRequestException('Email Already Taken')
    }
}
