import { Controller, Post, Body, BadRequestException, Get, UseGuards, Req, Put, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard, RolesGuard } from '../../core/guards';
import { Roles } from '../../core/decorators';
import { PermissionsService } from '../permissions';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private permService: PermissionsService) {}

  @Post('onboard')
  async onboardUser(@Body() dto: SignupDto) {
    const exists = await this.authService.findByUsername(dto.username);
    if (exists) throw new BadRequestException('Username already exists');
    const user = await this.authService.signup(dto);
    
    // Generate JWT token for the new user
    const access_token = this.authService.generateToken(user);
    
    return { 
      access_token,
      user: { id: user.id, username: user.username, role: user.role, active: user.active }
    };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('permission-matrix')
  permissionMatrix() {
    return this.permService.getPermissionMatrix();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req:any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('users')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getAllUsers() {
    try {
      const users = await this.authService.getAllUsers();
      return { 
        status: 'success', 
        data: users 
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err?.message || err);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('users/:id')
  @ApiOperation({ summary: 'Update user role and status (Admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserRoleDto) {
    try {
      const user = await this.authService.updateUser(id, updateUserDto);
      return { 
        status: 'success', 
        data: { 
          id: user.id, 
          username: user.username, 
          role: user.role,
          active: user.active
        } 
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err?.message || err);
    }
  }
}