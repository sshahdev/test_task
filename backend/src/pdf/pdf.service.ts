import { Injectable } from '@nestjs/common';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { UsersService } from '../users/users.service';

@Injectable()
export class PdfService {
  constructor(private usersService: UsersService) {}

  async generateUserPdf(userId: number): Promise<Uint8Array> {
    const user = await this.usersService.findOne(userId);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // User Information
    page.drawText('User Report', { x: 50, y: 750, font: boldFont, size: 24 });
    page.drawText(`Name: ${user.name}`, { x: 50, y: 700, font, size: 12 });
    page.drawText(`Email: ${user.email}`, { x: 50, y: 680, font, size: 12 });
    page.drawText(`Role: ${user.role}`, { x: 50, y: 660, font, size: 12 });

    // Activity Summary Title
    page.drawText('Activity Summary', { x: 50, y: 620, font: boldFont, size: 16 });

    // Chart Configuration
    const chartStartX = 60;
    const chartStartY = 480;
    const barWidth = 30;
    const maxBarHeight = 100;
    const spacing = 40;

    // Calculate dynamic scale based on maximum value
    const maxValue = Math.max(user.login_count, user.pdf_download_count);
    const scale = maxValue === 0 ? 1 : maxBarHeight / maxValue;
    const yAxisSteps = 5; // Number of steps on Y-axis

    // Draw Y-axis
    page.drawLine({
      start: { x: chartStartX, y: chartStartY },
      end: { x: chartStartX, y: chartStartY + maxBarHeight + 20 },
      color: rgb(0, 0, 0),
    });

    // Draw X-axis
    page.drawLine({
      start: { x: chartStartX, y: chartStartY },
      end: { x: chartStartX + 150, y: chartStartY },
      color: rgb(0, 0, 0),
    });

    // Draw Login Count Bar
    const loginHeight = user.login_count * scale;
    page.drawRectangle({
      x: chartStartX + spacing,
      y: chartStartY + 0.8,
      width: barWidth,
      height: loginHeight,
      color: rgb(0.2, 0.4, 1),
    });

    // Draw Download Count Bar
    const downloadHeight = user.pdf_download_count * scale;
    page.drawRectangle({
      x: chartStartX + spacing * 2 + 10,
      y: chartStartY + 0.8,
      width: barWidth,
      height: downloadHeight,
      color: rgb(0.4, 0.8, 0.2),
    });

    // Draw Labels
    page.drawText('Logins', { 
      x: chartStartX + spacing + 1, 
      y: chartStartY - 20, 
      font, 
      size: 10 
    });
    page.drawText('Downloads', { 
      x: chartStartX + spacing * 2 + 2, 
      y: chartStartY - 20, 
      font, 
      size: 10 
    });

    // Draw Values on top of bars
    page.drawText(`${user.login_count}`, {
      x: chartStartX + spacing + 12,
      y: chartStartY + loginHeight + 5,
      font,
      size: 10
    });
    page.drawText(`${user.pdf_download_count}`, {
      x: chartStartX + spacing * 2 + 20,
      y: chartStartY + downloadHeight + 5,
      font,
      size: 10
    });

    // Draw Y-axis labels dynamically
    for (let i = 0; i <= yAxisSteps; i++) {
      const value = Math.round((maxValue * i) / yAxisSteps);
      const yPos = chartStartY + (maxBarHeight * i) / yAxisSteps;
      
      // Draw tick mark
      page.drawLine({
        start: { x: chartStartX - 5, y: yPos },
        end: { x: chartStartX, y: yPos },
        color: rgb(0, 0, 0),
      });

      // Draw label
      page.drawText(`${value}`, {
        x: chartStartX - 20,
        y: yPos - 4,
        font,
        size: 8
      });
    }

    // Activity Details
    page.drawText('Activity Details:', { x: 50, y: 380, font: boldFont, size: 14 });
    page.drawText(`Total Logins: ${user.login_count}`, { x: 50, y: 360, font, size: 12 });
    page.drawText(`Total Downloads: ${user.pdf_download_count}`, { x: 50, y: 340, font, size: 12 });
    
    if (user.last_activity_at) {
      page.drawText(`Last Activity: ${user.last_activity_at.toLocaleDateString()}`, 
        { x: 50, y: 320, font, size: 12 });
    }

    return pdfDoc.save();
  }
} 