import { Router } from 'express';
import { getAllCodes, getCodeJson, getCodeImage, getTrendingCodes } from '../controllers/status.controller.js';
import { cache } from '../middlewares/cache.js';

const router = Router();


router.route('/codes').get(cache(60), getAllCodes);
router.route('/trending').get(cache(30), getTrendingCodes);


router.route('/:code/json').get(getCodeJson);


router.route('/:code').get(getCodeImage);

export default router;
