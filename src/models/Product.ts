import mongoose from 'mongoose';
import { IProduct } from '../interfaces/Product';

// TODO - can we build this from TypeScript?
const schema = new mongoose.Schema({
  _id: { // just use the ASIN as the _id as it's unique for what we're doing anyway
    type: 'string',
    required: true
  },
  category: {
    type: 'string'
  },
  deleted: {
    type: 'boolean',
    default: false
  },
  dimensions: {
    type: 'string'
  },
  rank: {
    type: 'string'
  },
  title: {
    type: 'string',
    required: true
  }
 });

 /**
  * Helper method to override the _id with an id property for the external world
  */
schema.methods.toResponse = function (): IProduct {
  const base = this.toJSON();

  base.id = base._id;
  delete base._id;
  return base;
}

const Product = mongoose.model('Product', schema);
export default Product;
