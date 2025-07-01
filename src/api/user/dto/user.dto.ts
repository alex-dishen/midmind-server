import { IsUUID, IsEmail, IsString, IsBoolean, MaxLength, MinLength, IsOptional, IsStrongPassword } from 'class-validator';
import { Match } from 'src/shared/decorators/match.decorator';

export class UserDto {
  @IsUUID()
  id: string;
  first_name: string;
  last_name: string;

  @IsEmail()
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date | null;
  is_deleted: boolean;
  deleted_at: Date | null;
  deleted_by: string | null;
}

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsStrongPassword()
  password: string;

  @IsStrongPassword()
  @Match<CreateUserDto>('password', { message: 'Passwords do not match' })
  confirmation_password: string;

  @IsEmail()
  email: string;
}

export class UpdateUserDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  first_name?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  last_name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @MinLength(6)
  @MaxLength(20)
  @IsString()
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  is_deleted?: boolean;
}
