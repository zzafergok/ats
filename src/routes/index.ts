import { Router } from 'express';

import coverLetterRoutes from './coverLetter';
import cvGeneratorRoutes from './cvGenerator';

const router = Router();

router.use('/cover-letter', coverLetterRoutes);
router.use('/cv-generator', cvGeneratorRoutes);

export default router;