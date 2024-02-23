const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/FSW_lab', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define product schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String
});

// Define Product model
const Product = mongoose.model('Product', productSchema); 

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); 

app.get('/', (req, res) => {
  // Fetch all products from MongoDB
  Product.find({})
    .then(products => {
      res.render('index', { products });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error fetching products');
    });
});

app.get('/products/new', (req, res) => {
  res.render('new');
});

app.post('/products', (req, res) => {
  const { name, price, description } = req.body;
  // Create a new product in MongoDB
  Product.create({ name, price, description })
    .then(product => {
      console.log("New product added:", product);
      res.redirect('/');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error creating product');
    });
});

app.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  // Find product by ID in MongoDB
  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.status(404).send('Product not found');
      }
      res.render('show', { product });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error fetching product');
    });
});

app.get('/products/:id/edit', (req, res) => {
  const productId = req.params.id;
  // Find product by ID in MongoDB
  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.status(404).send('Product not found');
      }
      res.render('edit', { product });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error fetching product');
    });
});

app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const { name, price, description } = req.body;
  // Update product by ID in MongoDB
  Product.findByIdAndUpdate(productId, { name, price, description })
    .then(updatedProduct => {
      if (!updatedProduct) {
        return res.status(404).send('Product not found');
      }
      console.log("Product updated:", updatedProduct);
      res.redirect('/');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error updating product');
    });
});

app.delete('/products/:id', (req, res) => {
  const productId = req.params.id;
  // Delete product by ID in MongoDB
  Product.findOneAndDelete({ _id: productId })
    .then(deletedProduct => {
      if (!deletedProduct) {
        return res.status(404).send('Product not found');
      }
      console.log("Product deleted:", deletedProduct);
      res.redirect('/');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error deleting product');
    });
});

const port = 3012;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
