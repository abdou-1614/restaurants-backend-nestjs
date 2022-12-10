import { NotFoundException } from '@nestjs/common/exceptions';
import { UserDocument } from './../user/schema/user.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant } from './schema/restaurant.schema';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FindRestaurantQueryDto } from './dto/find-restaurant.dto';

@Injectable()
export class RestaurantService {
    constructor( 
        @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
        private readonly cloudinary: CloudinaryService
    ) {}

    async createRestaurant(CreateRestaurantInput: CreateRestaurantDto, user: UserDocument) {
        const { name, address, category, description, email, images, phoneNo } = CreateRestaurantInput

        images.filter((img) => img.fieldname === 'images')

        // 1) Upload images to cloudinary
        const imagesPromise = images.map((image) =>  this.cloudinary.uploadFile(image))


        const imagesResult = await Promise.all(imagesPromise)

        const imagesLink = []
        const imagesIds = []

        // 3) Push images links & images IDs to the arrays
        
        imagesResult.forEach((image) => {
            imagesLink.push(image.secure_url)
            imagesIds.push(image.public_id)
        })


        return await this.restaurantModel.create({
            name,
            email,
            address,
            images: imagesLink,
            imagesId: imagesIds,
            user: user._id,
            phoneNo,
            category,
            description
        })
    }

    async findAll(query: FindRestaurantQueryDto): Promise<Restaurant[]> {

        //1) Pagination Logic

        const page = query.page || 1

        const limit = query.limit || 10

        const skip = limit * (page - 1)

        // 2) Search Logic
        const search = query.search ? {
            $or: [
                { name: { 
                    $regex: query.search,
                    $options: 'i'
                 }, 
                },
                { desciption: {
                    $regex: query.search,
                    $options: 'i'
                 }
                }
            ]
        } : {}
        return this.restaurantModel.find(search).limit(limit).skip(skip)
    }

    async findById(id: string): Promise<Restaurant> {
        const isValidId = mongoose.isValidObjectId(id)
        if(!isValidId) {
            throw new BadRequestException('Wrong mongoose ID Error. Please, enter the correct ID')
        }

        const restaurant = await this.restaurantModel.findById({ _id: id })

        if(!restaurant) throw new NotFoundException('Restaurant Not Found')

        return restaurant
    }
}
