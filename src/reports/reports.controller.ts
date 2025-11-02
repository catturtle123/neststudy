import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/gurads/auth.guard';

@Controller('reports')
export class ReportsController {
    constructor(private reportService: ReportsService) {}
    
    @UseGuards(AuthGuard)
    @Post()
    createReport(@Body() body: CreateReportDto) {
        return this.reportService.create(body);
    }


}
