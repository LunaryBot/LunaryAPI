import { Field, ID, ObjectType } from 'type-graphql';

import { IGuild } from '../@types';

@ObjectType()
class Guild implements IGuild {
    @Field(_type => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    icon: string;

    @Field({ defaultValue: false })
    access?: boolean;

    @Field(_type => [String])
    features: string[];

    @Field()
    owner: boolean;

    @Field()
    permissions: number;

    @Field()
    permissions_new: string;
}

export default Guild;

