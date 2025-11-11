const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('All Blog Posts');
});

router.get('/post/:id', (req, res) => {
    res.send('You requested blog post with ID: ' + req.params.id);
});

module.exports = router;