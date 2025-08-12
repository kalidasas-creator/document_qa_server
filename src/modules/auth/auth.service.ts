import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<User> {
    const hashed = await bcrypt.hash(dto.password, 10);
    return this.usersService.createUser(dto.username, hashed, dto.role);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Check if user is active
    if (!user.active) {
      throw new UnauthorizedException('Account is deactivated. Please contact administrator.');
    }
    
    const payload = { username: user.username, sub: user.id, role: user.role };
    return { 
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, username: user.username, role: user.role, active: user.active }
    };
  }

  async findByUsername(username: string) {
    return this.usersService.findByUsername(username);
  }

  generateToken(user: User) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }

  async getAllUsers(): Promise<Partial<User>[]> {
    return this.usersService.getAllUsers();
  }

  async updateUser(id: string, updateUserDto: UpdateUserRoleDto): Promise<User> {
      return this.usersService.updateUser(id, updateUserDto);
  }
}