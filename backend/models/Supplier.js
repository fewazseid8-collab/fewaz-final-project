import mongoose from 'mongoose';
const supplierSchema = new mongoose.Schema({
  supplierId: { type: Number, unique: true, index: true },
  name: { type: String, required: true },
  contact: { type: String },
  address: { type: String },
  tin: { type: String },
}, { timestamps: true });
supplierSchema.pre('save', async function (next) {
  if (this.isNew) {
    const last = await this.constructor.findOne({}, {}, { sort: { supplierId: -1 } });
    this.supplierId = last && last.supplierId ? last.supplierId + 1 : 1;
  }
  next();
});
export default mongoose.model('Supplier', supplierSchema);
