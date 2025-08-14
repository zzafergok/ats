import { Request, Response } from 'express';
import { CVGeneratorService, CVTemplateType } from '../services/cvGenerator.service';
import logger from '../config/logger';
import {
  SERVICE_MESSAGES,
  formatMessage,
  createErrorMessage,
} from '../constants/messages';

export class CVGeneratorController {
  private cvGeneratorService: CVGeneratorService;

  constructor() {
    this.cvGeneratorService = CVGeneratorService.getInstance();
  }

  // Get available templates
  getAvailableTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
      const templates = this.cvGeneratorService.getAvailableTemplates();
      
      res.json({
        success: true,
        data: templates,
      });
    } catch (error) {
      logger.error('Get templates error:', error);
      res.status(500).json({
        success: false,
        message: formatMessage(SERVICE_MESSAGES.GENERAL.FAILED),
      });
    }
  };

  // Generate CV
  generateCV = async (req: Request, res: Response): Promise<void> => {
    try {
      const { templateType, data, version, language } = req.body;

      // Validate input
      if (!templateType || !data) {
        res.status(400).json({
          success: false,
          message: 'Template type and data are required',
        });
        return;
      }

      // Handle version and language for all templates
      if (version && ['global', 'turkey'].includes(version)) {
        if (version === 'turkey' && (!language || !['turkish', 'english'].includes(language))) {
          res.status(400).json({
            success: false,
            message: 'Language is required for turkey version (turkish or english)',
          });
          return;
        }
      }

      const result = await this.cvGeneratorService.generateCV(
        templateType as CVTemplateType,
        data,
        version,
        language
      );

      res.status(201).json({
        success: true,
        message: 'CV başarıyla oluşturuldu',
        data: result,
      });
    } catch (error) {
      logger.error('CV generation error:', error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || 'CV oluşturma başarısız',
      });
    }
  };

  // Get user's CVs
  getUserCVs = async (req: Request, res: Response): Promise<void> => {
    try {
      const cvs = await this.cvGeneratorService.getUserCVs();
      
      res.json({
        success: true,
        data: cvs,
      });
    } catch (error) {
      logger.error('Get user CVs error:', error);
      res.status(500).json({
        success: false,
        message: formatMessage(SERVICE_MESSAGES.GENERAL.FAILED),
      });
    }
  };

  // Get specific CV
  getCV = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cvId } = req.params;

      const cv = await this.cvGeneratorService.getCV(cvId);

      if (!cv) {
        res.status(404).json({
          success: false,
          message: formatMessage(SERVICE_MESSAGES.COVER_LETTER.NOT_FOUND),
        });
        return;
      }

      res.json({
        success: true,
        data: cv,
      });
    } catch (error) {
      logger.error('Get CV error:', error);
      res.status(500).json({
        success: false,
        message: formatMessage(SERVICE_MESSAGES.GENERAL.FAILED),
      });
    }
  };

  // Download CV PDF
  downloadCV = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cvId } = req.params;
      const { templateType, data, version, language } = req.body;

      // Validate input
      if (!templateType || !data) {
        res.status(400).json({
          success: false,
          message: 'Template type and data are required',
        });
        return;
      }

      // Handle version and language for all templates
      if (version && ['global', 'turkey'].includes(version)) {
        if (version === 'turkey' && (!language || !['turkish', 'english'].includes(language))) {
          res.status(400).json({
            success: false,
            message: 'Language is required for turkey version (turkish or english)',
          });
          return;
        }
      }

      const pdfBuffer = await this.cvGeneratorService.downloadCV(
        cvId,
        templateType as CVTemplateType,
        data,
        version,
        language
      );

      if (!pdfBuffer) {
        res.status(404).json({
          success: false,
          message: formatMessage(SERVICE_MESSAGES.COVER_LETTER.NOT_FOUND),
        });
        return;
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="cv-${cvId}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      logger.error('Download CV error:', error);
      res.status(500).json({
        success: false,
        message: 'PDF indirme başarısız',
      });
    }
  };

  // Regenerate CV
  regenerateCV = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cvId } = req.params;
      const { data, version, language } = req.body;

      const result = await this.cvGeneratorService.regenerateCV(cvId, data, version, language);

      res.json({
        success: true,
        message: 'CV başarıyla yeniden oluşturuldu',
        data: result,
      });
    } catch (error) {
      logger.error('Regenerate CV error:', error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || 'CV yeniden oluşturma başarısız',
      });
    }
  };

  // Delete CV
  deleteCV = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cvId } = req.params;

      await this.cvGeneratorService.deleteCV(cvId);

      res.json({
        success: true,
        message: 'CV başarıyla silindi',
      });
    } catch (error) {
      logger.error('Delete CV error:', error);
      res.status(500).json({
        success: false,
        message: formatMessage(SERVICE_MESSAGES.GENERAL.FAILED),
      });
    }
  };
}