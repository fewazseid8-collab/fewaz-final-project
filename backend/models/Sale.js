import mongoose from 'mongoose';
const saleSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  patientName: { type: String },
  preparation: { type: String },
  frequency: { type: String },
  duration: { type: String },
  singleDose: { type: String },
  quantity: { type: Number, required: true },
  quantityPacks: { type: Number },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
export default mongoose.model('Sale', saleSchema);
