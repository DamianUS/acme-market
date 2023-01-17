'use strict'
/* ---------------ACTOR---------------------- */
const mongoose = require('mongoose')
const Actor = mongoose.model('Actors')

exports.list_all_actors_v0 = function (req, res) {
  Actor.find({}, function (err, actors) {
    if (err) {
      res.send(err)
    } else {
      res.json(actors)
    }
  })
}

exports.list_all_actors = function (req, res) {
  // Check if the role param exist
  /*
  if (req.query.role) {
    const roleName = req.query.role
  }
  */
  // Adapt to find the actors with the specified role
  Actor.find({}, function (err, actors) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(actors)
    }
  })
}

exports.create_an_actor_v0 = function (req, res) {
  const newActor = new Actor(req.body)
  newActor.save(function (err, actor) {
    if (err) {
      res.send(err)
    } else {
      res.json(actor)
    }
  })
}

exports.create_an_actor = function (req, res) {
  const newActor = new Actor(req.body)
  // If new_actor is a customer, validated = true;
  // If new_actor is a clerk, validated = false;
  if ((newActor.role.includes('CLERK'))) {
    newActor.validated = false
  } else {
    newActor.validated = true
  }
  newActor.save(function (err, actor) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(actor)
    }
  })
}

exports.read_an_actor_v0 = function (req, res) {
  Actor.findById(req.params.actorId, function (err, actor) {
    if (err) {
      res.send(err)
    } else {
      res.json(actor)
    }
  })
}

exports.read_an_actor = function (req, res) {
  Actor.findById(req.params.actorId, function (err, actor) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(actor)
    }
  })
}

exports.update_an_actor_v0 = function (req, res) {
  Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
    if (err) {
      res.send(err)
    } else {
      res.json(actor)
    }
  })
}

exports.update_an_actor = function (req, res) {
  // Check that the user is the proper actor and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(actor)
    }
  })
}

exports.validate_an_actor = function (req, res) {
  // Check that the user is an Administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  console.log('Validating an actor with id: ' + req.params.actorId)
  Actor.findOneAndUpdate({ _id: req.params.actorId }, { $set: { validated: 'true' } }, { new: true }, function (err, actor) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(actor)
    }
  })
}

exports.delete_an_actor_v0 = function (req, res) {
  Actor.deleteOne({ _id: req.params.actorId }, function (err, actor) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json({ message: 'Actor successfully deleted' })
    }
  })
}
