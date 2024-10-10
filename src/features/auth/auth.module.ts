import { Module } from '@nestjs/common';
import { LocalStrategy } from '@/features/auth/strategies/local.strategy';
import { JwtStrategy } from '@/features/auth/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  providers: [JwtStrategy, LocalStrategy],
  exports: [],
})
export class AuthModule {}
