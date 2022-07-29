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
const passport_1 = __importDefault(require("passport"));
const db_1 = __importDefault(require("../database/db"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
router.post('/admin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: 'success' });
}));
router.post('/getuserdetails', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = req.body.cookie;
    if (userID != 'unauthenticated') {
        const result = yield db_1.default.query(`SELECT * FROM costumers WHERE uniqueid = '${userID}'`);
        res.json({ user: result.rows[0] });
    }
    else {
        res.json({ user: 'unauthenticated' });
    }
}));
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/error' }), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const username = user.displayName;
        const email = user.emails[0].value;
        const photo = user.photos[0].value;
        try {
            const check = yield db_1.default.query(`SELECT uniqueID FROM costumers WHERE email='${email}'`);
            if (check.rowCount) {
                res.cookie('user', check.rows[0].uniqueid).redirect('http://ochko.website:3000/');
            }
            else {
                const uniqueID = (0, uuid_1.v4)();
                const resp = yield db_1.default.query(`INSERT INTO costumers (username, email, photo, uniqueID) VALUES ('${username}', '${email}', '${photo}', '${uniqueID}')`);
                res.cookie('user', uniqueID).redirect('http://ochko.website:3000/');
            }
        }
        catch (error) {
            console.log(error);
        }
    });
});
exports.default = router;
