import mongoose from 'mongoose';

const homeSlideSchema = new mongoose.Schema(
  {
    image: {
      url: { type: String, required: true },
      public_id: { type: String },
    },
    title: { type: String },
    subtitle: { type: String },
    ctaText: { type: String },
    link: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const HomeSlide = mongoose.model('HomeSlide', homeSlideSchema);
