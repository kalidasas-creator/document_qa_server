import { IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'Username for the user', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ description: 'Password for the user', required: false, minLength: 6 })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({ description: 'Role for the user', enum: ['admin', 'editor', 'viewer'], required: false })
  @IsEnum(['admin', 'editor', 'viewer'])
  @IsOptional()
  role?: 'admin' | 'editor' | 'viewer';
}
