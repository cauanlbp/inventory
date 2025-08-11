import mongoose from 'mongoose';

const TelSystemSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, trim: true },
    type: { type: String, enum: ['WhatsApp Business', 'WhatsApp Pessoal'], required: true },
    consultant: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const TelSystem = mongoose.model('TelSystem', TelSystemSchema);
export default TelSystem;
