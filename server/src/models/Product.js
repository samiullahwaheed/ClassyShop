import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: 'text' },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    brand: { type: String, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    thirdLevelCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0 },
    discountPercent: { type: Number, min: 0, max: 100, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isFeatured: { type: Boolean, default: false },
    images: { type: [imageSchema], default: [] },
    sizes: { type: [String], default: [] },
    weights: { type: [String], default: [] },
    rams: { type: [String], default: [] },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    sales: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.pre('validate', function computeDiscount(next) {
  if (this.oldPrice && this.oldPrice > this.price) {
    this.discountPercent = Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
  } else {
    this.discountPercent = 0;
  }
  next();
});

productSchema.index({ category: 1, subCategory: 1, thirdLevelCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1 });

export const Product = mongoose.model('Product', productSchema);
