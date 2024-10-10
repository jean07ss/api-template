import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '@/configs/config.module';
import { GlobalExceptionFilter } from '@/common/utils/filters/global-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { CommonModule } from '@/common/common.module';
import { FeaturesModule } from '@/features/features.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    FeaturesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}

/**
 * TODO:
 * - Configurar modulo Redis
 * - Configurar guards
 * - Configurar passport
 * - Instalar e configurar o swagger
 */
