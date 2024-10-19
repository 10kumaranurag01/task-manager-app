const catalyst = require('zcatalyst-sdk-node');

async function authMiddleware(req, res, next) {
    try {
        const catalystApp = catalyst.initialize(req);

        const userManagement = catalystApp.userManagement();

        const currentUser = await userManagement.getCurrentUser();

        if (!currentUser || !currentUser.user_id) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({ error: 'Failed to verify user authentication' });
    }
}

module.exports = authMiddleware;
