/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.module.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lieselotdetaeye <lieselotdetaeye@studen    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/14 16:17:58 by lde-taey          #+#    #+#             */
/*   Updated: 2026/02/09 11:40:14 by lieselotdet      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { DatabaseModule } from './database/database.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module
({
  imports: [AuthModule,
	UsersModule,
	DatabaseModule,
	WebsocketModule],
    //ConfigModule,//would need to be installe seperately
    //DatabaseModule,
    //AuthModule,
   //  UsersModule,
    //GameModule,
  controllers: [AuthController]

})
export class AppModule {}
