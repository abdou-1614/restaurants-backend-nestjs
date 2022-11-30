import { Role } from './../../user/schema/user.schema';
import { IS_ADMIN } from './../decorators/is-admin.decorator';
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

export class RoleGuards implements CanActivate {
    constructor(private reflector: Reflector) {}


    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN, [
            context.getHandler(),
            context.getClass()
        ])

        const request = context.switchToHttp().getRequest()

        const { userRole } = request.user


        if(isAdmin || userRole === Role.ADMIN) {
            return true
        }

        return false
    }
}