"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { GraphQLScalarType, Kind } = require('graphql');
const GraphQLDateConfig = {
    name: 'Date',
    description: 'Simple date scalar type',
    serialize: (value) => value.getTime(),
    parseValue: (value) => new Date(value),
    parseLiteral: (ast) => {
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value, 10));
        }
        return null;
    },
};
const GraphQLDate = new GraphQLScalarType(GraphQLDateConfig);
exports.default = GraphQLDate;
//# sourceMappingURL=dateScalar.js.map