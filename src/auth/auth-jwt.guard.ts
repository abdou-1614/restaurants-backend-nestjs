import { IS_PUBLIC_KEY } from './public.decorator';
import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport/dist";
import { Observable } from "rxjs";

@Injectable()
export class AccessJwtGuard extends AuthGuard('access-jwt') {

    /**
     * Uses AuthGuard To Check If
     * The Routes Needs To Authentication 
     */
    constructor(private reflector: Reflector) {
        super()
    }


    /**
     * if the route uses Public decorator
     * that mean it not need to authentication, else does
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY ,[
            context.getClass(),
            context.getHandler()
        ])

        if(isPublic) {
            return true
        }

        return super.canActivate(context)
    }
}