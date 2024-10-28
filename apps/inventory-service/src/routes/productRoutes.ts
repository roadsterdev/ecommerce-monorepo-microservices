import { Router } from 'express';
import { updateProductInventory, getProductById, getProducts, placeOrder } from '../controllers/productController';

const router = Router();


router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProductInventory);
router.put('/:id/order', placeOrder);

export default router;
