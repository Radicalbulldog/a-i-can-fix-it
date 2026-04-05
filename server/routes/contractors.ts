import { Router, Request, Response } from 'express';
import { findNearbyContractors } from '../lib/contractors.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  const category = req.query.category as string | undefined;

  if (isNaN(lat) || isNaN(lng)) {
    res.status(400).json({ error: 'lat and lng query parameters are required' });
    return;
  }

  const contractors = findNearbyContractors(lat, lng, category);
  res.json(contractors);
});

export default router;
