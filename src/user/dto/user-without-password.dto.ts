import { PickType } from "@nestjs/swagger";
import { UserInteface } from "../interfaces/user.interface";

export class UserWithoutPassword extends PickType(UserInteface, ['fullName', 'email', 'address', 'avatar', 'address',] as const) {}