import express from 'express';
import { GetProjectById } from "../../controllers/user-controllers/project-controller.js";

const router = express.Router();

router.get('/:projectId', GetProjectById);

export default router;