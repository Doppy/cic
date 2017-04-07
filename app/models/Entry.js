const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrySchema = new Schema({
  // contentType: String,
  contentTypeId: Schema.Types.ObjectId,
  _spaceId: Schema.Types.ObjectId,
  fields: Object,
  status: {
    type: String,
    default: 'draft',
    enum: ['draft', 'published']
  },
  createdAt: { type: 'Date', default: Date.now, required: true },
  updatedAt: { type: 'Date', default: Date.now, required: true },
  publishedAt: 'Date',
  publishedBy: String,
  publishedVersion: Number,
});

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
