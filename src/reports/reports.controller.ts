import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/gurads/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ReportDto } from './dto/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApprovedReportDto } from './dto/approve-report.dto';

@Controller('reports')
export class ReportsController {
    constructor(private reportService: ReportsService) {}
    
    @UseGuards(AuthGuard)
    @Post()
    @Serialize(ReportDto)
    createReport(@CurrentUser() user: User,  @Body() body: CreateReportDto) {
        return this.reportService.create(user, body);
    }

    @Patch('/:id')
    @Serialize(ReportDto)
    approveReport(@Param('id') id: string, @Body() body: ApprovedReportDto) {
        return this.reportService.changeApprove(id, body.approved);
    }

}
