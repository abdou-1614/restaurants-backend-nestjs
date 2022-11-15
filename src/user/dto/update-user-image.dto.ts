import { CreateUserDto } from './create-user.dto';
import { ApiProperty, PickType } from "@nestjs/swagger";

export class UpdateUserImage extends PickType(CreateUserDto, ['avatar'] as const) {
}