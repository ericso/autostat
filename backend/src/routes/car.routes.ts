import { Router, RequestHandler } from 'express';
import { CarController } from '@controllers/car.controller';
import { verifyToken } from '@middleware/auth.middleware';

const router = Router();
const carController = new CarController();

// Get all cars for the authenticated user
router.get('/', verifyToken as RequestHandler, carController.getCars);

// Create a new car
router.post('/', verifyToken as RequestHandler, carController.createCar);

// Update a car
router.put('/:id', verifyToken as RequestHandler, carController.updateCar);

// Delete a car
router.delete('/:id', verifyToken as RequestHandler, carController.deleteCar);

export default router; 