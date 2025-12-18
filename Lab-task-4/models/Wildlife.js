/*const mongoose = require("mongoose");
const Counter = require("./Counter");

const wildlifeSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Auto-increment ID before saving
wildlifeSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "wildlifeId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.id = counter.seq;
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("Wildlife", wildlifeSchema);*/

