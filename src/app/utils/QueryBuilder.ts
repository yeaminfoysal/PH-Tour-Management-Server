import { Query } from "mongoose";

export class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, string>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    filter(): this {
        const filter = { ...this.query }
        const excludeField = ["searchTerm", "sort", "fields", "page", "limit"]

        excludeField.forEach(field => {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filter[field]
        })
        this.modelQuery = this.modelQuery.find(filter);
        return this
    }

    search(searchableFields: string[]): this {
        const searchTerm = this.query.searchTerm || "";

        const searchQuery = {
            $or: searchableFields.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
        }

        this.modelQuery = this.modelQuery.find(searchQuery)

        return this
    }

}

/*
import { Query } from "mongoose";

export class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, string>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query
        return this.modelQuery
    }
    
}
*/