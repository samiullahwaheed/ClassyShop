import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    logo: {
      url: { type: String },
      public_id: { type: String },
    },
    siteName: { type: String, default: 'CLASSYSHOP' },
    contactEmail: { type: String },
    contactPhone: { type: String },
  },
  { timestamps: true }
);

siteSettingsSchema.statics.getSingleton = async function getSingleton() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
