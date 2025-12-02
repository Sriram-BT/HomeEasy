const express = require('express')
const router = express.Router()
const Services = require('../Models/ServicesData')

router.post('/', async (req, res) => {
  const service = new Services({
    ServiceName: req.body.ServiceName,
    ServiceDescription: req.body.ServiceDescription,
    ServiceDetail: req.body.ServiceDetail,
    ServiceResult: req.body.ServiceResult,
    ServiceCost: req.body.ServiceCost
  })

  try {
    const data = await service.save()
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/getServices',async(req,res)=>{
    try{
        const getServices = await Services.find()
        res.json(getServices)
    }catch(err){
         res.status(500).json({ message: err.message })
    }
})

router.get('/getService/:id', async (req, res) => {
  try {
    const service = await Services.findById(req.params.id)

    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }

    res.json(service)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query || query.trim() === '') {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const results = await Services.find({
      ServiceName: { $regex: `\\b${query}\\b`, $options: 'i' }
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router
