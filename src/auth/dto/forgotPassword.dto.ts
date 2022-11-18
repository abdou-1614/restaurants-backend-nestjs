import { AuthLoginDto } from './auth-login.dto';
import { PickType } from "@nestjs/swagger";

export class ForgotPasswordDto extends PickType(AuthLoginDto, ['email'] as const) {}