

var addProducts=require('./models/addProducts');
var addOrder=require('./models/addOrder');
var addFood = require('./models/addFood');
const User = require('./models/user'); // Import User Model Schema

const config = require('../config/database'); // Import database configuration
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
var express=require('express');


var router = require('express').Router();
router.get('/api/addProduct', function(req, res) {

  // use mongoose to get all todos in the database
  addProducts.find(function(err, todos) {

    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err)
      res.send(err);

    res.json(todos); // return all todos in JSON format
  });
});


router.post('/api/addProduct', function(req, res) {

  // create a todo, information comes from AJAX request from Angular
  addProducts.create({
    title : req.body.title,
    price : req.body.price,
    imageUrl: req.body.imageUrl,
    category: req.body.category,
    done : false
  }, function(err, todo) {
    if (err)
      res.send(err);

    // get and return all the todos after you create another
    addProducts.find(function(err, todos) {
      if (err)
        res.send(err);
      res.json(todos);
    });
  });

});

// delete a todo
router.delete('/api/addProduct/:todo_id', function(req, res) {
  addProducts.remove({
    _id : req.params.todo_id
  }, function(err, todo) {
    if (err)
      res.send(err);

    // get and return all the todos after you create another
    addProducts.find(function(err, todos) {
      if (err)
        res.send(err)
      res.json(todos);
    });
  });
});


router.get('/api/addOrder', function(req, res) {

  // use mongoose to get all todos in the database
  addOrder.find(function(err, todos) {

    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err)
      res.send(err);

    res.json(todos); // return all todos in JSON format
  });
});


router.post('/api/addOrder', function(req, res) {

  // create a todo, information comes from AJAX request from Angular
  addOrder.create({
    name : req.body.name,
    addressLine1 : req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    city: req.body.city
  }, function(err, todo) {
    if (err)
      res.send(err);

    // get and return all the todos after you create another
    addOrder.find(function(err, todos) {
      if (err)
        res.send(err);
      res.json(todos);
    });
  });

});


router.get('/api/addFood', function(req, res) {

  // use mongoose to get all todos in the database
  addFood.find(function(err, todos) {

    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err)
      res.send(err);

    res.json(todos); // return all todos in JSON format
  });
});


router.post('/api/addFood', function(req, res) {

  // create a todo, information comes from AJAX request from Angular
  addFood.create({
    title : req.body.title,
    price : req.body.price,
    quantity: req.body.quantity,
    totalQuantity: req.body.totalQuantity,
    totalMoney: req.body.totalMoney
  }, function(err, todo) {
    if (err)
      res.send(err);

    // get and return all the todos after you create another
    addFood.find(function(err, todos) {
      if (err)
        res.send(err);
      res.json(todos);
    });
  });

});



  /* ==============
     Register Route
  ============== */
  router.post('/authentication/register', (req, res) => {
    // Check if email was provided
    if (!req.body.email) {
    res.json({ success: false, message: 'You must provide an e-mail' }); // Return error
  } else {
    // Check if username was provided
    if (!req.body.username) {
      res.json({ success: false, message: 'You must provide a username' }); // Return error
    } else {
      // Check if password was provided
      if (!req.body.password) {
        res.json({ success: false, message: 'You must provide a password' }); // Return error
      } else {
        // Create new user object and apply user input
        let user = new User({
          email: req.body.email.toLowerCase(),
          username: req.body.username.toLowerCase(),
          password: req.body.password
        });
        // Save user to database
        user.save((err) => {
          // Check if error occured
          if (err) {
            // Check if error is an error indicating duplicate account
            if (err.code === 11000) {
              res.json({ success: false, message: 'Username or e-mail already exists' }); // Return error
            } else {
              // Check if error is a validation rror
              if (err.errors) {
                // Check if validation error is in the email field
                if (err.errors.email) {
                  res.json({ success: false, message: err.errors.email.message }); // Return error
                } else {
                  // Check if validation error is in the username field
                  if (err.errors.username) {
                    res.json({ success: false, message: err.errors.username.message }); // Return error
                  } else {
                    // Check if validation error is in the password field
                    if (err.errors.password) {
                      res.json({ success: false, message: err.errors.password.message }); // Return error
                    } else {
                      res.json({ success: false, message: err }); // Return any other error not already covered
                    }
                  }
                }
              } else {
                res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
              }
            }
          } else {
            res.json({ success: true, message: 'Acount registered!' }); // Return success
      }
      });
      }
    }
  }
});

  /* ============================================================
     Route to check if user's email is available for registration
  ============================================================ */
  router.get('/authentication/checkEmail/:email', (req, res) => {
    // Check if email was provided in paramaters
    if (!req.params.email) {
    res.json({ success: false, message: 'E-mail was not provided' }); // Return error
  } else {
    // Search for user's e-mail in database;
    User.findOne({ email: req.params.email }, (err, user) => {
      if (err) {
        res.json({ success: false, message: err }); // Return connection error
      } else {
        // Check if user's e-mail is taken
        if (user) {
          res.json({ success: false, message: 'E-mail is already taken' }); // Return as taken e-mail
        } else {
          res.json({ success: true, message: 'E-mail is available' }); // Return as available e-mail
  }
  }
  });
  }
});

  /* ===============================================================
     Route to check if user's username is available for registration
  =============================================================== */
  router.get('/authentication/checkUsername/:username', (req, res) => {
    // Check if username was provided in paramaters
    if (!req.params.username) {
    res.json({ success: false, message: 'Username was not provided' }); // Return error
  } else {
    // Look for username in database
    User.findOne({ username: req.params.username }, (err, user) => {
      // Check if connection error was found
      if (err) {
        res.json({ success: false, message: err }); // Return connection error
      } else {
        // Check if user's username was found
        if (user) {
          res.json({ success: false, message: 'Username is already taken' }); // Return as taken username
        } else {
          res.json({ success: true, message: 'Username is available' }); // Return as vailable username
  }
  }
  });
  }
});

  /* ========
  LOGIN ROUTE
  ======== */
  router.post('/authentication/login', (req, res) => {
    // Check if username was provided
    if (!req.body.username) {
    res.json({ success: false, message: 'No username was provided' }); // Return error
  } else {
    // Check if password was provided
    if (!req.body.password) {
      res.json({ success: false, message: 'No password was provided.' }); // Return error
    } else {
      // Check if username exists in database
      User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: err }); // Return error
        } else {
          // Check if username was found
          if (!user) {
        res.json({ success: false, message: 'Username not found.' }); // Return error
      } else {
        const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
        // Check if password is a match
        if (!validPassword) {
          res.json({ success: false, message: 'Password invalid' }); // Return error
        } else {
          const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); // Create a token for client
          res.json({ success: true, message: 'Success!', token: token, user: { username: user.username } }); // Return success and token to frontend
        }
      }
    }
    });
    }
  }
});

  /* ================================================
  MIDDLEWARE - Used to grab user's token from headers
  ================================================ */
  router.use((req, res, next) => {
    const token = req.headers['authorization']; // Create token found in headers
    // const token = req.headers['']; // Create token found in headers
  // Check if token was found in headers
  if (!token) {
    res.json({ success: false, message: 'No token provided' }); // Return error
  } else {
    // Verify the token is valid
    jwt.verify(token, config.secret, (err, decoded) => {
      // Check if error is expired or invalid
      if (err) {
        res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
      } else {
        req.decoded = decoded; // Create global variable to use in any request beyond
    next(); // Exit middleware
  }
  });
  }
});

  /* ===============================================================
     Route to get user's profile data
  =============================================================== */
  router.get('/authentication/profile', (req, res) => {
    // Search for user in database
    User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
    // Check if error connecting
    if (err) {
      res.json({ success: false, message: err }); // Return error
    } else {
      // Check if user was found in database
      if (!user) {
        res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
      } else {
        res.json({ success: true, user: user }); // Return success, send user object to frontend for profile
      }
    }
  });
});


router.get('*',function (req,res) {    // all other url is *
  res.sendfile('./public/index.html'); // load the single view file
});


module.exports = router;







