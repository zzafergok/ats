import { Router } from 'express';
import { CVGeneratorController } from '../controllers/cvGenerator.controller';

const router = Router();
const cvGeneratorController = new CVGeneratorController();

// Get available templates (no rate limiting needed)
router.get('/templates', cvGeneratorController.getAvailableTemplates);

// Generate CV
router.post('/generate', cvGeneratorController.generateCV);

// Get user's CVs
router.get('/', cvGeneratorController.getUserCVs);

// Get specific CV
router.get('/:cvId', cvGeneratorController.getCV);

// Download CV PDF
router.get('/:cvId/download', cvGeneratorController.downloadCV);

// Regenerate CV
router.post('/:cvId/regenerate', cvGeneratorController.regenerateCV);

// Delete CV
router.delete('/:cvId', cvGeneratorController.deleteCV);

export default router;
