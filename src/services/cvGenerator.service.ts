import { PrismaClient } from '@prisma/client';

import { CVTemplateBasicHRService } from './cvTemplateBasicHR.service';
import { CVTemplateOfficeManagerService } from './cvTemplateOfficeManager.service';
import { CVTemplateSimpleClassicService } from './cvTemplateSimpleClassic.service';
import { CVTemplateStylishAccountingService } from './cvTemplateStylishAccounting.service';
import { CVTemplateMinimalistTurkishService } from './cvTemplateMinimalistTurkish.service';

import {
  SERVICE_MESSAGES,
  formatMessage,
  createErrorMessage,
} from '../constants/messages';
import logger from '../config/logger';
import { CVTemplateData } from '../types';

const prisma = new PrismaClient();

export type CVTemplateType =
  | 'basic-hr'
  | 'office-manager'
  | 'simple-classic'
  | 'stylish-accounting'
  | 'minimalist-turkish';

export interface CVGenerationResponse {
  id: string;
  templateType: string;
  generationStatus: string;
  pdfBuffer?: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

export class CVGeneratorService {
  private static instance: CVGeneratorService;
  private basicHRService: CVTemplateBasicHRService;
  private officeManagerService: CVTemplateOfficeManagerService;
  private simpleClassicService: CVTemplateSimpleClassicService;
  private stylishAccountingService: CVTemplateStylishAccountingService;
  private minimalistTurkishService: CVTemplateMinimalistTurkishService;

  private constructor() {
    this.basicHRService = CVTemplateBasicHRService.getInstance();
    this.officeManagerService = CVTemplateOfficeManagerService.getInstance();
    this.simpleClassicService = CVTemplateSimpleClassicService.getInstance();
    this.stylishAccountingService = CVTemplateStylishAccountingService.getInstance();
    this.minimalistTurkishService = CVTemplateMinimalistTurkishService.getInstance();
  }

  public static getInstance(): CVGeneratorService {
    if (!CVGeneratorService.instance) {
      CVGeneratorService.instance = new CVGeneratorService();
    }
    return CVGeneratorService.instance;
  }

  getAvailableTemplates() {
    return [
      {
        id: 'basic-hr',
        name: 'Basic HR Template',
        description: 'Professional template for HR and business roles',
      },
      {
        id: 'office-manager',
        name: 'Office Manager Template',
        description: 'Template optimized for office management roles',
      },
      {
        id: 'simple-classic',
        name: 'Simple Classic Template',
        description: 'Clean and simple template for any role',
      },
      {
        id: 'stylish-accounting',
        name: 'Stylish Accounting Template',
        description: 'Professional template for accounting and finance roles',
      },
      {
        id: 'minimalist-turkish',
        name: 'Minimalist Turkish Template',
        description: 'Minimalist template with Turkish language support',
      },
    ];
  }

  async generateCV(
    templateType: CVTemplateType,
    data: CVTemplateData,
    version?: string,
    language?: string
  ): Promise<CVGenerationResponse> {
    try {
      // CV kaydını oluştur
      const cvRecord = await prisma.generatedCv.create({
        data: {
          templateType,
          templateData: JSON.stringify(data),
          generationStatus: 'PROCESSING',
        },
      });

      try {
        // PDF oluştur
        const pdfBuffer = await this.generatePDFByTemplate(
          templateType,
          data,
          version,
          language
        );

        // Database'i güncelle
        const updatedCV = await prisma.generatedCv.update({
          where: { id: cvRecord.id },
          data: {
            pdfData: pdfBuffer,
            generationStatus: 'COMPLETED',
            updatedAt: new Date(),
          },
        });

        return {
          id: updatedCV.id,
          templateType: updatedCV.templateType,
          generationStatus: updatedCV.generationStatus,
          pdfBuffer: pdfBuffer,
          createdAt: updatedCV.createdAt,
          updatedAt: updatedCV.updatedAt,
        };
      } catch (pdfError) {
        // PDF oluşturma hatası durumunda status'u güncelle
        await prisma.generatedCv.update({
          where: { id: cvRecord.id },
          data: {
            generationStatus: 'FAILED',
            updatedAt: new Date(),
          },
        });
        throw pdfError;
      }
    } catch (error) {
      logger.error(
        createErrorMessage(SERVICE_MESSAGES.GENERAL.FAILED, error as Error)
      );
      throw error;
    }
  }

  async getUserCVs(): Promise<any[]> {
    const cvs = await prisma.generatedCv.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return cvs.map((cv) => ({
      id: cv.id,
      templateType: cv.templateType,
      generationStatus: cv.generationStatus,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt,
    }));
  }

  async getCV(cvId: string): Promise<any | null> {
    const cv = await prisma.generatedCv.findFirst({
      where: { id: cvId },
    });

    if (!cv) {
      return null;
    }

    return {
      id: cv.id,
      templateType: cv.templateType,
      templateData: JSON.parse(cv.templateData),
      generationStatus: cv.generationStatus,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt,
    };
  }

  async downloadCV(cvId: string): Promise<Buffer | null> {
    const cv = await prisma.generatedCv.findFirst({
      where: { id: cvId },
    });

    if (!cv || !cv.pdfData) {
      return null;
    }

    return Buffer.from(cv.pdfData);
  }

  async regenerateCV(cvId: string, data: CVTemplateData, version?: string, language?: string): Promise<CVGenerationResponse> {
    const cv = await prisma.generatedCv.findFirst({
      where: { id: cvId },
    });

    if (!cv) {
      throw new Error(formatMessage(SERVICE_MESSAGES.COVER_LETTER.NOT_FOUND));
    }

    // PDF'i yeniden oluştur
    const pdfBuffer = await this.generatePDFByTemplate(
      cv.templateType as CVTemplateType,
      data,
      version,
      language
    );

    // Database'i güncelle
    const updatedCV = await prisma.generatedCv.update({
      where: { id: cvId },
      data: {
        templateData: JSON.stringify(data),
        pdfData: pdfBuffer,
        generationStatus: 'COMPLETED',
        updatedAt: new Date(),
      },
    });

    return {
      id: updatedCV.id,
      templateType: updatedCV.templateType,
      generationStatus: updatedCV.generationStatus,
      pdfBuffer: pdfBuffer,
      createdAt: updatedCV.createdAt,
      updatedAt: updatedCV.updatedAt,
    };
  }

  async deleteCV(cvId: string): Promise<void> {
    const cv = await prisma.generatedCv.findFirst({
      where: { id: cvId },
    });

    if (!cv) {
      throw new Error(formatMessage(SERVICE_MESSAGES.COVER_LETTER.NOT_FOUND));
    }

    await prisma.generatedCv.delete({
      where: { id: cvId },
    });
  }

  private async generatePDFByTemplate(
    templateType: CVTemplateType,
    data: CVTemplateData,
    version?: string,
    language?: string
  ): Promise<Buffer> {
    try {
      switch (templateType) {
        case 'basic-hr':
          return await this.basicHRService.generatePDF(data);
        case 'office-manager':
          return await this.officeManagerService.generatePDF(data);
        case 'simple-classic':
          return await this.simpleClassicService.generatePDF(data);
        case 'stylish-accounting':
          return await this.stylishAccountingService.generatePDF(data);
        case 'minimalist-turkish':
          return await this.minimalistTurkishService.generatePDF(data);
        default:
          throw new Error(`Unsupported template type: ${templateType}`);
      }
    } catch (error) {
      logger.error('PDF generation error:', error);
      throw new Error(`PDF oluşturma başarısız: ${(error as Error).message}`);
    }
  }
}