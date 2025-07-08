import { Router } from 'express';
import { TagController } from '../controllers/controller-tag.js';

const tagRoutes = Router();
const tagController = new TagController();

tagRoutes.get('/', tagController.index);

export { tagRoutes };
