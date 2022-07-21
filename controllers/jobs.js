const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

//

// get all the jobs associated with the user (not all across the board)
const getAllJobs = async (req, res) => {
	const jobs = await Job.find({ createdBy: req.user.userId }).sort(
		'createdAt'
	);
	res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
	// id parameter is named when you set up the routes (i.e. router.route('/:id'))
	// user comes from the auth middleware
	// params comes from the parameters (i.e. what is entered into the URL)
	const {
		user: { userId },
		params: { id: jobId },
	} = req;

	const job = await Job.findOne({
		_id: jobId,
		createdBy: userId,
	});

	if (!job) {
		throw new NotFoundError(`No job with id ${jobId}`);
	}
	res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req, res) => {
	console.log(req.user.userId);
	req.body.createdBy = req.user.userId;
	const job = await Job.create(req.body);
	res.status(StatusCodes.CREATED).json({ job });
};
const updateJob = async (req, res) => {
	const {
		body: { company, position },
		user: { userId },
		params: { id: jobId },
	} = req;
	if (company === '' || position === '') {
		throw new BadRequestError('Company or Position fields cannot be empty');
	}
	const job = await Job.findByIdAndUpdate(
		{ _id: jobId, createdBy: userId },
		req.body,
		{ new: true, runValidators: true }
	);
	if (!job) {
		throw new NotFoundError(`No job with id ${jobId}`);
	}
	res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
	const {
		user: { userId },
		params: { id: jobId },
	} = req;
	const job = await Job.findByIdAndRemove({
		_id: jobId,
		createdBy: userId,
	});
	if (!job) {
		throw new NotFoundError(`No job with id ${jobId}`);
	}
	res.status(StatusCodes.OK).send();
};

module.exports = {
	getAllJobs,
	getJob,
	createJob,
	updateJob,
	deleteJob,
};
