import { Router } from 'express';
import { TagController } from '../controllers/controller-tag.ts';

const tagRoutes = Router();
const tagController = new TagController();

tagRoutes.get('/', tagController.index);
tagRoutes.post('/', tagController.create);

export { tagRoutes };
