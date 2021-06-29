const express = require('express');  // This function starts your .js requiring express to be used
const path = require('path');  //talks with our html file 
const app = express();  //This is the function that puts express to use

app.use(express.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html')) //res is a built in body, sendfile being a build in method to send back a file at a specific path
//path.join - join the location of index.html to the current directory
}); //__dirname - always the first argument of the directory at this location (monitoring-interactive)

const port = process.env.PORT || 4413;
app.listen(port, function() {
    console.log(`Server is live on ${port}`)
});