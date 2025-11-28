import { IsUUID, IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';

export class MarkAttendanceDto {
    @IsUUID()
    sessionId: string;

    @IsUUID()
    studentId: string;

    @IsEnum(['PRESENT', 'ABSENT', 'LATE'])
    status: string;

    @IsOptional()
    @IsString()
    remarks?: string;
}
