import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class BigIntTransformPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
