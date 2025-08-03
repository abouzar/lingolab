import { Router } from 'express';
import { authRoutes } from './auth';
import { userRoutes } from './user';
import { trainingSetRoutes } from './trainingSets';
import { progressRoutes } from './progress';
import { aiRoutes } from './ai';
import { wordRoutes } from './words';

const router = Router();

// API version prefix
const API_VERSION = 'v1';

// Test endpoint to check if routing works
router.get(`/${API_VERSION}/test-words`, (req, res) => {
  res.json({
    success: true,
    data: { message: 'Direct words test endpoint working' }
  });
});

// Mount route modules
router.use(`/${API_VERSION}/auth`, authRoutes);
router.use(`/${API_VERSION}/user`, userRoutes);
router.use(`/${API_VERSION}/training-sets`, trainingSetRoutes);
router.use(`/${API_VERSION}/progress`, progressRoutes);
router.use(`/${API_VERSION}/ai`, aiRoutes);
router.use(`/${API_VERSION}/words`, wordRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'LingoLab API',
      version: API_VERSION,
      timestamp: new Date().toISOString(),
      endpoints: [
        '/auth - Authentication endpoints',
        '/user - User management endpoints',
        '/training-sets - Training set management endpoints',
        '/progress - Learning progress endpoints',
        '/ai - AI integration endpoints',
        '/words - Word management endpoints'
      ]
    }
  });
});

export { router as apiRoutes };