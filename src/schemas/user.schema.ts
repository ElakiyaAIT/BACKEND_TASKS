import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type RoleDocument = User & Document;

@Schema({timestamps:true})
    
export class User{
    @Prop({required:true})
    name:string;

    @Prop({required:true, unique:true})
    email:string;

    @Prop({required:true})
    password:string;
}

export const UserSchema = SchemaFactory.createForClass(User);