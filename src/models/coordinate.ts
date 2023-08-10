import mongoose from 'mongoose';

const coordinateSchema = new mongoose.Schema({
    id: Number,
    point: String,
    type: {
        type: String,
        enum: ['user', 'shop'],
    },
});

export const Coordinate = mongoose.model('Coordinate', coordinateSchema);
