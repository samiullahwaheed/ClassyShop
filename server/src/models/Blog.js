import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String },
    body: { type: String, required: true },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    author: { type: String, default: 'Admin' },
  },
  { timestamps: true }
);

export const Blog = mongoose.model('Blog', blogSchema);
