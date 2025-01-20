import { IsEmail, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  login_count?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  pdf_download_count?: number;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  login_count?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  pdf_download_count?: number;
}
