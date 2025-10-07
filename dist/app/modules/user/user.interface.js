"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRequestStatus = exports.IsActive = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["AGENT"] = "AGENT";
})(Role || (exports.Role = Role = {}));
var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "ACTIVE";
    IsActive["INACTIVE"] = "INACTIVE";
    IsActive["BLOCKED"] = "BLOCKED";
})(IsActive || (exports.IsActive = IsActive = {}));
var AgentRequestStatus;
(function (AgentRequestStatus) {
    AgentRequestStatus["NONE"] = "NONE";
    AgentRequestStatus["PENDING"] = "PENDING";
    AgentRequestStatus["APPROVED"] = "APPROVED";
    AgentRequestStatus["REJECTED"] = "REJECTED";
})(AgentRequestStatus || (exports.AgentRequestStatus = AgentRequestStatus = {}));
