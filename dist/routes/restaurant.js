"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../database/db"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const option = req.body.option == 'rating' ? 'rating' : 'id';
    const sql = `select * from restaurants ORDER BY ${option} DESC LIMIT '${req.body.limit}'`;
    try {
        const result = yield db_1.default.query(sql);
        res.json({ "message": 'success', restaurants: result.rows });
    }
    catch (error) {
        console.log(error);
        res.json({ "message": "error" });
    }
}));
router.post('/increment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `UPDATE restaurants SET rating = rating + 1 WHERE uniqueid = '${req.body.uniqueid}'`;
    const checkQuery = `SELECT email from costumers where uniqueid = '${req.body.cookie}'`;
    try {
        const check = yield db_1.default.query(checkQuery);
        if (check.rowCount != 0) {
            const result = yield db_1.default.query(query);
            res.json({ message: "success" });
        }
        else {
            res.json({ message: "unauthenticated" });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ message: "error" });
    }
}));
router.post('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `DELETE FROM restaurants WHERE uniqueid = '${req.body.id}'`;
    try {
        const check = yield db_1.default.query(`select admin from costumers where uniqueid = '${req.body.cookie}'`);
        if (check.rows[0].admin) {
            const resp = yield db_1.default.query(query);
            res.json({ message: 'success' });
        }
        else {
            res.json({ message: 'unauthorized' });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ "message": "error" });
    }
}));
router.post('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `select name, uniqueid from restaurants where name Ilike '%${req.body.key}%'`;
    try {
        const result = yield db_1.default.query(query);
        res.json({ "message": "success", "restaurants": result.rows });
    }
    catch (error) {
        console.log(error);
    }
}));
router.get('/edit/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `select * from restaurants where uniqueid='${req.params.id}'`;
    try {
        const result = yield db_1.default.query(query);
        if (result.rowCount != 0) {
            res.json({ message: "success", restaurant: result.rows[0] });
        }
        else {
            res.json({ message: "invalid restaurant" });
        }
    }
    catch (error) {
        res.json({ message: "error" });
    }
}));
router.post('/edit/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const c = req.body;
    const query = `UPDATE restaurants SET name = '${c.name}', phone = '${c.phone}', tags='${c.tags}', description = '${c.description}', photo='${c.photo}', email='${c.email}', branch = '${c.branch}' WHERE uniqueid = '${c.uniqueid}'`;
    try {
        const result = yield db_1.default.query(query);
        res.json({ "message": "success" });
    }
    catch (error) {
        console.log(error);
        res.json({ "message": "error" });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `select * from restaurants WHERE uniqueid='${req.params.id}'`;
    try {
        const result = yield db_1.default.query(sql);
        if (result.rowCount != 0) {
            res.json({ message: "success", restaurant: result.rows[0] });
        }
        else {
            res.json({ message: "error" });
        }
    }
    catch (error) {
        res.json({ message: "unexpected error" });
    }
}));
router.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, photo, tags, branch, description, phone, x, y } = req.body;
    const location = x + ';' + y;
    const uniqueid = (0, uuid_1.v4)();
    try {
        const check = yield db_1.default.query(`select * from costumers where uniqueid = '${req.body.cookie}'`);
        if (check.rowCount != 0 && check.rows[0].admin) {
            const query = yield db_1.default.query(`INSERT INTO restaurants (name, email, photo, phone, tags, branch, description, uniqueid, location) VALUES ('${name}', '${email}','${photo}', '${phone}', '${tags}','${branch}','${description}','${uniqueid}', '${location}')`);
            // const comment = await pool.query(`CREATE TABLE '${uniqueid}' (id SERIAL PRIMARY KEY, username VARCHAR(50) NOT NULL, comment VARCHAR(500) NOT NULL, rating integer DEFAULT 0 NOT NULL, commentorID VARCHAR(50) NOT NULL)`)
            res.json({ "message": "success" });
        }
        else {
            res.json({ "message": "admin privilage required" });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ "message": "error" });
    }
}));
exports.default = router;
