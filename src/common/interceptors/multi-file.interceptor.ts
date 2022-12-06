import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MultiFilesBodyInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()

        if(request.body && Array.isArray(request.file) && request.file) {
            request.file.forEach((file: Express.Multer.File) => {
                const { fieldname } = file
                if(!request.body[fieldname]) {
                    request.body[fieldname] = [file]
                }else {
                    request.body[fieldname].push(file)
                }
            });
        }

        return next.handle()
    }
}