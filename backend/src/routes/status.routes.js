import { Router } from 'express';
import { getAllCodes, getCodeJson, getCodeImage } from '../controllers/status.controller.js';

const router = Router();


router.route('/codes').get(getAllCodes);


router.route('/:code/json').get(getCodeJson);


router.route('/:code').get(getCodeImage);

export default router;
