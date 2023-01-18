'use strict'
/* ---------------ACTOR---------------------- */
import Actor from '../models/ActorModel.js'

const listActors_V0 = (req, res) => {
  Actor.find({}, (err, actors) => {
    if (err) {
      res.send(err)
    } else {
      res.json(actors)
    }
  })
}

const listActors = (req, res) => {
  // Check if the role param exist
  /*
  if (req.query.role) {
    const roleName = req.query.role
  }
  */
  // Adapt to find the actors with the specified role
  Actor.find({}, (err, actors) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(actors)
    }
  })
}

const createActor_V0 = (req, res) => {
  const newActor = new Actor(req.body)
  newActor.save((err, actor) => {
    if (err) {
      res.send(err)
    } else {
      res.json(actor)
    }
  })
}

const createActor = (req, res) => {
  const newActor = new Actor(req.body)
  // If new_actor is a customer, validated = true;
  // If new_actor is a clerk, validated = false;
  if ((newActor.role.includes('CLERK'))) {
    newActor.validated = false
  } else {
    newActor.validated = true
  }
  newActor.save((err, actor) => {
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

const readActorV0 = (req, res) => {
  Actor.findById(req.params.actorId, (err, actor) => {
    if (err) {
      res.send(err)
    } else {
      res.json(actor)
    }
  })
}

const readActor = (req, res) => {
  Actor.findById(req.params.actorId, (err, actor) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(actor)
    }
  })
}

const updateActorV0 = (req, res) => {
  Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, (err, actor) => {
    if (err) {
      res.send(err)
    } else {
      res.json(actor)
    }
  })
}

const updateActor = (req, res) => {
  // Check that the user is the proper actor and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, (err, actor) => {
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

const validateActor = (req, res) => {
  // Check that the user is an Administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  console.log('Validating an actor with id: ' + req.params.actorId)
  Actor.findOneAndUpdate({ _id: req.params.actorId }, { $set: { validated: 'true' } }, { new: true }, (err, actor) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(actor)
    }
  })
}

const deleteActorV0 = (req, res) => {
  Actor.deleteOne({ _id: req.params.actorId }, (err, actor) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json({ message: 'Actor successfully deleted' })
    }
  })
}

export {listActors, listActors_V0, createActor, createActor_V0, readActor, readActorV0, updateActor, updateActorV0, validateActor, deleteActorV0}