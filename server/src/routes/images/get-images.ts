import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';



const router = express.Router();



router.get('/images', (request: Request, response: Response): void => {
    try {
        const uploadsPath = path.join(__dirname, '../../../uploads');
        
        if (!fs.existsSync(uploadsPath)) {
            response.json({
                success: true, 
                images: [] 
            });
            return;
        }

        const files = fs.readdirSync(uploadsPath)
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
            })
            .map(file => ({
                filename: file,
                url: `/api/image/${file}`,
                fullUrl: `${request.protocol}://${request.get('host')}/api/image/${file}`
            }));

        response.json({
            success: true, 
            images: files,
            total: files.length
        });
        
    } catch (error) {
        response.status(500).json({ message: 'Server error.', details: error });
        console.error('Error fetching images:', error);
    }
});



router.get('/image/:filename', (request: Request, response: Response): void => {
    try {
        const { filename } = request.params;
        const imagePath = path.join(__dirname, '../../../uploads', filename);

        if (!fs.existsSync(imagePath)) {
            response.status(404).json({ error: 'Image not found' });
            return;
        }

        const ext = path.extname(filename).toLowerCase();
        let contentType = 'image/jpeg';

        switch (ext) {
            case '.png':
                contentType = 'image/png';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.webp':
                contentType = 'image/webp';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
        }

        response.setHeader('Content-Type', contentType);
        response.setHeader('Cache-Control', 'public, max-age=31557600');
        response.sendFile(imagePath);

    } catch (error) {
        response.status(500).json({ error: 'Server error', details: error });
        console.error('Error fetching image:', error);
    }
});



export default router;
