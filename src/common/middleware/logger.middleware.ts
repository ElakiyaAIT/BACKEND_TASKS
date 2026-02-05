import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('--- Incoming Request ---');
    console.log('Method:', req.method);
    console.log('URL:', req.originalUrl);
    console.log('Time:', new Date().toISOString());
    console.log('------------------------');

    next();
  }
  //  FOR MORE DETAILED LOGGING WITH RESPONSE TIME
//   use(req: Request, res: Response, next: NextFunction) {
//   const start = Date.now();

//   res.on('finish', () => {
//     const duration = Date.now() - start;
//     console.log(
//       `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`,
//     );
//   });

//   next();
// }

}
