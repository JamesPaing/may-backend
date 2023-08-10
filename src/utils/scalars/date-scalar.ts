const { GraphQLScalarType, Kind } = require('graphql');

const GraphQLDateConfig = {
    name: 'Date',
    description: 'Simple date scalar type',
    serialize: (value: any) => value.getTime(),
    parseValue: (value: any) => new Date(value),
    parseLiteral: (ast: any) => {
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value, 10));
        }
        return null;
    },
};

const GraphQLDate = new GraphQLScalarType(GraphQLDateConfig);

export default GraphQLDate;
