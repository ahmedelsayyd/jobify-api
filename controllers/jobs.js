const Job = require('../models/Job')
const {NotFoundError, BadRequestError} = require('../errors')
const {StatusCodes} = require('http-status-codes')


const getAllJobs =  async (req, res, next)=>{
    const jobs = await Job.find({createdBy: req.user.id}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}


const getJob = async (req, res, next)=>{
    const {user:{id: userId}, params:{id:jobId}} = req

    const job = await Job.findOne({createdBy: userId, _id: jobId})

    if(!job) throw new NotFoundError(`Job with id ${jobId} not Found`)

    res.status(StatusCodes.OK).json({job})
}

const createJob = async (req, res, next)=>{
    console.log(req.user)
    req.body.createdBy = req.user.id
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}


const updateJob = async (req, res, next)=>{

    const {user:{id: userId}, params:{id:jobId}, body:{company, position}} = req

    if (company === '' || position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty')
    }

    const job = await Job.findByIdAndUpdate({_id: jobId, createdBy: userId}, req.body, {new: true, runValidators: true})

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })

}

const deleteJob = async (req, res, next)=>{
    const {
        user: { id: userId },
        params: { id: jobId },
      } = req
    
      const job = await Job.findByIdAndRemove({_id: jobId, createdBy: userId})

      if (!job)  throw new NotFoundError(`No job with id ${jobId}`)

      res.status(StatusCodes.OK).send()
}


module.exports ={
    getAllJobs, 
    getJob, 
    createJob,
    updateJob, 
    deleteJob
}