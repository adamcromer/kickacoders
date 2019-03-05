var db = require("../models");
var passport = require("../config/passport");
// console.log(db)
module.exports = function(app) {
  ///
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json("user");
  });

  // Route for signing up a user
  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
        // res.status(422).json(err.errors[0].message);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      res.json({
        name: req.user.name,
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  /// Group Routes
  // Create a new group
  app.post("/api/groups", function(req, res) {
    db.Group.create(req.body).then(function(dbGroup) {
   console.log(db.Group, db.User)
      res.json(dbGroup);
    });
  });

  app.post("/api/group-user", function(req, res) {
    db.GroupUser.create(req.body).then(function(dbGroupUser) {
      res.json(dbGroupUser);
    });
  });

  /// Get all groups associated with user
  app.get("/api/groups", function(req, res) {
    db.Group.findAll({}).then(function(dbGroup) {
      res.json(dbGroup);
    });
  });

  app.delete("/api/groups/:id", function(req, res) {
    db.Group.destroy({ where: { id: req.params.id } }).then(function(dbGroup) {
      res.json(dbGroup);
    });
  });

  // Event Routes
  // Get all events
  app.get("/api/events", function(req, res) {
    db.Event.findAll({}).then(function(dbEvent) {
      res.json(dbEvent);
    });
  });

  // Create a new event
  app.post("/api/events", function(req, res) {
    db.Event.create(req.body).then(function(dbEvent) {
      res.json(dbEvent);
    });
  });

  // Delete an example by id
  app.delete("/api/event/:id", function(req, res) {
    db.Event.destroy({ where: { id: req.params.id } }).then(function(dbEvent) {
      res.json(dbEvent);
    });
  });
};
