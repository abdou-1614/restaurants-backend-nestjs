import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { rateLimit } from "utils-decorators"

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {

    @rateLimit({
        allowedCalls: 1,
        timeSpanMs: 1000 * 60 * 60,  // one minute 
        keyResolver: ( ctx: ExecutionContext ) => ctx.switchToHttp().getRequest().ip,
        exceedHandler: () => {throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS)}
    })

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle()
    }
}