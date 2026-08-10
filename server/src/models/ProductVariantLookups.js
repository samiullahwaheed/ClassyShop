import mongoose from 'mongoose';

const lookupSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

export const ProductRam = mongoose.model('ProductRam', lookupSchema);
export const ProductWeight = mongoose.model('ProductWeight', lookupSchema);
export const ProductSize = mongoose.model('ProductSize', lookupSchema);
