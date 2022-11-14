import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from 'src/user/schema/user.schema'
export const CurrentUser = createParamDecorator(
    (data, context: ExecutionContext): User => {
        const request = context.switchToHttp().getRequest()
        return request.user
    }
)