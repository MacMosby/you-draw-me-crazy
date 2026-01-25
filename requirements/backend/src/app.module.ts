/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.module.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lieselotdetaeye <lieselotdetaeye@studen    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/14 16:17:58 by lde-taey          #+#    #+#             */
/*   Updated: 2026/02/09 11:27:28 by lieselotdet      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'

@Module
({
  imports: [AuthModule],
    //ConfigModule,//would need to be installe seperately
    //DatabaseModule,
    //AuthModule,
    UsersModule,
    //GameModule,
  controllers: [AuthController]

})
export class AppModule {}
