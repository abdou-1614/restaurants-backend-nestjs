import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";

export const ApiMultiFile = (options?: ApiPropertyOptions): PropertyDecorator => (
    target: object,
    propertyKey?: string | symbol
) => {
    if(options?.isArray) {
        ApiProperty({
            type: 'array',
            items: {
                type: 'file',
                properties: {
                    [propertyKey]: {
                        type: 'string',
                        format: 'binary'
                    }
                }
            }
        })(target, propertyKey)
    }
}