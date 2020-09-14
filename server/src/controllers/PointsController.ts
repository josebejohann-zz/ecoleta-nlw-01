import { Request, Response } from 'express';
import db from '../database/connection';

export default class PointsController {
  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await db.transaction();

    try {
      const insertedIds = await trx('points').insert({
        image: 'image-fake',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
      });

      const point_id = insertedIds[0];

      const pointItems = items.map((item_id: number) => {
        return {
          item_id,
          point_id,
        };
      });

      await trx('point_items').insert(pointItems);

      await trx.commit();

      return response.status(201).send();
    } catch (err) {
      await trx.rollback();

      return response
        .status(400)
        .send({ error: 'Error while trying to create a new point.' });
    }
  }
}
