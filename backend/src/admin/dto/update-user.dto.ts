import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsEnum(['ADMIN', 'TEACHER', 'STUDENT'])
    role?: string;

    @IsOptional()
    @IsEnum(['pending', 'approved', 'rejected', 'inactive'])
    status?: string;
}
