import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '../../core/guards';
import { Roles } from '../../core/decorators';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getAllUsers() {
    try {
      const users = await this.adminService.getAllUsers();
      return { 
        status: 'success', 
        data: users 
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err?.message || err);
    }
  }

  @Post('users')
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.adminService.createUser(createUserDto);
      return { 
        status: 'success', 
        data: { 
          id: user.id, 
          username: user.username, 
          role: user.role 
        } 
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err?.message || err);
    }
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.adminService.updateUser(id, updateUserDto);
      return { 
        status: 'success', 
        data: { 
          id: user.id, 
          username: user.username, 
          role: user.role 
        } 
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err?.message || err);
    }
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: string) {
    try {
      await this.adminService.deleteUser(id);
      return { 
        status: 'success', 
        message: 'User deleted successfully' 
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err?.message || err);
    }
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.adminService.getUserById(id);
      return { 
        status: 'success', 
        data: { 
          id: user.id, 
          username: user.username, 
          role: user.role 
        } 
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err?.message || err);
    }
  }
}
