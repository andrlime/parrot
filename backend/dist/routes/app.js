"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const conn_1 = tslib_1.__importDefault(require("../db/conn"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
const crypto_1 = require("crypto");
const console_1 = require("console");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const Judge_1 = require("../Judge");
dotenv_1.default.config();
const router = express_1.default.Router();
const dbo = conn_1.default;
const [username, password] = [process.env.EMAIL_USERNAME || "", process.env.EMAIL_PASSWORD || ""];
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: { user: username, pass: password },
});
// if it works
router.route("/test").get((_, res) => {
    res.json({ status: "No API key" });
});
// auth
// new auth
router.route("/authy").post((req, res) => {
    const dbConnect = dbo.getDb();
    const un = req.body.username;
    const pw = req.body.password;
    const hash = (0, crypto_1.createHash)("sha256").update(`${un}${pw}`).digest("hex");
    dbConnect
        .collection("auth")
        .insertOne({ username: un, password: hash }, (err, resp) => {
        if (err)
            throw err;
        res.json({ result: hash, status: `Created account ${un}` }); // usernames are not exclusive until i implement that
    });
});
router.route("/authy/:un/:pw").get((req, res) => {
    const dbConnect = dbo.getDb();
    const un = req.params.un;
    const pw = req.params.pw;
    const hash = (0, crypto_1.createHash)("sha256").update(`${un}${pw}`).digest("hex");
    dbConnect
        .collection("auth")
        .findOne({ username: un, password: hash }, (err, result) => {
        if (err)
            throw err;
        if (result) {
            res.json({ result: 1, status: `Found account ${req.params.un}` });
        }
        else {
            res.json({ result: -1, status: `Not valid account` });
        }
    });
});
// key -> boolean
router.route("/auth/:key").get((req, res) => {
    if (req.params.key === process.env.PASSWORD) {
        res.json({ status: "Correct Password", auth: true });
    }
    else {
        res.json({ status: "Incorrect Password", auth: false });
    }
});
// get one judge
// key, string -> Judge
router
    .route("/get/judge/:apikey/:judgeId")
    .get((req, res) => {
    const dbConnect = dbo.getDb();
    if (!req.params.apikey) {
        res.json({ status: "No API key" });
    }
    else if (!req.params.judgeId) {
        res.json({ status: "No judge given" });
    }
    else {
        if (req.params.apikey !== process.env.APIKEY) {
            res.json({ status: "Incorrect API key" });
        }
        else {
            dbConnect
                .collection("judges")
                .findOne({ _id: new mongodb_1.ObjectId(req.params.judgeId) }, (err, result) => {
                if (err)
                    throw err;
                res.json({ result, status: `Found judge ${req.params.judgeId}` });
            });
        }
    }
});
router.route("/get/judge/:apikey/").get((req, res) => {
    res.json({ status: "No judge given" });
});
// get all judges
// key -> [Judge]
router.route("/get/alljudges/:apikey").get((req, res) => {
    const dbConnect = dbo.getDb();
    if (!req.params.apikey) {
        res.json({ status: "No API key" });
    }
    else {
        if (req.params.apikey !== process.env.APIKEY) {
            res.json({ status: "Incorrect API key" });
        }
        else {
            dbConnect
                .collection("judges")
                .find({})
                .toArray((err, result) => {
                if (err)
                    throw err;
                res.json({ result, status: `Found all judges` });
            });
        }
    }
});
// create judge
// Judge -> void
router.route("/create/judge").post((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const dbConnect = dbo.getDb();
    if (!req.body.apikey) {
        res.json({ status: "No API key" });
    }
    else {
        if (req.body.apikey !== process.env.APIKEY) {
            res.json({ status: "Incorrect API key" });
        }
        else {
            const judge = {
                name: req.body.name,
                email: req.body.email,
                evaluations: [],
                paradigm: ""
            };
            dbConnect
                .collection("judges")
                .insertOne(judge, (err, resp) => {
                if (err)
                    throw err;
                res.json({ result: resp, status: `Created judge ${judge.name}` });
            });
        }
    }
}));
// add evaluation
// Judge UUID -> void
router
    .route("/update/judge/:apikey/:judgeid")
    .post((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const dbConnect = dbo.getDb();
    if (!req.params.apikey) {
        res.json({ status: "No API key" });
    }
    else {
        if (req.params.apikey !== process.env.APIKEY) {
            res.json({ status: "Incorrect API key" });
        }
        else {
            const query = { _id: new mongodb_1.ObjectId(req.params.judgeid) };
            const newEvaluation = {
                tournamentName: req.body.tName,
                divisionName: req.body.dName || "N/A",
                roundName: req.body.rName,
                isPrelim: req.body.isPrelim,
                isImprovement: req.body.isImprovement,
                decision: req.body.decision,
                comparison: req.body.comparison,
                citation: req.body.citation,
                coverage: req.body.coverage,
                bias: req.body.bias,
                weight: req.body.weight,
                date: new Date(),
            };
            dbConnect
                .collection("judges")
                .findOne(query, (err, result) => {
                if (err)
                    throw err;
                // i have that judge now
                const judgeEvalsCurrent = result.evaluations;
                judgeEvalsCurrent.push(newEvaluation);
                dbConnect
                    .collection("judges")
                    .updateOne(query, { $set: { evaluations: judgeEvalsCurrent } }, (error2, resp) => {
                    if (error2)
                        throw error2;
                    res.json({
                        result: resp,
                        status: `Updated judge ${req.params.judgeid}`,
                    });
                });
            });
        }
    }
}));
// routes to delete
router
    .route("/delete/judge/:apikey")
    .delete((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    // body: judge id
    const dbConnect = dbo.getDb();
    if (!req.params.apikey) {
        res.json({ status: "No API key" });
    }
    else {
        if (req.params.apikey !== process.env.APIKEY) {
            res.json({ status: "Incorrect API key" });
        }
        else {
            const query = { _id: new mongodb_1.ObjectId(req.body.judgeid) };
            dbConnect
                .collection("judges")
                .deleteOne(query, (err, obj) => {
                if (!err)
                    res.json({ status: `Deleted judge ${req.body.judgeid}` });
            });
        }
    }
}));
router
    .route("/delete/evaluation/:apikey")
    .delete((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    // body: judge id, eval index
    const dbConnect = dbo.getDb();
    if (!req.params.apikey) {
        res.json({ status: "No API key" });
    }
    else {
        if (req.params.apikey !== process.env.APIKEY) {
            res.json({ status: "Incorrect API key" });
        }
        else {
            const query = { _id: new mongodb_1.ObjectId(req.body.judgeid) };
            dbConnect
                .collection("judges")
                .findOne(query, (err, result) => {
                if (err)
                    throw err;
                // i have that judge now
                const judgeEvalsCurrent = result.evaluations;
                const j = [];
                for (let i = 0; i < judgeEvalsCurrent.length; i++) {
                    if (i !== req.body.index) {
                        j.push(judgeEvalsCurrent[i]);
                    }
                }
                dbConnect
                    .collection("judges")
                    .updateOne(query, { $set: { evaluations: j } }, (error2, resp) => {
                    if (error2)
                        throw error2;
                    res.json({
                        result: resp,
                        status: `Deleted evaluation ${req.body.index} of judge ${req.body.judgeid}`,
                    });
                });
            });
        }
    }
}));
router
    .route("/get/alleval")
    .post((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const dbConnect = dbo.getDb();
    if (!req.body.apikey) {
        res.json({ status: "No API key" });
    }
    else {
        if (req.body.apikey !== process.env.APIKEY) {
            res.json({ status: "Incorrect API key" });
        }
        else {
            const email = req.body.email;
            (0, console_1.assert)(email);
            // Now, pull all judges and create a spreadsheet
            dbConnect
                .collection("judges")
                .find({})
                .toArray((err, result) => {
                if (err)
                    throw err;
                // Found all judges!
                let resultString = "id,judgeName,date,tournament,division,round,prelim,improvement,decision,comparison,citation,coverage,bias,weight\n";
                const judges = result;
                for (const j of judges) {
                    const ev = j.evaluations;
                    for (const evalu of ev) {
                        resultString += `${j._id},${j.name},${evalu.date.toString()},${evalu.tournamentName},${evalu.divisionName},${evalu.roundName},${evalu.isPrelim},${evalu.isImprovement},${evalu.decision},${evalu.comparison},${evalu.citation},${evalu.coverage},${evalu.bias},${evalu.weight}\n`;
                    }
                }
                let overallResultString = "id,judgeName,email,decision,comparison,citation,coverage,bias,avg,stdev,z\n";
                for (const j of judges) {
                    overallResultString += `${j._id},${j.name},${j.email},${(0, Judge_1.computeMeanDecision)(j)},${(0, Judge_1.computeMeanComparison)(j)},${(0, Judge_1.computeMeanCitation)(j)},${(0, Judge_1.computeMeanCoverage)(j)},${(0, Judge_1.computeMeanBias)(j)},${(0, Judge_1.computeMean)(j)},${(0, Judge_1.computeStdev)(j) || 0},${(0, Judge_1.computeZ)(j, judges)}\n`;
                }
                overallResultString += `OVERALL,,,${Math.round(1000 * (judges.reduce((accum, current) => accum + (0, Judge_1.computeMeanDecision)(current), 0) / judges.length)) / 1000},${Math.round(1000 * (judges.reduce((accum, current) => accum + (0, Judge_1.computeMeanComparison)(current), 0) / judges.length)) / 1000},${Math.round(1000 * (judges.reduce((accum, current) => accum + (0, Judge_1.computeMeanCitation)(current), 0) / judges.length)) / 1000},${Math.round(1000 * (judges.reduce((accum, current) => accum + (0, Judge_1.computeMeanCoverage)(current), 0) / judges.length)) / 1000},${Math.round(1000 * (judges.reduce((accum, current) => accum + (0, Judge_1.computeMeanBias)(current), 0) / judges.length)) / 1000},${Math.round(1000 * (judges.reduce((accum, current) => accum + (0, Judge_1.computeMean)(current), 0) / (judges.filter((e) => e.evaluations.length > 0).length))) / 1000},,,`;
                // Use Nodemailer to send an email
                transporter.sendMail({
                    from: `"Andrew Li" <${process.env.EMAIL_USERNAME}>`,
                    to: `${email} <${email}>`,
                    cc: 'Andrew Li <andrewli2048+debate@gmail.com>',
                    subject: "NHSDLC Judge Evaluation System Export",
                    html: `You have successfully exported all evaluations at ${new Date().toISOString()}. We have attached a spreadsheet.
              `,
                    attachments: [
                        {
                            filename: `detailed_export_${new Date().toISOString()}.csv`,
                            content: resultString
                        },
                        {
                            filename: `summary_export_${new Date().toISOString()}.csv`,
                            content: overallResultString
                        }
                    ]
                }).then(() => {
                    res.json({ status: "Okay" });
                }).catch((error) => {
                    res.json({ status: "Not okay" });
                });
            });
        }
    }
}));
// update paradigm
// add evaluation
// Judge UUID -> void
router
    .route("/update/paradigm/:apikey/:judgeid")
    .post((req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const dbConnect = dbo.getDb();
    if (!req.params.apikey) {
        res.json({ status: "No API key" });
    }
    else {
        if (req.params.apikey !== process.env.APIKEY) {
            res.json({ status: "Incorrect API key" });
        }
        else {
            const query = { _id: new mongodb_1.ObjectId(req.params.judgeid) };
            const updParadigm = req.body.paradigm;
            if (updParadigm || req.body.updated) {
                // has a paradigm
                dbConnect
                    .collection("judges")
                    .updateOne(query, { $set: { paradigm: updParadigm, options: req.body.options } }, (error2, resp) => {
                    if (error2)
                        throw error2;
                    res.json({
                        result: resp,
                        status: `Updated judge ${req.params.judgeid}`,
                    });
                });
            }
            else {
                dbConnect
                    .collection("judges")
                    .updateOne(query, { $set: { options: req.body.options } }, (error2, resp) => {
                    if (error2)
                        throw error2;
                    res.json({
                        result: resp,
                        status: `Updated judge ${req.params.judgeid}`,
                    });
                });
            }
        }
    }
}));
module.exports = router;
exports.default = router;
//# sourceMappingURL=app.js.map