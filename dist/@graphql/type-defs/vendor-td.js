"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.vendorTypeDefs = (0, graphql_tag_1.gql) `
    scalar Date
    scalar FileUpload

    type Wallet {
        _id: ID
    }

    type Coordinate {
        _id: ID
    }

    type User {
        _id: ID
        name: String
    }

    type Location {
        type: String
        coordinates: [Float]
    }

    type Vendor {
        id: Int
        _id: ID
        name: String
        address: String
        city: String
        township: String
        password: String
        passwordConfirmation: String
        wallet: Wallet
        items: [Item]
        user: User
        logo: String
        location: Location
        images: [String]
        isActive: Boolean
        type: String
        coordinate: Coordinate
        createdAt: Date
        updatedAt: Date
    }

    type AllVendorsResponse {
        results: Int
        vendors: [Vendor]
    }

    type Distance {
        _id: ID
        name: String
        distance: Float
    }

    input LocationInput {
        type: String
        coordinates: [Float]
    }

    input VendorInput {
        name: String
        address: String
        city: String
        township: String
        password: String
        passwordConfirmation: String
        location: LocationInput
        wallet: ID
        items: [ID]
        user: ID
        logo: FileUpload
        images: [String]
        isActive: Boolean
        type: String
        coordinate: ID
    }

    input QueryString {
        limit: String
        search: String
        page: String
        type: String
    }

    type Query {
        getAllVendors(queryString: QueryString): AllVendorsResponse
        getVendor(_id: ID): Vendor
        getMyVendors(userId: ID): AllVendorsResponse
        getVendorsWithin(
            distance: Float
            latlng: String
            unit: String
        ): AllVendorsResponse
        getDistances(latlng: String, unit: String, vendorIds: [ID]): [Distance]
    }

    type Mutation {
        createVendor(vendor: VendorInput): Vendor
        updateVendor(_id: ID, vendor: VendorInput): Vendor
        deleteVendor(_id: ID): String
    }
`;
//# sourceMappingURL=vendor-td.js.map