const taskController = {
    getAllTasks: async (req, res) => {
        try {
            const { catalyst } = res.locals;
            const userId = req.user.user_id;
            const zcql = catalyst.zcql();

            const taskItems = await zcql
                .executeZCQLQuery(
                    `SELECT ROWID,title,description,status FROM TaskItems WHERE userId = '${userId}'`
                )
                .then((rows) =>
                    rows.map((row) => ({
                        id: row.TaskItems.ROWID,
                        title: row.TaskItems.title,
                        description: row.TaskItems.description,
                        status: row.TaskItems.status,
                    }))
                );
            res.status(200).send({
                status: 'success',
                data: {
                    taskItems,
                },
            });
        } catch (err) {
            res.status(500).send({
                status: 'failure',
                message: "We're unable to process the request.",
            });
        }
    },

    getTask: async (req, res) => {
        try {
            const { ROWID } = req.params;
            const { catalyst } = res.locals;
            const userId = req.user.user_id;
            const zcql = catalyst.zcql();
            const taskItem = await zcql
                .executeZCQLQuery(
                    `SELECT ROWID,title,description,status FROM TaskItems WHERE ROWID = '${ROWID}' AND userId = '${userId}'`
                )
                .then((rows) =>
                    rows.map((row) => ({
                        id: row.TaskItems.ROWID,
                        title: row.TaskItems.title,
                        description: row.TaskItems.description,
                        status: row.TaskItems.status,
                    }))
                );
            if (taskItem.length === 0) {
                return res.status(404).send({
                    status: 'failure',
                    message: 'Task not found.',
                });
            }
            res.status(200).send({
                status: 'success',
                data: {
                    taskItem: taskItem[0],
                },
            });
        } catch (err) {
            res.status(500).send({
                status: 'failure',
                message: "We're unable to process the request.",
            });
        }
    },

    addTask: async (req, res) => {
        try {
            const { title, description } = req.body;
            const { catalyst } = res.locals;
            const userId = req.user.user_id;
            const table = catalyst.datastore().table('TaskItems');
            const { ROWID: id } = await table.insertRow({
                title,
                description,
                status: "pending",
                userId,
            });
            res.status(200).send({
                status: 'success',
                data: {
                    taskItem: {
                        id,
                        title,
                        description,
                        status: "pending",
                        userId,
                    },
                },
            });
        } catch (err) {
            console.log(err);
            res.status(500).send({
                status: 'failure',
                message: "We're unable to process the request.",
            });
        }
    },

    updateTask: async (req, res) => {
        try {
            const { ROWID } = req.params;
            const { title, description, status } = req.body;
            const { catalyst } = res.locals;
            const userId = req.user.user_id;
            const table = catalyst.datastore().table('TaskItems');

            const taskItem = await table.getRow(ROWID);

            if (!taskItem) {
                return res.status(404).send({
                    status: 'failure',
                    message: 'Task not found.',
                });
            }

            await table.updateRow({
                ROWID,
                title: title || taskItem.title,
                description: description || taskItem.description,
                status: status || taskItem.status,
                userId,
            });

            res.status(200).send({
                status: 'success',
                data: {
                    taskItem: {
                        id: ROWID,
                        title: title || taskItem.title,
                        description: description || taskItem.description,
                        status: status || taskItem.status,
                        userId,
                    },
                },
            });
        } catch (err) {
            console.log(err);
            res.status(500).send({
                status: 'failure',
                message: "We're unable to process the request.",
            });
        }
    },

    deleteTask: async (req, res) => {
        try {
            const { ROWID } = req.params;
            const { catalyst } = res.locals;
            const table = catalyst.datastore().table('TaskItems');
            await table.deleteRow(ROWID);
            res.status(200).send({
                status: 'success',
                data: {
                    taskItem: {
                        id: ROWID,
                    },
                },
            });
        } catch (err) {
            console.log(err);
            res.status(500).send({
                status: 'failure',
                message: "We're unable to process the request.",
            });
        }
    },
};

module.exports = taskController;
