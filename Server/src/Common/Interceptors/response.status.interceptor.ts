import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseStatusInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const res = context.switchToHttp().getResponse();

        return next.handle().pipe(
            map((body) => {

                if (body?.statusCode && typeof body.statusCode === 'number') {
                    res.status(body.statusCode);
                } else {

                    res.status(HttpStatus.OK);
                }

                return body;
            }),
        );
    }
}