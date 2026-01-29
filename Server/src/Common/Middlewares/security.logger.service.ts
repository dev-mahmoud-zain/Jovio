import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SecurityLoggerService {
    private readonly logger = new Logger('SECURITY');

    warn(message: string, meta?: Record<string, any>) {
        this.logger.warn({
            message,
            ...meta,
            timestamp: new Date().toISOString(),
        });
    }

    error(message: string, meta?: Record<string, any>) {
        this.logger.error({
            message,
            ...meta,
            timestamp: new Date().toISOString(),
        });
    }
}
