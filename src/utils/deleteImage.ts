import fs from 'fs';

export default (image: string, filePath: string) => {
    const fileToDelete = `${__dirname}/${filePath}${image.split('/')[4]}`;

    if (fs.existsSync(fileToDelete)) {
        fs.unlink(fileToDelete, (err) => {
            if (err) throw err;
        });
    }
};
