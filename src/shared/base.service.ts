import { Type } from "@nestjs/common";
import { Document, FilterQuery, Model } from "mongoose";

export abstract class BaseService<T extends Document> {
    protected model: Model<T>
    
    protected async find_all(filter: FilterQuery<T>): Promise<T[]> {
        return this.model.find(filter).exec();
    }

    protected async find_one(filter: FilterQuery<T>): Promise<T> {
        return this.model.findOne(filter).exec();
    }

    protected async find_by_id(id: string): Promise<T> {
        return this.model.findById(id).exec()
    }

    protected async create(item: T): Promise<T> {
        return (await this.model.create(item)).save();
    }

    protected async update(id: string, item: Type<T>): Promise<T> {
        return this.model.findByIdAndUpdate(id, item, { new: true });
    }

    protected async delete_by_id(id: string): Promise<T> {
        return this.model.findByIdAndDelete(id).exec();
    }

    protected async delete(filter: FilterQuery<T>): Promise<any> {
        return this.model.deleteMany(filter).exec();
    }

} 