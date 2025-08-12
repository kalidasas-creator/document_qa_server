import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserRoleDto } from '../auth/dto/update-user-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUser(username: string, password: string, role: 'admin' | 'editor' | 'viewer') {
    const user = this.userRepo.create({ username, password, role });
    return this.userRepo.save(user);
  }

  async findByUsername(username: string) {
    return this.userRepo.findOne({ where: { username } });
  }

  async findById(id: string) {
    return this.userRepo.findOne({ where: { id } });
  }

  async getAllUsers(): Promise<Partial<User>[]> {
    const users = await this.userRepo.find({
      select: ['id', 'username', 'role', 'active', 'createdAt']
    });
    return users;
  }

  // Method 1: Using save() - Good for when you need the updated entity
  async updateUser(id: string, updateUserDto: UpdateUserRoleDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // One-time patch: Convert string active to boolean
    if (typeof updateUserDto.active === 'string') {
      updateUserDto.active = updateUserDto.active === 'true' || updateUserDto.active === '1';
    }

    // Update user with provided fields
    if (updateUserDto.role !== undefined) {
      user.role = updateUserDto.role;
    }
    if (updateUserDto.active !== undefined) {
      user.active = updateUserDto.active;
    }

    const updatedUser = await this.userRepo.save(user);
    console.log('Updated user (save method):', updatedUser);

    // Return user without password
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

}