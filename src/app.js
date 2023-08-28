

import express from 'express';
import ProductManager from './ProductManager'; 

const app = express();
const productManager = new ProductManager('products.json');

app.get('/products', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const products = limit ? productManager.getProducts().slice(0, limit) : productManager.getProducts();
  res.json(products);
});

app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.listen(8080, () => console.log('Servidor corriendo en el puerto 8080'));

