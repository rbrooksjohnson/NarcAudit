const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const config = require('./config/database');

// Connect to Database
mongoose.Promise = global.Promise;

mongoose.connect(config.database, {
    useMongoClient: true
});

// On connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database connection error: ' + err);
});

const app = express();

const users = require('./routes/users');
const drugs = require('./routes/drugs');
const staff = require('./routes/staff');
const facility = require('./routes/facilities');

// Port Number
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/drugs', drugs);
app.use('/staff', staff);
app.use('/facilities', facility);

app.get('/', (req, res) => {
  res.send('Invalid');
});

app.listen(port, () => {
  console.log('Server started on port ' + port);
});