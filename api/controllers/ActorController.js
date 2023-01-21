'use strict'
/* ---------------ACTOR---------------------- */
import Actor from '../models/ActorModel.js'

const listActors_V0 = async (req, res) => {
  try{
    const actors = await Actor.find({})
    res.json(actors)
  }
  catch(err){
    res.send(err)
  }
}

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

const createActor_V0 = async (req, res) => {
  const newActor = new Actor(req.body)
  try{
    const actor = await newActor.save()
    res.json(actor)
  }
  catch(err){
    res.send(err)
  }
}

const createActor = async (req, res) => {
  const newActor = new Actor(req.body)
  // If new_actor is a customer, validated = true;
  // If new_actor is a clerk, validated = false;
  newActor.validated = true
  if ((newActor.role.includes('CLERK'))) {
    newActor.validated = false
  }
  try{
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

const readActorV0 = async (req, res) => {
  try{
    const actor = await Actor.findById(req.params.actorId)
    res.json(actor)
  }
  catch(err){
    res.send(err)
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

const updateActorV0 = async (req, res) => {
  try{
    const actor = await Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true })
    res.json(actor)
  }
  catch(err){
    res.send(err)
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

const deleteActorV0 = async (req, res) => {
  try{
    const actor = await Actor.deleteOne({ _id: req.params.actorId })
    res.json({ message: 'Actor successfully deleted' })
  }
  catch(err){
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

export {listActors, listActors_V0, createActor, createActor_V0, readActor, readActorV0, updateActor, updateActorV0, validateActor, deleteActorV0, deleteActor}