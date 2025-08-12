import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../users/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }
  
  async validate(payload: any) {
    // Get the user from database to check if still active
    const user = await this.userService.findById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    if (!user.active) {
      throw new UnauthorizedException('Account is deactivated');
    }
    
    // attach to req.user
    return { 
      userId: payload.sub, 
      username: payload.username, 
      role: payload.role,
      active: user.active
    };
  }
}