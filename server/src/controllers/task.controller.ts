import { Request, Response, NextFunction } from 'express';
import { createTaskSchema, updateTaskSchema, getTasksQuerySchema } from '../validations/task.validation.js';
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from '../services/task.service.js';

export const getAllTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = getTasksQuerySchema.parse(req.query);
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);

    const result = await getTasks({
      userId: req.userId!,
      page,
      limit,
      status: query.status,
      search: query.search,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createNewTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description } = createTaskSchema.parse(req.body);
    const task = await createTask(req.userId!, title, description);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await getTaskById(req.params.id, req.userId!);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const updateExistingTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = updateTaskSchema.parse(req.body);
    const task = await updateTask(req.params.id, req.userId!, data);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteExistingTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteTask(req.params.id, req.userId!);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const toggleTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await toggleTaskStatus(req.params.id, req.userId!);
    res.json(task);
  } catch (error) {
    next(error);
  }
};
