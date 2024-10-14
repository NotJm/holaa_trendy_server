import { Document } from 'mongoose';
export type IncidentDocument = Incident & Document;
export declare class Incident {
    username: string;
    failedAttempts: number;
    lastAttempt: Date;
    state: string;
    isBlocked: boolean;
    blockExpiresAt: Date;
}
export declare const IncidentSchema: import("mongoose").Schema<Incident, import("mongoose").Model<Incident, any, any, any, Document<unknown, any, Incident> & Incident & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Incident, Document<unknown, {}, import("mongoose").FlatRecord<Incident>> & import("mongoose").FlatRecord<Incident> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
