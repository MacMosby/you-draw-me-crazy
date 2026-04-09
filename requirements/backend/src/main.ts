/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: nandreev <nandreev@student.42berlin.de>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/12 17:15:31 by lde-taey          #+#    #+#             */
/*   Updated: 2026/04/08 23:33:34 by nandreev         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common'; //NB : To allow dto validation
import * as fs from 'fs';
//import * as https from 'https';

@Catch()
class AuthSoftFailFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (!(exception instanceof HttpException)) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
      return;
    }

    const status = exception.getStatus();
    const payload = exception.getResponse() as { message?: string | string[] } | string;
    const rawMessage = typeof payload === 'string' ? payload : payload?.message;
    const message = Array.isArray(rawMessage)
      ? rawMessage.join(', ')
      : rawMessage ?? `Request failed (${status})`;

    const url: string = request?.url ?? '';
    const isAuthPath = url.startsWith('/auth/login') || url.startsWith('/auth/signup');

    //console.log(`[AuthSoftFailFilter] caught exception on ${url} status=${status} isAuthPath=${isAuthPath}`);

    if (isAuthPath && [HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.CONFLICT].includes(status)) {
      //console.log(`[AuthSoftFailFilter] converting to 200 ok:false for auth path`);
      response.status(HttpStatus.OK).json({
        ok: false,
        message,
      });
      return;
    }

    response.status(status).json(payload);
  }
}

async function bootstrap() 
{
  const httpsOptions = {
	key: fs.readFileSync('/app/certs/backend.key'),
	cert: fs.readFileSync('/app/certs/backend.crt'),
  };
  const app = await NestFactory.create(AppModule, {httpsOptions,});
  app.useGlobalPipes(new ValidationPipe()); // NB: dto validation only works if enabled.
  app.useGlobalFilters(new AuthSoftFailFilter());
  await app.listen(3000); // 3000 is the port
  console.log('Server is running on https://localhost:3000');
  console.log('Testing changes');
}
bootstrap();
