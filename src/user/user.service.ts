import { compare } from 'bcrypt';
import { UpdateUserInfo } from './dto/update-user.dto';
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
import { UpdateUserImage } from './dto/update-user-image.dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common/enums';
import { DeleteCurrentUserDto } from './dto/delete-user.dto';

@Injectable()
export class UserService {

    HOURS_TO_VERIFY = 2

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
        const user = await this.UserModel.findById({ _id: id})
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

        // Pagination Logic

        // Defining how much result should be displayed per page
        const limit = query.limit || 10;
        // Getting the page passed in query
        const page = query.page || 1;
        // Formula which defines how many results should be skipped
        const skip = limit * (page - 1)

       return await this.UserModel.find(search).select(ui_projection_field).limit(limit).skip(skip)
    }

    async update(id: string, updateInfo: UpdateUserInfo) {
        const { email } = updateInfo
        await this.isEmailTaken(email)
        const user = await this.UserModel.findByIdAndUpdate(id, updateInfo, {
            new: true,
            runValidators: true
        })

        return omit(user.toJSON(), privateField)
    }

    async updateUserImage(id: string, updateImage: UpdateUserImage, avatarId?: string ) {
        const { avatar } = updateImage

        await this.cloudinary.destroyFile(avatarId)

        const image = await this.cloudinary.uploadFile(avatar)


        const userImage = await this.UserModel.findByIdAndUpdate(id, { 
            avatar: image.secure_url,
            avatarId: image.public_id
         },
         {
            new: true,
            runValidators: true
         }
        )
        return omit(userImage.toJSON(), privateField)
    }

    async deleteUser(id: string) {
        const user = await this.UserModel.findByIdAndDelete(id)

        if(!user) {
            throw new HttpException('User Not Found With This ID', HttpStatus.NOT_FOUND)
        }

        await this.cloudinary.destroyFile(user.avatarId)

        return new HttpException('User Deleted Successful', HttpStatus.OK)
    }

    async delete(id: string, currentUser: DeleteCurrentUserDto) {
        await this.validateUserCurrentPassword(id, currentUser.currentPassword)
        const user = await this.UserModel.findByIdAndDelete(id)

        await this.cloudinary.destroyFile(user.avatarId)

        return new HttpException('User Deleted Successful', HttpStatus.OK)
    }

    private async isEmailTaken(email: string) {
        const user = await this.UserModel.findOne({email, verified: true})
        if(user) throw new BadRequestException('Email Already Taken')
    }

    private async validateUserCurrentPassword(id: string, currentPassword: string) {
        const user = await this.UserModel.findById(id)
        const isValidPassword = await compare(currentPassword, user.password)

        if(!isValidPassword) throw new BadRequestException('Invalid Password! Please Enter Correct Password')
    }
}
