"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_Trainer = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const trainer_1 = require("./trainer");
const time_slot_1 = require("./time_slot");
let User_Trainer = class User_Trainer {
};
exports.User_Trainer = User_Trainer;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], User_Trainer.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], User_Trainer.prototype, "trainer_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], User_Trainer.prototype, "timeSlot_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, user => user.user_trainers),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_1.User)
], User_Trainer.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => trainer_1.Trainer, trainer => trainer.user_trainers),
    (0, typeorm_1.JoinColumn)({ name: "trainer_id" }),
    __metadata("design:type", trainer_1.Trainer)
], User_Trainer.prototype, "trainer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => time_slot_1.TimeSlot),
    (0, typeorm_1.JoinColumn)({ name: "timeSlot_id" }),
    __metadata("design:type", time_slot_1.TimeSlot)
], User_Trainer.prototype, "timeSlot", void 0);
exports.User_Trainer = User_Trainer = __decorate([
    (0, typeorm_1.Entity)()
], User_Trainer);
//# sourceMappingURL=user_trainer.js.map