import { PrismaClient } from '@prisma/client';
import logger from '../config/logger';
import {
  SERVICE_MESSAGES,
  formatMessage,
  createErrorMessage,
} from '../constants/messages';
import { UserProfile } from '../types';

const prisma = new PrismaClient();

export interface CoverLetterResponse {
  id: string;
  generatedContent: string;
  positionTitle: string;
  companyName: string;
  generationStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CoverLetterService {
  private static instance: CoverLetterService;

  private constructor() {}

  public static getInstance(): CoverLetterService {
    if (!CoverLetterService.instance) {
      CoverLetterService.instance = new CoverLetterService();
    }
    return CoverLetterService.instance;
  }

  async createCoverLetter(
    request: any,
    userProfile: UserProfile
  ): Promise<CoverLetterResponse> {
    try {
      const fullName = `${userProfile.firstName} ${userProfile.lastName}`;
      
      const generatedContent = `${request.content}

${fullName}
${userProfile.phone}
${userProfile.email}`;

      const coverLetter = await prisma.coverLetter.create({
        data: {
          positionTitle: request.positionTitle,
          companyName: request.companyName,
          jobDescription: request.jobDescription,
          generatedContent,
          generationStatus: 'COMPLETED',
        },
      });

      return {
        id: coverLetter.id,
        generatedContent: coverLetter.generatedContent || '',
        positionTitle: coverLetter.positionTitle,
        companyName: coverLetter.companyName,
        generationStatus: coverLetter.generationStatus,
        createdAt: coverLetter.createdAt,
        updatedAt: coverLetter.updatedAt,
      };
    } catch (error) {
      logger.error(
        createErrorMessage(
          SERVICE_MESSAGES.COVER_LETTER.GENERATION_FAILED,
          error as Error
        )
      );
      throw error;
    }
  }

  async getCoverLetter(
    coverLetterId: string
  ): Promise<CoverLetterResponse | null> {
    const coverLetter = await prisma.coverLetter.findFirst({
      where: {
        id: coverLetterId,
      },
    });

    if (!coverLetter) {
      return null;
    }

    return {
      id: coverLetter.id,
      generatedContent: coverLetter.generatedContent || '',
      positionTitle: coverLetter.positionTitle,
      companyName: coverLetter.companyName,
      generationStatus: coverLetter.generationStatus,
      createdAt: coverLetter.createdAt,
      updatedAt: coverLetter.updatedAt,
    };
  }

  async updateCoverLetter(
    coverLetterId: string,
    updatedContent: string
  ): Promise<CoverLetterResponse> {
    const coverLetter = await prisma.coverLetter.findFirst({
      where: {
        id: coverLetterId,
      },
    });

    if (!coverLetter) {
      throw new Error(formatMessage(SERVICE_MESSAGES.COVER_LETTER.NOT_FOUND));
    }

    const updated = await prisma.coverLetter.update({
      where: { id: coverLetterId },
      data: {
        updatedContent,
        updatedAt: new Date(),
      },
    });

    return {
      id: updated.id,
      generatedContent: updated.updatedContent || updated.generatedContent || '',
      positionTitle: updated.positionTitle,
      companyName: updated.companyName,
      generationStatus: updated.generationStatus,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async getUserCoverLetters(): Promise<{ coverLetters: CoverLetterResponse[] }> {
    const coverLetters = await prisma.coverLetter.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formattedCoverLetters = coverLetters.map((coverLetter) => ({
      id: coverLetter.id,
      generatedContent:
        coverLetter.updatedContent || coverLetter.generatedContent || '',
      positionTitle: coverLetter.positionTitle,
      companyName: coverLetter.companyName,
      generationStatus: coverLetter.generationStatus,
      createdAt: coverLetter.createdAt,
      updatedAt: coverLetter.updatedAt,
    }));

    return {
      coverLetters: formattedCoverLetters,
    };
  }

  async deleteCoverLetter(coverLetterId: string): Promise<void> {
    const coverLetter = await prisma.coverLetter.findFirst({
      where: {
        id: coverLetterId,
      },
    });

    if (!coverLetter) {
      throw new Error(formatMessage(SERVICE_MESSAGES.COVER_LETTER.NOT_FOUND));
    }

    await prisma.coverLetter.delete({
      where: { id: coverLetterId },
    });
  }

}