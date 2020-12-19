"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
app.get("/", (req, res) => {
    res.status(200).send("Hello Bros!!!");
});
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening on port ${port}`));
