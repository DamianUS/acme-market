'use strict'
/* ---------------ACTOR---------------------- */
import Actor from '../models/ActorModel.js'

const listActors = async (req, res) => {
  // Check if the role param exist. Discuss the pros and cons of this implementation and alternatives. Security.
  const filters = {}
  if (req.query.role) {
    filters.role = req.query.role
  }
  try{
    const actors = await Actor.find(filters)
    res.json(actors)
  }
  catch(err){
    res.status(500).send(err)
  }
}

const createActor = async (req, res) => {
  try{
    const newActor = new Actor(req.body)
    const actor = await newActor.save()
    res.json(actor)
  }
  catch(err){
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

const readActor = async (req, res) => {
  try{
    const actor = await Actor.findById(req.params.actorId)
    if(actor){
      res.json(actor)
    }
    else{
      res.status(404).send("Actor not found")
    }
  }
  catch(err){
    res.status(500).send(err)
  }
}

const updateActor = async (req, res) => {
  // Check that the user is the proper actor and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  try{
    const actor = await Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, {new:true})
    if(actor){
      res.json(actor)
    }
    else{
      res.status(404).send("Actor not found")
    }
  }
  catch(err){
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

const validateActor = async (req, res) => {
  // Check that the user is an Administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  try {
    const actor = await Actor.findOneAndUpdate({ _id: req.params.actorId }, { validated: 'true' }, { new: true })
    if (actor) {
      res.json(actor)
    }
    else {
      res.status(404).send("Actor not found")
    }
  }
  catch (err) {
    res.status(500).send(err)
  }
}

const deleteActor = async (req, res) => {
  try {
    const deletionResponse = await Actor.deleteOne({ _id: req.params.actorId })
    if (deletionResponse.deletedCount > 0) {
      res.json({ message: 'Actor successfully deleted' })
    }
    else {
      res.status(404).send("Actor could not be deleted")
    }
  }
  catch (err) {
    res.status(500).send(err)
  }
}

export {listActors, createActor, readActor, updateActor, validateActor, deleteActor}