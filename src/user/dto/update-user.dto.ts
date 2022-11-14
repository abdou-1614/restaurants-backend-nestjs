import { OmitType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserInfo extends OmitType(CreateUserDto, ['password', 'avatar']as const) {}