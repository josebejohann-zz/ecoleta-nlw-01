import { Request, Response } from 'express';
import db from '../database/connection';

export default class PointsController {
  async create(request: Request, response: Response) {
    const {
      image,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      state,
      city,
      items,
    } = request.body;

    const trx = await db.transaction();

    try {
      const point = {
        image,
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        state,
        city,
      };

      const insertedIds = await trx('points').insert(point);

      const point_id = insertedIds[0];

      const pointItems = items.map((item_id: number) => {
        return {
          item_id,
          point_id,
        };
      });

      await trx('point_items').insert(pointItems);

      await trx.commit();

      return response.status(201).json({
        id: point_id,
        ...point,
      });
    } catch (err) {
      await trx.rollback();

      console.log(err);

      return response
        .status(400)
        .send({ error: 'Error while trying to create a new point.' });
    }
  }

  async index(request: Request, response: Response) {
    const { state, city, items } = request.query;

    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()));

    const points = await db('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('state', String(state))
      .where('city', String(city))
      .distinct()
      .select('points.*');

    return response.status(200).json(points);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await db('points').where('id', '=', id).first();

    if (!point) {
      return response.status(400).json({ error: 'Point not found.' });
    }

    const items = await db('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', '=', id)
      .select('items.title');

    return response.status(200).json({ point, items });
  }
}
