import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from '../../core/guards';
import { PermissionsService } from '../permissions';

@Module({
  imports: [UserModule, JwtModule.register({ secret: process.env.JWT_SECRET || 'secret' })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, PermissionsService],
  exports: [AuthService],
})
export class AuthModule {}