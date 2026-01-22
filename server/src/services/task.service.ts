import { prisma } from '../config/prisma.js';

interface GetTasksParams {
  userId: string;
  page: number;
  limit: number;
  status?: string;
  search?: string;
}

export const getTasks = async ({ userId, page, limit, status, search }: GetTasksParams) => {
  const skip = (page - 1) * limit;

  const where: any = { userId };

  if (status) {
    where.status = status;
  }

  if (search) {
    where.title = { contains: search };
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    data: tasks,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createTask = async (userId: string, title: string, description?: string) => {
  return prisma.task.create({
    data: { userId, title, description },
  });
};

export const getTaskById = async (taskId: string, userId: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw { statusCode: 404, message: 'Task not found' };
  }

  if (task.userId !== userId) {
    throw { statusCode: 404, message: 'Task not found' };
  }

  return task;
};

export const updateTask = async (
  taskId: string,
  userId: string,
  data: { title?: string; description?: string; status?: string }
) => {
  await getTaskById(taskId, userId);

  return prisma.task.update({
    where: { id: taskId },
    data,
  });
};

export const deleteTask = async (taskId: string, userId: string) => {
  await getTaskById(taskId, userId);

  await prisma.task.delete({ where: { id: taskId } });
};

export const toggleTaskStatus = async (taskId: string, userId: string) => {
  const task = await getTaskById(taskId, userId);

  const newStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';

  return prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });
};
