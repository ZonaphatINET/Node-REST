const express = require("express");
const Sequelize = require("sequelize");
const app = express();

// parse incoming requests
app.use(express.json());

// connect to the database
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: './Database/Project.sqlite'
});

// Define the 'club' model
const Club = sequelize.define('club', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Define the 'player' model
const Player = sequelize.define('player', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Define the 'playdata' model
const Playdata = sequelize.define('playdata', {
    idclubs: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    idplayer: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
});
  
// Create the tables if they don't exist
sequelize.sync();

// route to get all clubs
app.get("/clubs", (req, res) => {
  Club.findAll().then(clubs => {
    res.json(clubs);
  }).catch(err => {
    res.status(500).send(err);
  });
});

// route to get all players
app.get("/players", (req, res) => {
  Player.findAll().then(players => {
    res.json(players);
  }).catch(err => {
    res.status(500).send(err);
  });
});

// route to get all playdata
app.get("/playdata", (req, res) => {
  Playdata.findAll().then(playdata => {
    res.json(playdata);
  }).catch(err => {
    res.status(500).send(err);
  });
});

// route to create a new club
app.post("/clubs", (req, res) => {
    Club.create(req.body).then(club => {
      res.send(club);
    }).catch(err => {
      res.status(500).send(err);
    });
  });
  
  // route to update a club
  app.put("/clubs/:id", (req, res) => {
    Club.findByPk(req.params.id).then(club => {
      if (!club) {
        res.status(404).send('Club not found');
      } else {
        club.update(req.body).then(() => {
          res.send(club);
        }).catch(err => {
          res.status(500).send(err);
        });
      }
    }).catch(err => {
      res.status(500).send(err);
    });
  });
  
  // route to delete a club
  app.delete("/clubs/:id", (req, res) => {
    Club.findByPk(req.params.id).then(club => {
      if (!club) {
        res.status(404).send('Club not found');
      } else {
        club.destroy().then(() => {
          res.send({});
        }).catch(err => {
          res.status(500).send(err);
        });
      }
    }).catch(err => {
      res.status(500).send(err);
    });
  });
  
  // route to create a new player
  app.post("/players", (req, res) => {
    Player.create(req.body).then(player => {
      res.send(player);
    }).catch(err => {
      res.status(500).send(err);
    });
  });
  
  // route to update a player
  app.put("/players/:id", (req, res) => {
    Player.findByPk(req.params.id).then(player => {
      if (!player) {
        res.status(404).send('Player not found');
      } else {
        player.update(req.body).then(() => {
          res.send(player);
        }).catch(err => {
          res.status(500).send(err);
        });
      }
    }).catch(err => {
      res.status(500).send(err);
    });
  });
  
  // route to delete a player
  app.delete("/players/:id", (req, res) => {
    Player.findByPk(req.params.id).then(player => {
      if (!player) {
        res.status(404).send('Player not found');
      } else {
        player.destroy().then(() => {
          res.send({});
        }).catch(err => {
          res.status(500).send(err);
        });
      }
    }).catch(err => {
      res.status(500).send(err);
    });
  });
  
  // route to create new playdata
  app.post("/playdata", (req, res) => {
    const { idclub, idplayer } = req.body;
    Club.findByPk(idclub).then(club => {
      if (!club) {
        res.status(404).send('Club not found');
      } else {
        Player.findByPk(idplayer).then(player => {
          if (!player) {
            res.status(404).send('Player not found');
          } else {
            Playdata.create({ 
              idclub: club.id,
              idplayer: player.id
            }).then(data => {
              res.send(data);
            }).catch(err => {
              res.status(500).send(err);
            });
          }
        }).catch(err => {
          res.status(500).send(err);
        });
      }
    }).catch(err => {
      res.status(500).send(err);
    });
  });
  
  // route to update playdata
  app.put("/playdata/:id", (req, res) => {
    const { idclub, idplayer } = req.body;
    Playdata.findByPk(req.params.id).then(data => {
      if (!data) {
        res.status(404).send('Playdata not found');
      } else {
        Club.findByPk(idclub).then(club => {
          if (!club) {
            res.status(404).send('Club not found');
          } else {
            Player.findByPk(idplayer).then(player => {
              if (!player) {
                res.status(404).send('Player not found');
              } else {
                data.update({ 
                  idclub: club.id, 
                  idplayer: player.id 
                }).then(() => {
                  res.send(data);
                }).catch(err => {
                  res.status(500).send(err);
                });
              }
            }).catch(err => {
              res.status(500).send(err);
            });
          }
        }).catch(err => {
          res.status(500).send(err);
        });
      }
    }).catch(err => {
      res.status(500).send(err);
    });
  });
  
  // route to delete playdata
  app.delete("/playdata/:id", (req, res) => {
    Playdata.findByPk(req.params.id).then(data => {
      if (!data) {
        res.status(404).send('Playdata not found');
      } else {
        data.destroy().then(() => {
          res.send({});
        }).catch(err => {
          res.status(500).send(err);
        });
      }
    }).catch(err => {
      res.status(500).send(err);
    });
  });

// start the server
const port = process.env.PORT || 5300;
app.listen(port, () => { console.log(`Listening on port ${port}...`); });
