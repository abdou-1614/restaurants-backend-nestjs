import { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger/dist";

export const ApiFile = (options?: ApiPropertyOptions): PropertyDecorator => (
    target: Object,
    propertyKey?: string | symbol
) => {
    ApiProperty({
        type: 'file',
        properties: {
            [propertyKey]: {
                type: 'string',
                format: 'binary'
            }
        }
    })(target, propertyKey)
}