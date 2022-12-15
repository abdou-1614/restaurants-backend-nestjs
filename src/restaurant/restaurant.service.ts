import { ForbiddenException, NotFoundException } from '@nestjs/common/exceptions';
import { UserDocument } from './../user/schema/user.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant } from './schema/restaurant.schema';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FindRestaurantQueryDto } from './dto/find-restaurant.dto';
import { UpdateRestaurantDetailsDto } from './dto/update-restaurant.dto';
import { UpdateImagesDto } from './dto/update-restaurant-images.dto';

@Injectable()
export class RestaurantService {
    constructor( 
        @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
        private readonly cloudinary: CloudinaryService
    ) {}

    async createRestaurant(CreateRestaurantInput: CreateRestaurantDto, user: any) {
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
            user: user,
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

    async updateDetails(id: string, updateDto: UpdateRestaurantDetailsDto) {
        const restaurantFound = await this.restaurantModel.findById({ _id: id })

        if(!restaurantFound) throw new NotFoundException('Restaurant Not Found')

        return await this.restaurantModel.findByIdAndUpdate(id, updateDto, {
            new: true,
            runValidators: true
        })
    }

    async updateRestaurantImage(id: string, imageDto: UpdateImagesDto) {
        const { images } = imageDto

        images.filter((image) => image.fieldname === 'image')

        const restaurant = await this.restaurantModel.findById({ _id: id })
        if(!restaurant) throw new NotFoundException('Restaurant Not Found')

        const imagesLink = []
        const imagesIDs = []
        const restaurantImageId = restaurant.imagesId

        restaurantImageId.forEach((image) => this.cloudinary.destroyFile(image))

        const imagesPromise = images.map(async (image) => await this.cloudinary.uploadFile(image))

        const imagesResult = await Promise.all(imagesPromise)

        imagesResult.forEach((image) => {
            imagesLink.push(image.secure_url)
            imagesIDs.push(image.public_id)
        })

        const restaurantBody = {
            images: imagesLink,
            imagesId: imagesIDs
        }

        return await this.restaurantModel.findByIdAndUpdate(id, restaurantBody, {
            new: true,
            runValidators: true
        })
    }

    async delete(id: string): Promise<string> {
        const restaurant = await this.restaurantModel.findById({ _id: id })
        if(!restaurant){
            throw new NotFoundException('Restaurant Not Found')
        }

        const restaurantImageId = restaurant.imagesId

        restaurantImageId.forEach((image) => this.cloudinary.destroyFile(image))

        await this.restaurantModel.findByIdAndDelete(id) 

        return 'Restaurant Deleted Successful'
    }

    async findTopRatingRestaurant() {
        return this.restaurantModel.find().sort({ ratingAverage: -1 }).limit(5)
    }
}
