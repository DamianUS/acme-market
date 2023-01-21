'use strict'
import { listActors, listActors_V0, createActor, createActor_V0, readActor, readActorV0, updateActor, updateActorV0, validateActor, deleteActorV0, deleteActor } from '../controllers/ActorController.js';
export default function (app) {
  
  app.route('/v0/actors')
    .get(listActors_V0)
    .post(createActor_V0)

  /**
   * Get an actor who is clerk (any role)
   *    Required role: Administrator
   * Post an actor
   *    RequiredRoles: None
   *    validated if customer and not validated if clerk
   *
   * @section actors
   * @type get post
   * @url /v1/actors
   * @param {string} role (clerk|administrator|customer)
  */
  app.route('/v1/actors')
    .get(listActors)
    .post(createActor)

  app.route('/v0/actors/:actorId')
    .get(readActorV0)
    .put(updateActorV0)
    .delete(deleteActorV0)

  /**
   * Put an actor
   *    RequiredRoles: to be the proper actor
   * Get an actor
   *    RequiredRoles: to be the proper actor or an Administrator
   *
   * @section actors
   * @type get put
   * @url /v1/actors/:actorId
  */
  app.route('/v1/actors/:actorId')
    .get(readActor)
    .put(updateActor)
    .delete(deleteActor)

  /**
   * Put to Validate a clerk by actorId
   *     RequiredRole: Administrator
   *
   * @section actors
   * @type put
   * @url /v1/actors/:actorId/validate
   * @param {string} actorId
   * */
  app.route('/v1/actors/:actorId/validate')
    .patch(validateActor)
}
