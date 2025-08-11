import { Request, Response } from 'express';
import { z } from 'zod';

import { CoverLetterService } from '../services/coverLetter.service';
import { PdfService } from '../services/pdf.service';

import logger from '../config/logger';
import {
  SERVICE_MESSAGES,
  formatMessage,
  createErrorMessage,
} from '../constants/messages';
import { createCoverLetterSchema, updateCoverLetterSchema } from '../schemas';

export class CoverLetterController {
  private coverLetterService = CoverLetterService.getInstance();
  private pdfService = PdfService.getInstance();

  public createCoverLetter = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const validatedData = createCoverLetterSchema.parse(req.body);

      const coverLetter = await this.coverLetterService.createCoverLetter(
        validatedData,
        validatedData.userProfile
      );

      res.status(201).json({
        success: true,
        message: 'Cover letter başarıyla oluşturuldu',
        data: coverLetter,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Geçersiz veri',
          errors: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
        return;
      }

      logger.error(
        createErrorMessage(SERVICE_MESSAGES.COVER_LETTER.GENERATION_FAILED, error as Error)
      );
      res.status(500).json({
        success: false,
        message: (error as Error).message || formatMessage(SERVICE_MESSAGES.COVER_LETTER.GENERATION_FAILED),
      });
    }
  };

  public getCoverLetter = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const coverLetter = await this.coverLetterService.getCoverLetter(id);

      if (!coverLetter) {
        res.status(404).json({
          success: false,
          message: formatMessage(SERVICE_MESSAGES.COVER_LETTER.NOT_FOUND),
        });
        return;
      }

      res.json({
        success: true,
        data: coverLetter,
      });
    } catch (error) {
      logger.error(
        createErrorMessage(SERVICE_MESSAGES.COVER_LETTER.NOT_FOUND, error as Error)
      );
      res.status(500).json({
        success: false,
        message: formatMessage(SERVICE_MESSAGES.COVER_LETTER.NOT_FOUND),
      });
    }
  };

  public updateCoverLetter = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { updatedContent } = updateCoverLetterSchema.parse(req.body);

      const updatedCoverLetter = await this.coverLetterService.updateCoverLetter(
        id,
        updatedContent
      );

      res.json({
        success: true,
        message: 'Cover letter başarıyla güncellendi',
        data: updatedCoverLetter,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Geçersiz veri',
          errors: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
        return;
      }

      logger.error(
        createErrorMessage(SERVICE_MESSAGES.COVER_LETTER.NOT_FOUND, error as Error)
      );
      res.status(500).json({
        success: false,
        message: (error as Error).message || formatMessage(SERVICE_MESSAGES.COVER_LETTER.NOT_FOUND),
      });
    }
  };

  public getUserCoverLetters = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const result = await this.coverLetterService.getUserCoverLetters();

      res.json({
        success: true,
        data: result.coverLetters,
      });
    } catch (error) {
      logger.error(
        createErrorMessage(SERVICE_MESSAGES.GENERAL.FAILED, error as Error)
      );
      res.status(500).json({
        success: false,
        message: formatMessage(SERVICE_MESSAGES.GENERAL.FAILED),
      });
    }
  };

  public deleteCoverLetter = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;

      await this.coverLetterService.deleteCoverLetter(id);

      res.json({
        success: true,
        message: 'Cover letter başarıyla silindi',
      });
    } catch (error) {
      logger.error(
        createErrorMessage(SERVICE_MESSAGES.GENERAL.FAILED, error as Error)
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : formatMessage(SERVICE_MESSAGES.GENERAL.FAILED);
      res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  public downloadPdf = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const coverLetter = await this.coverLetterService.getCoverLetter(id);

      if (!coverLetter) {
        res.status(404).json({
          success: false,
          message: formatMessage(SERVICE_MESSAGES.COVER_LETTER.NOT_FOUND),
        });
        return;
      }

      if (
        coverLetter.generationStatus !== 'COMPLETED' ||
        !coverLetter.generatedContent
      ) {
        res.status(400).json({
          success: false,
          message: 'Cover letter henüz oluşturulmamış veya içerik boş',
        });
        return;
      }

      const pdfBuffer = await this.pdfService.generateCoverLetterPdf({
        content: coverLetter.generatedContent,
        positionTitle: coverLetter.positionTitle,
        companyName: coverLetter.companyName,
        language: 'TURKISH',
      });

      const detectedLanguage = this.pdfService.detectLanguage(coverLetter.generatedContent);
      const formattedCompany = this.pdfService.formatTitle(coverLetter.companyName, detectedLanguage);
      const formattedPosition = this.pdfService.formatTitle(coverLetter.positionTitle, detectedLanguage);
      
      const turkishToAscii = (text: string): string => {
        return text
          .replace(/Ç/g, 'C').replace(/ç/g, 'c')
          .replace(/Ğ/g, 'G').replace(/ğ/g, 'g')
          .replace(/İ/g, 'I').replace(/ı/g, 'i')
          .replace(/Ö/g, 'O').replace(/ö/g, 'o')
          .replace(/Ş/g, 'S').replace(/ş/g, 's')
          .replace(/Ü/g, 'U').replace(/ü/g, 'u')
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s+/g, '_');
      };
      
      const fileName = `${turkishToAscii(formattedCompany)}_${turkishToAscii(formattedPosition)}_Cover_Letter.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(pdfBuffer);
    } catch (error) {
      logger.error(
        createErrorMessage(SERVICE_MESSAGES.PDF.GENERATION_ERROR, error as Error)
      );
      res.status(500).json({
        success: false,
        message: formatMessage(SERVICE_MESSAGES.PDF.GENERATION_ERROR),
      });
    }
  };

  public downloadCustomPdf = async (req: Request, res: Response): Promise<void> => {
    try {
      const { content, positionTitle, companyName, language = 'TURKISH' } = req.body;

      if (!content || !positionTitle || !companyName) {
        res.status(400).json({
          success: false,
          message: 'Content, position title ve company name alanları zorunludur',
        });
        return;
      }

      const pdfBuffer = await this.pdfService.generateCoverLetterPdfWithCustomFormat(
        content,
        positionTitle,
        companyName,
        undefined,
        language as 'TURKISH' | 'ENGLISH'
      );

      const detectedLanguage = this.pdfService.detectLanguage(content);
      const formattedCompany = this.pdfService.formatTitle(companyName, detectedLanguage);
      const formattedPosition = this.pdfService.formatTitle(positionTitle, detectedLanguage);
      
      const turkishToAscii = (text: string): string => {
        return text
          .replace(/Ç/g, 'C').replace(/ç/g, 'c')
          .replace(/Ğ/g, 'G').replace(/ğ/g, 'g')
          .replace(/İ/g, 'I').replace(/ı/g, 'i')
          .replace(/Ö/g, 'O').replace(/ö/g, 'o')
          .replace(/Ş/g, 'S').replace(/ş/g, 's')
          .replace(/Ü/g, 'U').replace(/ü/g, 'u')
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s+/g, '_');
      };
      
      const fileName = `${turkishToAscii(formattedCompany)}_${turkishToAscii(formattedPosition)}_Edited_Cover_Letter.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(pdfBuffer);
    } catch (error) {
      logger.error(
        createErrorMessage(SERVICE_MESSAGES.PDF.GENERATION_ERROR, error as Error)
      );
      res.status(500).json({
        success: false,
        message: formatMessage(SERVICE_MESSAGES.PDF.GENERATION_ERROR),
      });
    }
  };
}