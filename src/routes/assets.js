const express = require('express');
const path = require('path');

const router = express.Router();
const assetsPath = path.resolve(__dirname, '../../assets');


router.get('/assets/:asset', (req, res) => {
    const { asset } = req.params;
    res.sendFile(path.resolve(assetsPath, asset));
});