"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./entities/user");
const trainer_1 = require("./entities/trainer");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const trainerRoutes_1 = __importDefault(require("./routes/trainerRoutes"));
const user_trainer_1 = require("./entities/user_trainer");
const time_slot_1 = require("./entities/time_slot");
dotenv_1.default.config();
(0, typeorm_1.createConnection)({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [user_1.User, trainer_1.Trainer, user_trainer_1.User_Trainer, time_slot_1.TimeSlot],
}).then(connection => {
    console.log('Connected to database successfully!');
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)("dev"));
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    app.use('/api/users', userRoutes_1.default);
    app.use('/api/trainer', trainerRoutes_1.default);
}).catch(error => {
    console.error('Error connecting to database:', error);
});
//# sourceMappingURL=index.js.map