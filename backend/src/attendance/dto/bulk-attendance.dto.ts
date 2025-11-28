import { IsUUID, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AttendanceRecord {
    @IsUUID()
    studentId: string;

    @IsEnum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'])
    status: string;
}

export class BulkAttendanceDto {
    @IsUUID()
    sessionId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AttendanceRecord)
    records: AttendanceRecord[];
}
