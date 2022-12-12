import { PickType } from "@nestjs/swagger";
import { CreateRestaurantDto } from "./create-restaurant.dto";

export class UpdateImagesDto extends PickType(CreateRestaurantDto, ['images'] as const) {}