/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from "mongoose";
import { excludedFields } from "../constants";
import { TMeta } from "../modules/user/user.interface";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    console.log("from query==>", this.query);
    const filter = { ...this.query };
    console.log("from filter==>", filter);

    for (const field of excludedFields) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }
    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  search(searchableFields: string[]): this {
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

  sort(): this {
    const sort = this.query.sort || "createdAt";
    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  fields(): this {
    const fields = this?.query?.fields?.split(",")?.join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  pagination(): this {
    const pageNumber = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) ;
    const skip = (pageNumber - 1) * limit;

    this.modelQuery = this.modelQuery.limit(limit).skip(skip);
    return this;
  }

  dateFiltering(): this {
    let fromRaw = this.query.from?.trim() || "2000-01-01T00:00:00.000Z";
    let toRaw = this.query.to?.trim() || new Date().toISOString();


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
  async getMeta() {
    const limit = Number(this.query.limit) || 10;
    const pageNumber = Number(this.query.page) || 1;

    const totalDocuments = await this.modelQuery.model.countDocuments();
  
    const filter = this.modelQuery.getFilter();
    console.log("filtered object",filter)
    const noOfMatchedDocuments = await this.modelQuery.model.countDocuments(
      filter
    );
    const totalPage = Math.ceil(noOfMatchedDocuments / limit);

  

    const meta: TMeta = {
      totalDocuments,
      noOfMatchedDocuments,
      pageNumber,
      totalPage,
      limit,
    };
    return meta;
  }
}
