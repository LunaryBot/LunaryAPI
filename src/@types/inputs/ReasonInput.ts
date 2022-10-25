import { PunishmentType } from '@prisma/client';
import { InputType, Field } from 'type-graphql';

const nullable = { nullable: true };

@InputType()
class ReasonInput {
    @Field(nullable)
    	id: number;
        
    @Field(type => Number, nullable)
    	days: number | null;
        
    @Field(type => Number, nullable)
    	duration: number | null;

    @Field()
    	text: string;

    @Field(type => [String])
    	keys: string[];

    @Field(type => [String], nullable)
    	types: PunishmentType[];
}

export { ReasonInput };