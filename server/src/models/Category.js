import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    level: { type: Number, enum: [0, 1, 2], default: 0 },
    showOnHomeStrip: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ parentCategory: 1 });

export const Category = mongoose.model('Category', categorySchema);
