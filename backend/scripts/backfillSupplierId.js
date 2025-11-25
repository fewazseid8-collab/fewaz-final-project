import dotenv from 'dotenv';
import path from 'path';
import connectDB from '../config/db.js';
import Supplier from '../models/Supplier.js';
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
const run = async () => {
  try {
    await connectDB();
    console.log('Connected to DB — starting supplierId backfill');
    const maxDoc = await Supplier.findOne({ supplierId: { $exists: true } }).sort({ supplierId: -1 });
    let nextId = maxDoc && maxDoc.supplierId ? maxDoc.supplierId + 1 : 1;
    const missing = await Supplier.find({ supplierId: { $exists: false } }).sort({ createdAt: 1, _id: 1 });
    console.log(`Found ${missing.length} suppliers missing supplierId`);
    for (const s of missing) {
      s.supplierId = nextId++;
      await s.save();
      console.log(`Assigned supplierId ${s.supplierId} to ${s._id}`);
    }
    console.log('Backfill complete');
    process.exit(0);
  } catch (err) {
    console.error('Backfill error:', err);
    process.exit(1);
  }
};
run();
