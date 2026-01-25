import { PopulateOptions } from "mongoose";
import { Model, HydratedDocument, CreateOptions, QueryFilter, QueryOptions } from "mongoose";

export abstract class DatabaseRepository
    <
        TRawDocument,
        TDocument = HydratedDocument<TRawDocument>
    > {


    protected constructor(protected readonly model: Model<TRawDocument>) { }


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


}