const express = require("express");
const router = express.Router();

// Controller
const contactController=require("../controllers/contacts")

/* Middlewares */
const formatRequest = require("../middlewares/formatRequest");
router.use(formatRequest);

router.post("/v1/new_contact", (req, res, next) => {
    let data = { ...req.params, ...req.body, ...req.query };
    data.req = req.data;
    contactController.create(data, (err, result) => {
        let status = 0;

        if (err) {
            status = err.status;
            return res.status(status).send(err);
        }
        status = result.status;
        return res.status(status).send(result);
    });
});

router.patch("/v1/contact/:id", (req, res, next) => {
    let data = { ...req.params, ...req.body, ...req.query };
    data.req = req.data;
    contactController.update(data, (err, result) => {
        let status = 0;

        if (err) {
            status = err.status;
            return res.status(status).send(err);
        }
        status = result.status;
        return res.status(status).send(result);
    });
});

router.delete("/v1/contact/:id", (req, res, next) => {
    let data = { ...req.params, ...req.body, ...req.query };
    data.req = req.data;
    contactController.deleted(data, (err, result) => {
        let status = 0;

        if (err) {
            status = err.status;
            return res.status(status).send(err);
        }
        status = result.status;
        return res.status(status).send(result);
    });
});
router.delete("/v1/bulk/contact/:id", (req, res, next) => {
    let data = { ...req.params, ...req.body, ...req.query };
    data.req = req.data;
    contactController.deleteBulk(data, (err, result) => {
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