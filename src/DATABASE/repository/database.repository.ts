import {
  CreateOptions,
  FilterQuery,
  FlattenMaps,
  HydratedDocument,
  Model,
  MongooseUpdateQueryOptions,
  ProjectionType,
  QueryOptions,
  RootFilterQuery,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';


export abstract class DatabaseRepository<
  TRawDocument,
  TDocument = HydratedDocument<TRawDocument>,
> {
  protected constructor(protected model: Model<TDocument>) {}

  async create({
    data,
    options,
  }: {
    data: Partial<TDocument>[];
    options?: CreateOptions | undefined;
  }): Promise<TDocument[] | undefined> {
    return await this.model.create(data, options);
  }

  async findOne({
    filter,
    select,
    options,
    pranoId,
  }: {
    filter?: RootFilterQuery<TDocument>;
    select?: ProjectionType<TDocument> | null;
    options?: (QueryOptions<TDocument> & { populate?: any }) | null;
    pranoId?: boolean;
  }): Promise<FlattenMaps<TDocument> | TDocument | null> {
    const finalFilter = pranoId
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
      doc.populate(options.populate);
    }

    return await doc.exec();
  }

  async find({
    filter = {},
    projection = null,
    options = {},
    page = 1,
    limit = 10,
    sort = {},
    pranoId,
  }: {
    filter?: FilterQuery<TDocument>;
    projection?: ProjectionType<TDocument> | null;
    options?: QueryOptions;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    pranoId?: boolean;
  }) {
    const finalFilter = pranoId
      ? filter
      : {
          ...filter,
          freezedAt: { $exists: false },
          freezedBy: { $exists: false },
        };

    const skip = (page - 1) * limit;

    const query = this.model.find(finalFilter, projection, {
      ...options,
      sort,
    });

    if (limit) {
      query.skip(skip).limit(limit);
    }

    const [data, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments(finalFilter).exec(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total: total,
      },
    };
  }

  async updateOne(
    filter: FilterQuery<TDocument>,
    updateData: UpdateQuery<TDocument>,
    options?:
      | (MongooseUpdateQueryOptions<TDocument> & { pranoId?: boolean })
      | null,
  ): Promise<UpdateWriteOpResult> {
    const finalFilter = options?.pranoId
      ? filter
      : {
          ...filter,
          freezedAt: { $exists: false },
          freezedBy: { $exists: false },
        };

    if (Array.isArray(updateData)) {
      updateData.push({
        $set: {
          __v: { $add: ['$__v', 1] },
        },
      });

      return await this.model.updateOne(finalFilter, updateData, options);
    }

    return await this.model.updateOne(
      finalFilter,
      {
        ...updateData,
        $inc: {
          ...(updateData.$inc || {}),
          __v: 1,
        },
      },
      options,
    );
  }

  async findOneAndUpdate({
    filter,
    updateData,
    options,
    pranoId,
  }: {
    filter?: RootFilterQuery<TDocument>;
    updateData: UpdateQuery<TDocument>;
    options?: QueryOptions<TDocument> | null;
    pranoId?: boolean;
  }): Promise<TDocument | null> {
    const finalFilter = pranoId
      ? filter
      : {
          ...filter,
          freezedAt: { $exists: false },
          freezedBy: { $exists: false },
        };

    const updatedDoc = await this.model
      .findOneAndUpdate(
        finalFilter,
        {
          ...updateData,
          $inc: {
            ...(updateData.$inc || {}),
            __v: 1,
          },
        },
        {
          ...options,
          new: true,
          returnDocument: 'after',
        },
      )
      .exec();

    return updatedDoc;
  }

  async deleteOne(
    filter: FilterQuery<TDocument>,
    options?: { pranoId?: boolean },
  ) {
    const finalFilter = options?.pranoId
      ? filter
      : {
          ...filter,
          freezedAt: { $exists: false },
          freezedBy: { $exists: false },
        };

    return this.model.deleteOne(finalFilter);
  }

  async deleteMany(
    filter: FilterQuery<TDocument>,
    options?: { pranoId?: boolean },
  ) {
    const finalFilter = options?.pranoId
      ? filter
      : {
          ...filter,
          freezedAt: { $exists: false },
          freezedBy: { $exists: false },
        };

    return this.model.deleteMany(finalFilter);
  }

  async findOneAndDelete({
    filter,
    options,
    pranoId,
  }: {
    filter?: RootFilterQuery<TDocument>;
    options?: QueryOptions<TDocument> | null;
    pranoId?: boolean;
  }): Promise<TDocument | null> {
    const finalFilter = pranoId
      ? filter
      : {
          ...filter,
          freezedAt: { $exists: false },
          freezedBy: { $exists: false },
        };

    const deletedDoc = await this.model
      .findOneAndDelete(finalFilter, options || {})
      .exec();

    return deletedDoc;
  }


  async updateMany(
  filter: FilterQuery<TDocument>,
  updateData: UpdateQuery<TDocument>,
  options?: (MongooseUpdateQueryOptions<TDocument> & { pranoId?: boolean }) | null,
): Promise<UpdateWriteOpResult> {
  // بناء finalFilter زي updateOne
  const finalFilter = options?.pranoId
    ? filter
    : {
        ...filter,
        freezedAt: { $exists: false },
        freezedBy: { $exists: false },
      };

  if (Array.isArray(updateData)) {
    updateData.push({
      $set: {
        __v: { $add: ['$__v', 1] },
      },
    });

    return await this.model.updateMany(finalFilter, updateData, options);
  }

  return await this.model.updateMany(
    finalFilter,
    {
      ...updateData,
      $inc: {
        ...(updateData.$inc || {}),
        __v: 1,
      },
    },
    options,
  );
}



}