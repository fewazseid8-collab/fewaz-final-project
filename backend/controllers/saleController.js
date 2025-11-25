import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('product user');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const createSale = async (req, res) => {
  try {
    const { product, quantityPacks, quantity, user, patientName, preparation, frequency, duration, singleDose } = req.body;
    let prepText = preparation;
    if (!prepText) {
      const prod = await Product.findById(product);
      prepText = prod?.preparation || '';
    }
    const packSizeMatch = String(prepText).match(/(\d+)/);
    const packSize = packSizeMatch ? parseInt(packSizeMatch[1], 10) : 1;
    let unitsToStore = 0;
    let packsToStore = 0;
    if (typeof quantityPacks !== 'undefined') {
      packsToStore = Number(quantityPacks) || 0;
      unitsToStore = packsToStore * packSize;
    } else if (typeof quantity !== 'undefined') {
      unitsToStore = Number(quantity) || 0;
      packsToStore = Math.ceil(unitsToStore / packSize);
    } else {
      throw new Error('quantityPacks or quantity is required');
    }
    const sale = new Sale({ product, quantity: unitsToStore, quantityPacks: packsToStore, user, patientName, preparation: prepText, frequency, duration, singleDose });
    await sale.save();
    await Product.findByIdAndUpdate(product, { $inc: { quantity: -unitsToStore } });
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { product, quantityPacks, quantity, user, patientName, preparation, frequency, duration, singleDose } = req.body;
    const sale = await Sale.findById(id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    let prepText = preparation || sale.preparation;
    if (!prepText) {
      const prod = await Product.findById(product || sale.product);
      prepText = prod?.preparation || '';
    }
    const packSizeMatch = String(prepText).match(/(\d+)/);
    const packSize = packSizeMatch ? parseInt(packSizeMatch[1], 10) : 1;
    let newUnits = sale.quantity;
    let newPacks = sale.quantityPacks || Math.ceil(sale.quantity / packSize);
    if (typeof quantityPacks !== 'undefined') {
      newPacks = Number(quantityPacks) || 0;
      newUnits = newPacks * packSize;
    } else if (typeof quantity !== 'undefined') {
      newUnits = Number(quantity) || 0;
      newPacks = Math.ceil(newUnits / packSize);
    }
    if (product && product.toString() !== sale.product.toString()) {
      await Product.findByIdAndUpdate(sale.product, { $inc: { quantity: sale.quantity } });
      await Product.findByIdAndUpdate(product, { $inc: { quantity: -newUnits } });
    } else if (newUnits !== sale.quantity) {
      const diff = newUnits - sale.quantity;
      await Product.findByIdAndUpdate(sale.product, { $inc: { quantity: -diff } });
    }
    sale.product = product || sale.product;
    sale.quantity = newUnits;
    sale.quantityPacks = newPacks;
    sale.user = user || sale.user;
    sale.patientName = patientName || sale.patientName;
    sale.preparation = prepText || sale.preparation;
    sale.frequency = frequency || sale.frequency;
    sale.duration = duration || sale.duration;
    sale.singleDose = singleDose || sale.singleDose;
    await sale.save();
    const updated = await Sale.findById(id).populate('product user');
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    await Product.findByIdAndUpdate(sale.product, { $inc: { quantity: sale.quantity } });
    await Sale.findByIdAndDelete(id);
    res.json({ message: 'Sale deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
export default { getSales, createSale, updateSale, deleteSale };
