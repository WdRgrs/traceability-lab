const express = require('express');  // This function starts your .js requiring express to be used
const path = require('path');  //talks with our html file 
const app = express();  //This is the function that puts express to use

app.use(express.json());

// include and initialize the rollbar library with your access token
var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: '1a35285ff1024ca3a7bec75136e3af89',
  captureUncaught: true,
  captureUnhandledRejections: true
});

// record a generic message and send it to Rollbar
rollbar.log("This is the traceability rollbar.log");



app.get('/error', function(req, res) {
  res.error('error test')
});

app.get('/critical', function(req, res) {
  rollbar.log('user tried click critically..')
  rollbar.critical('this is a critical error')
})


app.get('/', function(req, res) {
    rollbar.log('Hello World');
    
    // res.sendFile(path.join(__dirname, '/public/home.html'))  //this is a broken link and will return 'User tried to access a broken link' to my rollbar account
    rollbar.error('User tried to access a broken link');
    
    res.sendFile(path.join(__dirname, '/public/index.html')) 
    //res is a built in body, sendfile being a build in method to send back a file at a specific path
    //path.join - join the location of index.html to the current directory
  }); //__dirname - always the first argument of the directory at this location (monitoring-interactive)
  
  

  



//Below is the start of Eric's code for practice  
let students = [] // we'll hold any students added here

app.post('/api/student', (req, res) => {
    let {name} = req.body
    name = name.trim()

    const index = students.findIndex((studentName) => { // check if student name exists already
        return studentName === name
    })

    console.log(index)

    try { // using a "try catch" block will handle any generic 500 errors (not necessary, but a good addition)
        if (index === -1 && name !== '') {
            // we'll send responses to the user based upon whether or not they gave us a valid user to add
            // also we'll send information to rollbar so we can keep track of the activity that's happening
            students.push(name)
            rollbar.log('student added successfully', {author: 'riley', type: 'manual'})
            res.status(200).send(students)
        } else if (name === '') {
            rollbar.error('no name given')
            res.status(400).send('must provide a name')
        } else {
            rollbar.error('student already exists')
            res.status(400).send('that student already exists')
        }
    } catch (err) {
        rollbar.error(err)
    }
})
app.use(rollbar.errorHandler()) // // Use the rollbar error handler to send exceptions to your rollbar account for logging





const port = process.env.PORT || 4413;
app.listen(port, function() {
    console.log(`Server is live on ${port}`)
});