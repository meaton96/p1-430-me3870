const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const assetsPath = path.resolve(__dirname, '../../client/assets');

const cardsPath = path.resolve(assetsPath, 'cards/webp');

// gets the asset given the request and response objects
const getAsset = (req, res, _path) => {
    const assetParam = req.params.asset.toLowerCase();
    fs.readdir(_path, (err, files) => {
        if (err) {
            res.status(500).send({ message: 'Error reading directory' });
            return;
        }

        const matchingFile = files.find((file) => file.toLowerCase() === assetParam);

        if (!matchingFile) {
            res.status(404).send({ message: 'Asset not found' });
            return;
        }

        const asset = path.resolve(_path, matchingFile);

        fs.stat(asset, (errStat, stats) => {
            if (errStat) {
                res.status(500).send({ message: 'Error reading asset stats' });
                return;
            }

            if (stats.isDirectory()) {
                res.status(400).send({ message: 'Requested asset is a directory' });
                return;
            }

            res.sendFile(asset, (errr) => {
                if (errr) {
                    res.status(500).send({ message: 'Error sending asset' });
                }
            });
        });
    });
};

// GET request to /api/assets/cards to list all file names in the /assets/cards/webp directory
router.get('/card-images', (req, res) => {
    // Read the files in the cards directory
    fs.readdir(cardsPath, (err, files) => {
        if (err) {
            return res.status(500).send({ message: 'Error reading cards directory' });
        }
        // filter out directories
        const cardFiles = files
            .filter((file) => fs.statSync(path.resolve(cardsPath, file)).isFile());

        res.status(200).send({
            message: 'List of card assets',
            files: cardFiles,
        });
        return false;
    });
});
// gets the asset at the endpoint /api/assets/:asset
router.get('/:asset', (req, res) => {
    getAsset(req, res, assetsPath);
});
// gets the asset at the endpoint /api/assets/cards/:asset (for card images)
router.get('/cards/:asset', (req, res) => {
    getAsset(req, res, cardsPath);
});
router.all('*', (req, res) => {
    res.status(404).send({ message: 'Invalid endpoint' });
});

module.exports = router;
