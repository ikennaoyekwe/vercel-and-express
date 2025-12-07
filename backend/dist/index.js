"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_handling_1 = __importDefault(require("./src/utils/error-handling"));
const test_routes_1 = __importDefault(require("./src/routes/test-routes"));
const database_routes_1 = __importDefault(require("./src/routes/database-routes"));
const mongodb_atlas_1 = __importDefault(require("./src/database/mongodb-atlas"));
const app = (0, express_1.default)();
app.set("trust proxy", true);
// ----------- middlewares -----------
app.use(error_handling_1.default);
app.use(express_1.default.json());
// ------------ routes -----------
app.use('/api/tests/', test_routes_1.default);
app.use('/api/database/', database_routes_1.default);
app.use((req, res, next) => {
    res.status(404).send('404 - not found');
});
// ------------ database -----------
(0, mongodb_atlas_1.default)();
// ------------ server listen -----------
app.listen(3000, () => console.log('application ready to use'));
