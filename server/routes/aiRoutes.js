import express from 'express'
import {enhanceJobDescription, enhanceProfessionalSummary, improveSections, uploadResume } from '../controllers/aiController.js';
import { analyzeResume } from '../controllers/resumeController.js';
import protect from '../Middlewares/authMiddleware.js';

const aiRouter = express.Router();
aiRouter.post('/enhance-pro-sum',protect,enhanceProfessionalSummary)
aiRouter.post('/enhance-job-desc',protect,enhanceJobDescription)
aiRouter.post('/upload-resume',protect,uploadResume)
aiRouter.post("/analyze/:resumeId", protect, analyzeResume)
aiRouter.post('/improve/:resumeId', protect, improveSections);
export default aiRouter;