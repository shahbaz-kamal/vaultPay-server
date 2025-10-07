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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const constants_1 = require("../constants");
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    filter() {
        console.log("from query==>", this.query);
        const filter = Object.assign({}, this.query);
        console.log("from filter==>", filter);
        for (const field of constants_1.excludedFields) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filter[field];
        }
        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }
    search(searchableFields) {
        const searchTerm = this.query.searchTerm || "";
        if (searchTerm) {
            const searchQuery = {
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: "i" },
                })),
            };
            this.modelQuery = this.modelQuery.find(searchQuery);
        }
        return this;
    }
    sort() {
        const sort = this.query.sort || "createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    fields() {
        var _a, _b, _c;
        const fields = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(",")) === null || _c === void 0 ? void 0 : _c.join(" ")) || "";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    pagination() {
        const pageNumber = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (pageNumber - 1) * limit;
        this.modelQuery = this.modelQuery.limit(limit).skip(skip);
        return this;
    }
    dateFiltering() {
        var _a, _b;
        let fromRaw = ((_a = this.query.from) === null || _a === void 0 ? void 0 : _a.trim()) || "2000-01-01T00:00:00.000Z";
        let toRaw = ((_b = this.query.to) === null || _b === void 0 ? void 0 : _b.trim()) || new Date().toISOString();
        if (fromRaw.includes(' ')) {
            fromRaw = fromRaw.replace(' ', '+');
        }
        if (toRaw.includes(' ')) {
            toRaw = toRaw.replace(' ', '+');
        }
        const from = new Date(fromRaw);
        const to = new Date(toRaw);
        if (isNaN(from.getTime())) {
            console.log("Final fromRaw after fix:", fromRaw); // debug
            throw new Error("Invalid 'from' date");
        }
        if (isNaN(to.getTime())) {
            console.log("Final toRaw after fix:", toRaw); // debug
            throw new Error("Invalid 'to' date");
        }
        this.modelQuery = this.modelQuery.find({
            createdAt: { $gte: from, $lte: to },
        });
        return this;
    }
    build() {
        return this.modelQuery;
    }
    getMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalDocuments = yield this.modelQuery.model.countDocuments();
            const limit = Number(this.query.limit) || 10;
            const pageNumber = Number(this.query.page) || 1;
            const totalPage = Math.ceil(totalDocuments / limit);
            const filter = this.modelQuery.getFilter();
            const noOfMatchedDocuments = yield this.modelQuery.model.countDocuments(filter);
            const meta = {
                totalDocuments,
                noOfMatchedDocuments,
                pageNumber,
                totalPage,
                limit,
            };
            return meta;
        });
    }
}
exports.QueryBuilder = QueryBuilder;
