const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello from Node.js and Express!');
});

app.listen(port, () => {
    console.log(`Server is runnning at http://localhost:${port}`);
});