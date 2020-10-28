const express = require('express'); // import express
const app = express();
require('dotenv').config(); // now we can use dotenv to run our server

app.get('/', (req, res) => {
    res.send("Server test");
});

const port = process.env.PORT || 8000 

app.listen(port, ()=> {
    console.log(`Server is tunning on port ${port}`);
});