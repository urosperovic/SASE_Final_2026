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
exports.Trainer = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const user_trainer_1 = require("./user_trainer");
const time_slot_1 = require("./time_slot");
let Trainer = class Trainer {
};
exports.Trainer = Trainer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Trainer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trainer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trainer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trainer.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trainer.prototype, "speciality", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_1.User, (user) => user.trainer),
    __metadata("design:type", Array)
], Trainer.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_trainer_1.User_Trainer, (user_trainer) => user_trainer.trainer),
    __metadata("design:type", Array)
], Trainer.prototype, "user_trainers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => time_slot_1.TimeSlot, (timeSlot) => timeSlot.trainer, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Trainer.prototype, "timeSlots", void 0);
exports.Trainer = Trainer = __decorate([
    (0, typeorm_1.Entity)()
], Trainer);
//# sourceMappingURL=trainer.js.map