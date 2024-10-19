const { z } = require('zod');

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    status: z.string().optional(),
});

const taskUpdateSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.string().optional(),
});

const validateAddTask = (req, res, next) => {
    try {
        taskSchema.parse(req.body);
        next();
    } catch (e) {
        return res.status(400).json({ status: 'failure', message: e.errors });
    }
};

const validateUpdateTask = (req, res, next) => {
    try {
        taskUpdateSchema.partial().parse(req.body);
        next();
    } catch (e) {
        return res.status(400).json({ status: 'failure', message: e.errors });
    }
};

module.exports = { validateAddTask, validateUpdateTask };
