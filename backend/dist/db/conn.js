"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongodb_1 = require("mongodb");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const CONN_URI = process.env.MONGOURI || "";
const client = new mongodb_1.MongoClient(CONN_URI);
let _db;
exports.default = {
    connectToServer() {
        client.connect((err, db) => {
            // Verify we got a good "db" object
            if (db) {
                _db = db.db("judges");
            }
            return 1;
        });
    },
    getDb() {
        return _db;
    },
};
//# sourceMappingURL=conn.js.map