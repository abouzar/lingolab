import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validation';
import { 
  TrainingSetService, 
  createTrainingSetSchema, 
  updateTrainingSetSchema,
  addWordsToSetSchema,
  removeWordsFromSetSchema,
  reorderWordsSchema
} from '../services/trainingSetService';

const router = Router();

// Validation schemas for route parameters and queries
const trainingSetParamsSchema = z.object({
  id: z.string().cuid('Invalid training set ID')
});

const listQuerySchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  category: z.string().optional()
});

const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search term is required'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional()
});

// GET /api/v1/training-sets - Get user's training sets
router.get('/', async (req, res) => {
  try {
    // Manual validation of query parameters
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
    const category = req.query.category as string | undefined;
    
    const trainingSets = await TrainingSetService.getUserTrainingSets(limit, offset, category);

    res.json({
      success: true,
      data: trainingSets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch training sets',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// GET /api/v1/training-sets/search - Search training sets
router.get('/search', validateRequest({ query: searchQuerySchema }), async (req, res) => {
  try {
    const { q, limit } = req.query as any;
    const trainingSets = await TrainingSetService.searchTrainingSets(q, limit);

    res.json({
      success: true,
      data: trainingSets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to search training sets',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// GET /api/v1/training-sets/:id - Get training set by ID
router.get('/:id', validateRequest({ params: trainingSetParamsSchema }), async (req, res) => {
  try {
    const { id } = req.params;
    const trainingSet = await TrainingSetService.getTrainingSetById(id);

    res.json({
      success: true,
      data: trainingSet
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Training set not found') {
      res.status(404).json({
        success: false,
        error: {
          code: 'TRAINING_SET_NOT_FOUND',
          message: 'Training set not found',
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch training set',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
});

// GET /api/v1/training-sets/:id/stats - Get training set statistics
router.get('/:id/stats', validateRequest({ params: trainingSetParamsSchema }), async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await TrainingSetService.getTrainingSetStats(id);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Training set not found') {
      res.status(404).json({
        success: false,
        error: {
          code: 'TRAINING_SET_NOT_FOUND',
          message: 'Training set not found',
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch training set stats',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
});

// POST /api/v1/training-sets - Create new training set
router.post('/', validateRequest({ body: createTrainingSetSchema }), async (req, res) => {
  try {
    const trainingSetData = req.body;
    const trainingSet = await TrainingSetService.createTrainingSet(trainingSetData);

    res.status(201).json({
      success: true,
      data: trainingSet
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({
        success: false,
        error: {
          code: 'TRAINING_SET_ALREADY_EXISTS',
          message: error.message,
          timestamp: new Date().toISOString()
        }
      });
    } else if (error instanceof Error && error.message.includes('not found')) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_WORDS',
          message: error.message,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create training set',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
});

// PUT /api/v1/training-sets/:id - Update training set
router.put('/:id', validateRequest({ 
  params: trainingSetParamsSchema,
  body: updateTrainingSetSchema 
}), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const trainingSet = await TrainingSetService.updateTrainingSet(id, updateData);

    res.json({
      success: true,
      data: trainingSet
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Training set not found') {
      res.status(404).json({
        success: false,
        error: {
          code: 'TRAINING_SET_NOT_FOUND',
          message: 'Training set not found',
          timestamp: new Date().toISOString()
        }
      });
    } else if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({
        success: false,
        error: {
          code: 'TRAINING_SET_ALREADY_EXISTS',
          message: error.message,
          timestamp: new Date().toISOString()
        }
      });
    } else if (error instanceof Error && error.message.includes('not found')) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_WORDS',
          message: error.message,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update training set',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
});

// DELETE /api/v1/training-sets/:id - Delete training set
router.delete('/:id', validateRequest({ params: trainingSetParamsSchema }), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TrainingSetService.deleteTrainingSet(id);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Training set not found') {
      res.status(404).json({
        success: false,
        error: {
          code: 'TRAINING_SET_NOT_FOUND',
          message: 'Training set not found',
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete training set',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
});

// POST /api/v1/training-sets/:id/words - Add words to training set
router.post('/:id/words', validateRequest({ 
  params: trainingSetParamsSchema,
  body: addWordsToSetSchema 
}), async (req, res) => {
  try {
    const { id } = req.params;
    const wordData = req.body;
    const trainingSet = await TrainingSetService.addWordsToSet(id, wordData);

    res.json({
      success: true,
      data: trainingSet
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Training set not found') {
      res.status(404).json({
        success: false,
        error: {
          code: 'TRAINING_SET_NOT_FOUND',
          message: 'Training set not found',
          timestamp: new Date().toISOString()
        }
      });
    } else if (error instanceof Error && error.message.includes('already in the training set')) {
      res.status(409).json({
        success: false,
        error: {
          code: 'WORDS_ALREADY_IN_SET',
          message: error.message,
          timestamp: new Date().toISOString()
        }
      });
    } else if (error instanceof Error && error.message.includes('not found')) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_WORDS',
          message: error.message,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to add words to training set',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
});

// DELETE /api/v1/training-sets/:id/words - Remove words from training set
router.delete('/:id/words', validateRequest({ 
  params: trainingSetParamsSchema,
  body: removeWordsFromSetSchema 
}), async (req, res) => {
  try {
    const { id } = req.params;
    const wordData = req.body;
    const trainingSet = await TrainingSetService.removeWordsFromSet(id, wordData);

    res.json({
      success: true,
      data: trainingSet
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Training set not found') {
      res.status(404).json({
        success: false,
        error: {
          code: 'TRAINING_SET_NOT_FOUND',
          message: 'Training set not found',
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to remove words from training set',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
});

// PUT /api/v1/training-sets/:id/words/reorder - Reorder words in training set
router.put('/:id/words/reorder', validateRequest({ 
  params: trainingSetParamsSchema,
  body: reorderWordsSchema 
}), async (req, res) => {
  try {
    const { id } = req.params;
    const reorderData = req.body;
    const trainingSet = await TrainingSetService.reorderWords(id, reorderData);

    res.json({
      success: true,
      data: trainingSet
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Training set not found') {
      res.status(404).json({
        success: false,
        error: {
          code: 'TRAINING_SET_NOT_FOUND',
          message: 'Training set not found',
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to reorder words in training set',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
});

// POST /api/v1/training-sets/import
router.post('/import', (req, res) => {
  // TODO: Implement import from file logic
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Import training set not yet implemented',
      timestamp: new Date().toISOString()
    }
  });
});

// GET /api/v1/training-sets/:id/export
router.get('/:id/export', validateRequest({ params: trainingSetParamsSchema }), (req, res) => {
  // TODO: Implement export to file logic
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Export training set not yet implemented',
      timestamp: new Date().toISOString()
    }
  });
});

export { router as trainingSetRoutes };