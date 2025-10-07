"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchableFields = exports.excludedFields = void 0;
exports.excludedFields = ["searchTerm", "sort", "fields", "limit", "page"];
exports.searchableFields = [
    "name",
    "email",
    "type",
    "sources",
    "status",
    "notes",
    "senderEmail",
    "receiverEmail",
    "source"
];
