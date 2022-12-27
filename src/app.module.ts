import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessJwtGuard } from './auth/auth-jwt.guard';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MealModule } from './meal/meal.module';
import { ReviewModule } from './review/review.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    RestaurantModule,
    MealModule,
    ReviewModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessJwtGuard
    }
  ],
})
export class AppModule {}
