import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import logger from '../config/logger';
import {
  SERVICE_MESSAGES,
  formatMessage,
  createErrorMessage,
} from '../constants/messages';

export class PdfService {
  private static instance: PdfService;
  private static cachedFonts: { [key: string]: Buffer } = {};

  public static getInstance(): PdfService {
    if (!PdfService.instance) {
      PdfService.instance = new PdfService();
    }
    return PdfService.instance;
  }

  /**
   * Font dosyasını yükle ve önbellekte sakla
   */
  private async loadFont(fontName: string): Promise<Buffer> {
    if (!PdfService.cachedFonts[fontName]) {
      // Build zamanında src path'i değişebilir, bu yüzden birkaç alternatif deneyelim
      const possiblePaths = [
        path.join(__dirname, '..', 'assets', 'fonts', `${fontName}.ttf`),
        path.join(
          __dirname,
          '..',
          '..',
          'src',
          'assets',
          'fonts',
          `${fontName}.ttf`
        ),
        path.join(process.cwd(), 'src', 'assets', 'fonts', `${fontName}.ttf`),
      ];

      let fontPath: string | null = null;
      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          fontPath = possiblePath;
          break;
        }
      }

      if (!fontPath) {
        logger.warn(`Font not found: ${fontName}, using default font`);
        return Buffer.alloc(0); // Return empty buffer, PDFKit will use default
      }

      PdfService.cachedFonts[fontName] = fs.readFileSync(fontPath);
    }

    return PdfService.cachedFonts[fontName];
  }

  /**
   * Cover letter PDF oluştur - basit format
   */
  async generateCoverLetterPdf(options: {
    content: string;
    positionTitle: string;
    companyName: string;
    language: 'TURKISH' | 'ENGLISH';
  }): Promise<Buffer> {
    const { content, positionTitle, companyName, language } = options;

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 72, left: 72, right: 72, bottom: 72 },
        });

        const buffers: Buffer[] = [];
        doc.on('data', (buffer) => buffers.push(buffer));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Header
        doc.fontSize(20).font('Helvetica-Bold');
        const headerText = language === 'TURKISH' 
          ? `${companyName} - ${positionTitle} Pozisyonu İçin Ön Yazı`
          : `Cover Letter for ${positionTitle} Position at ${companyName}`;
        doc.text(headerText, { align: 'center' });

        doc.moveDown(2);

        // Content
        doc.fontSize(12).font('Helvetica');
        
        // Split content into paragraphs and process
        const paragraphs = content.split('\n\n');
        paragraphs.forEach((paragraph, index) => {
          if (paragraph.trim()) {
            doc.text(paragraph.trim(), {
              align: 'left',
              lineGap: 4,
            });
            
            if (index < paragraphs.length - 1) {
              doc.moveDown(1);
            }
          }
        });

        // Footer
        doc.moveDown(2);
        doc.fontSize(10).font('Helvetica-Oblique');
        const footerText = language === 'TURKISH'
          ? 'Bu ön yazı ATS sistemleri için optimize edilmiştir.'
          : 'This cover letter is optimized for ATS systems.';
        doc.text(footerText, { align: 'center' });

        doc.end();
      } catch (error) {
        logger.error(
          createErrorMessage(SERVICE_MESSAGES.PDF.GENERATION_ERROR, error as Error)
        );
        reject(error);
      }
    });
  }

  /**
   * Cover letter PDF oluştur - özel format ile
   */
  async generateCoverLetterPdfWithCustomFormat(
    content: string,
    positionTitle: string,
    companyName: string,
    fullName?: string,
    language: 'TURKISH' | 'ENGLISH' = 'TURKISH'
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, left: 60, right: 60, bottom: 50 },
        });

        const buffers: Buffer[] = [];
        doc.on('data', (buffer) => buffers.push(buffer));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Header - Company and Position
        doc.fontSize(16).font('Helvetica-Bold');
        const headerText = `${companyName} - ${positionTitle}`;
        doc.text(headerText, { align: 'center' });

        doc.moveDown(1);

        // Date
        const currentDate = new Date().toLocaleDateString(
          language === 'TURKISH' ? 'tr-TR' : 'en-US'
        );
        doc.fontSize(10).font('Helvetica');
        doc.text(currentDate, { align: 'right' });

        doc.moveDown(1.5);

        // Content with better formatting
        doc.fontSize(11).font('Helvetica');
        
        const paragraphs = content.split('\n\n');
        paragraphs.forEach((paragraph, index) => {
          if (paragraph.trim()) {
            // Check if this is a greeting or signature line
            const trimmedParagraph = paragraph.trim();
            
            if (trimmedParagraph.includes('Saygılarımla') || 
                trimmedParagraph.includes('Best regards') ||
                trimmedParagraph.includes('Merhaba') ||
                trimmedParagraph.includes('Hello')) {
              doc.font('Helvetica-Bold');
            } else {
              doc.font('Helvetica');
            }

            doc.text(trimmedParagraph, {
              align: 'justify',
              lineGap: 3,
            });
            
            if (index < paragraphs.length - 1) {
              doc.moveDown(0.8);
            }
          }
        });

        // Add contact info if fullName is provided
        if (fullName) {
          doc.moveDown(1);
          doc.fontSize(9).font('Helvetica-Oblique');
          doc.text(fullName, { align: 'left' });
        }

        doc.end();
      } catch (error) {
        logger.error(
          createErrorMessage(SERVICE_MESSAGES.PDF.GENERATION_ERROR, error as Error)
        );
        reject(error);
      }
    });
  }

  /**
   * Dil tespiti
   */
  detectLanguage(content: string): 'TURKISH' | 'ENGLISH' {
    const turkishWords = ['ve', 'ile', 'için', 'bir', 'bu', 'şu', 'olan', 'çok', 'değil', 'gibi'];
    const englishWords = ['and', 'with', 'for', 'the', 'this', 'that', 'which', 'very', 'not', 'like'];

    const words = content.toLowerCase().split(/\s+/);
    
    let turkishScore = 0;
    let englishScore = 0;

    words.forEach(word => {
      if (turkishWords.includes(word)) turkishScore++;
      if (englishWords.includes(word)) englishScore++;
    });

    return turkishScore > englishScore ? 'TURKISH' : 'ENGLISH';
  }

  /**
   * Title formatting
   */
  formatTitle(title: string, language: 'TURKISH' | 'ENGLISH'): string {
    // Remove special characters and format
    return title
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}