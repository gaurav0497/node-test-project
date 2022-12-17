const express = require("express");
const router = express.Router();

// Controller
const userController = require("../controllers/users")

/* Middlewares */
const formatRequest = require("../middlewares/formatRequest");
router.use(formatRequest);


router.post("/v1/user/signup", (req, res, next) => {
    let data = { ...req.params, ...req.body, ...req.query };
    data.req = req.data;
    userController.signup(data, (err, result) => {
        let status = 0;

        if (err) {
            status = err.status;
            return res.status(status).send(err);
        }
        status = result.status;
        return res.status(status).send(result);
    });
});

router.post("/v1/user/login", (req, res, next) => {
    let data = { ...req.params, ...req.body, ...req.query };
    data.req = req.data;
    userController.login(data, (err, result) => {
        let status = 0;

        if (err) {
            status = err.status;
            return res.status(status).send(err);
        }
        status = result.status;
        return res.status(status).send(result);
    });
});

router.post("/v1/user/logout", (req, res, next) => {
    let data = { ...req.params, ...req.body, ...req.query };
    data.req = req.data;
    userController.logout(data, (err, result) => {
        let status = 0;

        if (err) {
            status = err.status;
            return res.status(status).send(err);
        }
        status = result.status;
        return res.status(status).send(result);
    });
});

module.exports = router;