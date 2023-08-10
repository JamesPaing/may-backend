import { gql } from 'graphql-tag';

export const vendorTypeDefs = gql`
    scalar Date

    type Wallet {
        _id: String
    }

    type Coordinate {
        _id: String
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
        logo: String
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

    input VendorInput {
        name: String
        address: String
        city: String
        township: String
        password: String
        passwordConfirmation: String
        wallet: ID
        items: [ID]
        logo: String
        images: [String]
        isActive: Boolean
        type: String
        coordinate: Coordinate
    }

    input QueryString {
        limit: String
        search: String
        page: String
    }

    type Query {
        getAllVendors(queryString: QueryString): AllVendorsResponse
        getVendor(_id: ID): Vendor
    }

    type Mutation {
        createVendor(vendor: VendorInput): Vendor
        updateVendor(_id: ID, vendor: VendorInput): Vendor
        deleteVendor(_id: ID): String
    }
`;
