import fs from 'fs';
import path from 'path';
import { Request } from 'express';

export default async (
    image: any,
    filePrefix: string,
    filePath: string,
    req: Request
) => {
    const { createReadStream } = await image;

    const newFileName = `${filePrefix}-${Date.now()}.png`;

    const pathName = path.join(__dirname, `${filePath}${newFileName}`);

    const stream = createReadStream();

    await stream.pipe(fs.createWriteStream(pathName));

    return `${req.protocol}://${req.get('host')}/uploads/${
        filePath.split('/')[4]
    }/${newFileName}`;
};
