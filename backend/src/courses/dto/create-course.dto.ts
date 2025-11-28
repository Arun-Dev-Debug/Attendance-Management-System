import { IsString, IsOptional, IsBoolean, IsDateString, IsUUID } from 'class-validator';

export class CreateCourseDto {
    @IsString()
    name: string;

    @IsString()
    code: string;

    @IsString()
    subject: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsUUID()
    teacherId?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsBoolean()
    isOnline?: boolean;
}
