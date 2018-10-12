import mongoose from 'mongoose';
import { IProduct } from '../interfaces/Product';

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
  lastUpdated: {
    type: 'date',
    required: true
  },
  rank: {
    type: 'array'
  },
  title: {
    type: 'string',
    required: true
  }
 });

 /**
  * Helper method to override the _id with an id property for the external world
  */
schema.methods.toResponse = function toResponse(): IProduct {
  const base = this.toJSON();

  base.id = base._id;
  delete base._id;
  return base;
};

const Product = mongoose.model('Product', schema);
export default Product;
