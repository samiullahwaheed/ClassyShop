import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Category } from './models/Category.js';
import { Product } from './models/Product.js';
import { HomeSlide } from './models/HomeSlide.js';
import { Banner } from './models/Banner.js';
import { slugify } from './utils/slugify.js';
import mongoose from 'mongoose';

const CATEGORIES = [
  { name: 'Fashion', image: 'https://res.cloudinary.com/demo/image/upload/v1/classyshop/seed/fashion.png' },
  { name: 'Bags', image: 'https://res.cloudinary.com/demo/image/upload/v1/classyshop/seed/bags.png' },
  { name: 'Footwear', image: 'https://res.cloudinary.com/demo/image/upload/v1/classyshop/seed/footwear.png' },
  { name: 'Groceries', image: 'https://res.cloudinary.com/demo/image/upload/v1/classyshop/seed/groceries.png' },
  { name: 'Wellness', image: 'https://res.cloudinary.com/demo/image/upload/v1/classyshop/seed/wellness.png' },
  { name: 'Jewellery', image: 'https://res.cloudinary.com/demo/image/upload/v1/classyshop/seed/jewellery.png' },
  { name: 'Beauty', image: 'https://res.cloudinary.com/demo/image/upload/v1/classyshop/seed/beauty.png' },
  { name: 'Electronics', image: 'https://res.cloudinary.com/demo/image/upload/v1/classyshop/seed/electronics.png' },
];

const PRODUCTS = [
  {
    name: "POWRTRIP Men Lightly Washed Distressed Slim Fit Jeans",
    brand: 'POWRTRIP',
    categoryName: 'Fashion',
    price: 999,
    oldPrice: 1050,
    stock: 65433,
    isFeatured: true,
    sizes: ['S', 'M', 'L'],
    images: ['https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800'],
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966.",
  },
  {
    name: "AVAASA MIX N' MATCH Women's Embroidered Suit",
    brand: "AVAASA MIX N' MATCH",
    categoryName: 'Fashion',
    price: 1150,
    oldPrice: 1250,
    stock: 5432,
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=800'],
    description: 'Elegant embroidered suit crafted from premium fabric with intricate detailing.',
  },
  {
    name: 'Rnn Saree New Pakhi Lata Silk Saree',
    brand: 'RNN Saree',
    categoryName: 'Fashion',
    price: 1999,
    oldPrice: 2050,
    stock: 5432,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'],
    description: 'Traditional silk saree with rich pallu design, perfect for festive occasions.',
  },
  {
    name: 'XLERATE Men Lace-Up Shoes',
    brand: 'XLERATE',
    categoryName: 'Footwear',
    price: 1250,
    oldPrice: 999,
    stock: 5432,
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800'],
    description: 'Durable lace-up shoes designed for everyday comfort and style.',
  },
  {
    name: 'Shoe Lab Silver Sandals for Women',
    brand: 'Shoe Lab',
    categoryName: 'Footwear',
    price: 1050,
    oldPrice: 999,
    stock: 65432,
    images: ['https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=800'],
    description: 'Stylish silver sandals with a comfortable footbed for all-day wear.',
  },
  {
    name: "Lay's Classic Salted Potato Chips 51g",
    brand: "Lay's",
    categoryName: 'Groceries',
    price: 99,
    oldPrice: 105,
    stock: 5432,
    images: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800'],
    description: 'Crispy, classic salted potato chips - a perfect anytime snack.',
  },
  {
    name: 'XOVEE Women Blue Shoulder Bag',
    brand: 'XOVEE',
    categoryName: 'Bags',
    price: 1650,
    oldPrice: 1500,
    stock: 11578,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'],
    description: 'Spacious shoulder bag with adjustable strap, ideal for daily use.',
  },
  {
    name: 'NoiseFit Twist Go Smart Watch with Black Link Strap',
    brand: 'Noise',
    categoryName: 'Electronics',
    price: 2150,
    oldPrice: 1850,
    stock: 54322,
    rams: ['4GB', '8GB'],
    images: ['https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800'],
    description: 'Smartwatch with fitness tracking, heart-rate monitoring, and a vivid display.',
  },
];

async function seed() {
  await connectDB();
  console.log('Connected. Seeding...');

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    HomeSlide.deleteMany({}),
    Banner.deleteMany({}),
  ]);

  await User.create({
    name: 'Samiullah Waheed',
    email: 'samiullahwaheed786@gmail.com',
    password: 'sami123',
    role: 'admin',
    emailVerified: true,
  });

  const categoryDocs = await Category.insertMany(
    CATEGORIES.map((c, i) => ({
      name: c.name,
      slug: slugify(c.name),
      image: { url: c.image },
      level: 0,
      showOnHomeStrip: true,
      order: i,
    }))
  );
  const categoryByName = new Map(categoryDocs.map((c) => [c.name, c]));

  await Product.insertMany(
    PRODUCTS.map((p) => ({
      name: p.name,
      slug: slugify(p.name),
      description: p.description,
      brand: p.brand,
      category: categoryByName.get(p.categoryName)._id,
      price: p.price,
      oldPrice: p.oldPrice,
      stock: p.stock,
      isFeatured: !!p.isFeatured,
      sizes: p.sizes || [],
      rams: p.rams || [],
      images: p.images.map((url) => ({ url })),
      rating: { average: 5, count: 0 },
    }))
  );

  await HomeSlide.insertMany([
    {
      image: { url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600' },
      title: 'Quality Freshness Guaranteed!',
      subtitle: 'Only this week. Don’t miss...',
      ctaText: 'Shop Now',
      order: 0,
    },
  ]);

  await Banner.insertMany([
    {
      image: { url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200' },
      title: 'Big saving days sale',
      order: 0,
    },
  ]);

  console.log('Seed complete.');
  console.log('Admin login: samiullahwaheed786@gmail.com / sami123');
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
