import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  productId: { type: Number, unique: true, index: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  batch: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  quantity: { type: Number, required: true },
  initialQuantity: { type: Number },
  initialQuantityPacks: { type: Number },
  price: { type: Number, required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  preparation: { type: String },
  dosage: { type: String },
  unitOfMeasure: { type: String },
  location: { type: String },
}, { timestamps: true });
productSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastProduct = await this.constructor.findOne({}, {}, { sort: { productId: -1 } });
    this.productId = lastProduct && lastProduct.productId ? lastProduct.productId + 1 : 1;
  }
  next();
});
export default mongoose.model('Product', productSchema);
