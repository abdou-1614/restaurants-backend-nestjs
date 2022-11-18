import { AuthLoginDto } from './auth-login.dto';
import { PartialType } from "@nestjs/swagger";

export class PasswordResetDto extends PartialType(AuthLoginDto) {}