/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: nboer <nboer@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/12 17:15:31 by lde-taey          #+#    #+#             */
/*   Updated: 2026/01/24 19:01:57 by nboer            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; //NB : To allow dto validation
import * as fs from 'fs';
//import * as https from 'https';

async function bootstrap() 
{
  const httpsOptions = {
	key: fs.readFileSync('/app/certs/backend.key'),
	cert: fs.readFileSync('/app/certs/backend.crt'),
  };
  const app = await NestFactory.create(AppModule, {httpsOptions,});
  app.useGlobalPipes(new ValidationPipe()); // NB: dto validation only works if enabled.
  await app.listen(3000); // 3000 is the port
  console.log('Server is running on https://localhost:3000');
  console.log('Testing changes');
}
bootstrap();
