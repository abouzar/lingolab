import { Router } from 'express';
import { WordService } from '../services/wordService';

const router = Router();

// GET /api/v1/words - Get all German words with optional filtering
router.get('/', async (req, res) => {
    try {
        console.log('Words endpoint called with query:', req.query);

        // Manual validation and parsing of query parameters
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
        const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
        const partOfSpeech = req.query.partOfSpeech as string | undefined;
        const difficulty = req.query.difficulty ? parseInt(req.query.difficulty as string) : undefined;

        let words;
        if (partOfSpeech) {
            words = await WordService.getWordsByPartOfSpeech(partOfSpeech, limit);
        } else if (difficulty) {
            words = await WordService.getWordsByDifficulty(difficulty, limit);
        } else {
            words = await WordService.getGermanWords(limit, offset);
        }

        console.log('Words retrieved:', words.length);

        res.json({
            success: true,
            data: words
        });
    } catch (error) {
        console.error('Words endpoint error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : 'Failed to fetch words',
                timestamp: new Date().toISOString()
            }
        });
    }
});

// GET /api/v1/words/search - Search German words
router.get('/search', async (req, res) => {
    try {
        const q = req.query.q as string;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

        if (!q || q.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_QUERY',
                    message: 'Search term is required',
                    timestamp: new Date().toISOString()
                }
            });
        }

        const words = await WordService.searchGermanWords(q.trim(), limit);

        res.json({
            success: true,
            data: words
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : 'Failed to search words',
                timestamp: new Date().toISOString()
            }
        });
    }
});

// GET /api/v1/words/:id - Get word by ID (MUST BE LAST)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Basic validation for CUID format
        if (!id || typeof id !== 'string' || id.length < 20) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_WORD_ID',
                    message: 'Invalid word ID format',
                    timestamp: new Date().toISOString()
                }
            });
        }

        const word = await WordService.getWordById(id);

        res.json({
            success: true,
            data: word
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Word not found') {
            res.status(404).json({
                success: false,
                error: {
                    code: 'WORD_NOT_FOUND',
                    message: 'Word not found',
                    timestamp: new Date().toISOString()
                }
            });
        } else {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to fetch word',
                    timestamp: new Date().toISOString()
                }
            });
        }
    }
});

export { router as wordRoutes };