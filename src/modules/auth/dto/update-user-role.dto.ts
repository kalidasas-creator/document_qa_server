import { IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ description: 'Role for the user', enum: ['admin', 'editor', 'viewer'], required: false })
  @IsEnum(['admin', 'editor', 'viewer'])
  @IsOptional()
  role?: 'admin' | 'editor' | 'viewer';

  @ApiProperty({ description: 'Active status of the user', required: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
