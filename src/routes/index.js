const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const { custom_css } = require('../utils/swagger-theme.js');
const health = require('../middlewares/health');
const swaggerSpec = require('../swagger_spec');

router.use(health);

const goodHealthResponse = {
    title: "Backend Server",
    health: "ok",
    env: process.env.DB_ENV
};

/**
 * @swagger
 * tags:
 *   - name: "health"
 *     description: "Everything related to healthchecks"
 * definitions:
 *   HealthResponse:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *       service:
 *         type: string
 *       health:
 *         type: string
 *       env:
 *         type: string
 *
 * /users/v1/health:
 *   get:
 *     tags:
 *       - health
 *     description: This should return the health of the user's servcie
 *     responses:
 *       '200':
 *         description: Health status of the service
 *         schema:
 *           $ref: '#/definitions/HealthResponse'
 * /:
 *   get:
 *     tags:
 *       - health
 *     description: This should return the health of the user's servcie
 *     responses:
 *       '200':
 *         description: Health status of the service
 *         schema:
 *           $ref: '#/definitions/HealthResponse'
 */
router.get('/', function (_req, res, _next) {
    res.status(200).send(goodHealthResponse);
});
router.get('/users/v1/health', function (_req, res, _next) {
    res.status(200).send(goodHealthResponse);
});

const options = {
    explorer: false,
    customCss: custom_css
};


router.use('/users/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));
router.get('/users/v1/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

module.exports = router;