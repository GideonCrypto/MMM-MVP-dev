import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class BigIntTransformPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const bigIntFields = [
            'marketCap',
            'fullyDilutedValuation',
            'totalVolume',
            'marketCapChange24h',
        ];

        for (const field of bigIntFields) {
            if (value[field] !== undefined && typeof value[field] === 'number') {
            value[field] = BigInt(value[field]);
            }
        }

        return value;
    }
}
