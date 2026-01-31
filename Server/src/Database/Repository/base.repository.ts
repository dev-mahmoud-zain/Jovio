import { MongooseUpdateQueryOptions, PopulateOptions, ProjectionType, Types, UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { Model, HydratedDocument, CreateOptions, QueryFilter, QueryOptions } from "mongoose";

import * as mongodb from "mongodb";
import {  Injectable } from "@nestjs/common";

@Injectable()
export abstract class DatabaseRepository<TRawDocument, TDocument = HydratedDocument<TRawDocument>> {
    protected constructor(
        protected readonly model: Model<TRawDocument>
    ) { }


    async create({
        data,
        options,
    }: {
        data: Partial<TRawDocument>[]
        options?: CreateOptions | undefined;
    }): Promise<TDocument[] | undefined> {

        return await this.model.create(data as any, options) as unknown as TDocument[];
    }

    async findOne({
        filter,
        select,
        options,
        getFreezed = false
    }: {
        filter: QueryFilter<TRawDocument>;
        select?: string | readonly string[] | Record<string, number | boolean | string | object>;
        options?: QueryOptions<TRawDocument>;
        getFreezed?: boolean
    }) {


        const finalFilter = getFreezed
            ? filter
            : {
                ...filter,
                freezedAt: { $exists: false },
                freezedBy: { $exists: false },
            };

        const doc = this.model.findOne(finalFilter).select(select || '');

        if (options?.lean) {
            doc.lean(options.lean);
        }

        if (options?.populate) {
            doc.populate(options.populate as PopulateOptions | PopulateOptions[]);
        }

        return await doc.exec() as unknown as TDocument | null;
    }

    async find({
        filter,
        projection,
        options
    }: {
        filter?: QueryFilter<TRawDocument>,
        projection?: ProjectionType<TRawDocument>,
        options?: QueryOptions<TRawDocument> & mongodb.Abortable
    }) {
        return this.model.find(filter, projection, options)
    }

    async findById({
        id,
        projection,
        options
    }: {
        id: Types.ObjectId | string,
        projection?: ProjectionType<TRawDocument>,
        options?: QueryOptions<TRawDocument>
    }) {
        return this.model.findById(id, projection, options)
    }




    async updateOne({
        filter,
        update,
        options
    }: {
        filter: QueryFilter<TRawDocument>,
        update: UpdateQuery<TRawDocument>,
        options?: (mongodb.UpdateOptions & MongooseUpdateQueryOptions<TRawDocument>) | null
    }) {
        const updateWithVersion = {
            ...update,
            $inc: { ...(update.$inc || {}), __v: 1 }
        };
        return this.model.updateOne(filter, updateWithVersion, options)
    }

    async updateMany({
        filter,
        update,
        options
    }: {
        filter: QueryFilter<TRawDocument>,
        update: UpdateQuery<TRawDocument>,
        options?: (mongodb.UpdateOptions & MongooseUpdateQueryOptions<TRawDocument>) | null
    }): Promise<UpdateWriteOpResult> {

        const updateWithVersion = {
            ...update,
            $inc: { ...(update.$inc || {}), __v: 1 }
        };

        return this.model.updateMany(filter, updateWithVersion, options)
    }

}