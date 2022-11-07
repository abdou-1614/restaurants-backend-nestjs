import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserInfo extends PartialType(CreateUserDto) {}