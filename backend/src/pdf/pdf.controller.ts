import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { UsersService } from '../users/users.service';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly usersService: UsersService,
  ) {}

  @Get('user/:userId')
  async generatePdf(@Param('userId') userId: string, @Res() res: Response) {
    const pdfBytes = await this.pdfService.generateUserPdf(+userId);
    
    // Increment the download count
    await this.usersService.incrementPdfDownloadCount(+userId);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="user-${userId}-report.pdf"`,
    });
    
    res.send(Buffer.from(pdfBytes));
  }
}