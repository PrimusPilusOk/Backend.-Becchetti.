const fs = require('fs');

class Product {
  static lastId = 0;

  constructor(title, description, price, thumbnail, code, stock) {
    this.id = ++Product.lastId;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

class ProductManager {
  constructor(path, products = []) {
    this.path = path;
    this.products = products;
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
  }

  addProduct(productData) {
    const { title, description, price, thumbnail, code, stock } = productData;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("Todos los campos son obligatorios!");
    }

    if (this.products.some(product => product.code === code)) {
      throw new Error("El código ya está en uso!");
    }

    const newProduct = new Product(title, description, price, thumbnail, code, stock);
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (!product) {
      console.error("Producto no encontrado!");
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      console.error("Producto no encontrado!");
      return;
    }

    const updatedProduct = { ...this.products[productIndex], ...updatedFields };
    this.products[productIndex] = updatedProduct;
    this.saveProducts();
    return updatedProduct;
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      console.error("Producto no encontrado!");
      return;
    }

    this.products.splice(productIndex, 1);
    this.saveProducts();
  }
}

const productManager = new ProductManager('products.json');

productManager.addProduct({
  title: "producto de prueba",
  description: "producto de prueba",
  price: 200,
  thumbnail: "sin imagen",
  code: "abc123",
  stock: 25
});

console.log("Los productos disponibles son: ", productManager.getProducts());

const product = productManager.getProductById(1);
if (product) {
  console.log("Producto por ID: ", product);
}
