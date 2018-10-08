import mongoose from 'mongoose';

// TODO - flesh out schema
const schema = new mongoose.Schema({
  title: {
    type: 'string',
    required: true
  }
 });

const Product = mongoose.model('Product', schema);
export default Product;
