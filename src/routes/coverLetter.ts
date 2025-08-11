import { Router } from 'express';
import { CoverLetterController } from '../controllers/coverLetter.controller';

const router = Router();
const coverLetterController = new CoverLetterController();

// Cover Letter routes
router.post('/', coverLetterController.createCoverLetter);
router.get('/', coverLetterController.getUserCoverLetters);
router.get('/:id', coverLetterController.getCoverLetter);
router.put('/:id', coverLetterController.updateCoverLetter);
router.delete('/:id', coverLetterController.deleteCoverLetter);

// PDF generation routes
router.get('/:id/pdf', coverLetterController.downloadPdf);
router.post('/custom-pdf', coverLetterController.downloadCustomPdf);

export default router;