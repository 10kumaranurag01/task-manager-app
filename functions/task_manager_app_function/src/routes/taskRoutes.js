const express = require('express');
const taskController = require('../controllers/taskController');
const { validateAddTask, validateUpdateTask } = require('../validations/taskValidation');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware)

router.get('/all', taskController.getAllTasks);
router.get('/:ROWID', taskController.getTask);
router.post('/add', validateAddTask, taskController.addTask);
router.put('/edit/:ROWID', validateUpdateTask, taskController.updateTask);
router.delete('/:ROWID', taskController.deleteTask);

module.exports = router;
