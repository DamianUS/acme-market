'use strict'
import { listActors, createActor, readActor, updateActor, deleteActor } from '../controllers/ActorController.js';
export default function (app) {
  
  app.route('/actors')
    .get(listActors)
    .post(createActor)

  app.route('/actors/:actorId')
    .get(readActor)
    .put(updateActor)
    .delete(deleteActor)
}
