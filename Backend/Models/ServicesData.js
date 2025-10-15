const mongoose = require('mongoose')

const ServicesSchema = new mongoose.Schema({
  ServiceName: { type: String, required: true },
  ServiceDescription: { type: String, required: true },
  ServiceDetail: { type: String, required: true },
  ServiceResult: { type: String, required: true },
  ServiceCost: { type: Number, required: true }
})

module.exports = mongoose.model('ServicesData', ServicesSchema)
