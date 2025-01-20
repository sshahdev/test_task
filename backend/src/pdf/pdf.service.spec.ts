import { Test, TestingModule } from '@nestjs/testing';
import { PdfService } from './pdf.service';
import { UsersService } from '../users/users.service';
import { PDFDocument } from 'pdf-lib';

describe('PdfService', () => {
  let service: PdfService;
  let usersService: UsersService;

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    login_count: 5,
    pdf_download_count: 3,
    last_activity_at: new Date('2024-01-01'),
  };

  const mockUsersService = {
    findOne: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PdfService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<PdfService>(PdfService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateUserPdf', () => {
    it('should generate a PDF for a user', async () => {
      const userId = 1;
      const result = await service.generateUserPdf(userId);

      // Verify the PDF was created
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBeGreaterThan(0);

      // Verify user data was fetched
      expect(usersService.findOne).toHaveBeenCalledWith(userId);

      // Load the generated PDF to verify its contents
      const pdfDoc = await PDFDocument.load(result);
      expect(pdfDoc.getPageCount()).toBe(1);
    });

    it('should throw an error if user is not found', async () => {
      mockUsersService.findOne.mockRejectedValueOnce(new Error('User not found'));
      
      await expect(service.generateUserPdf(999)).rejects.toThrow('User not found');
    });
  });
}); 