const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
	// check header
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new UnauthenticatedError('Authentication invalid');
	}
	// token is everything after "Bearer"
	const token = authHeader.split(' ')[1];

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		// attach the user to the job routes
		req.user = { userId: payload.userId, name: payload.name };
		next();
	} catch (error) {
		throw new UnauthenticatedError('Authentication invalid');
	}
};

module.exports = auth;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTk4Mjk1Nzg4NDQ2ZTA3YjgzM2M3NDkiLCJuYW1lIjoibWFyayIsImlhdCI6MTYzNzM2MjAwOCwiZXhwIjoxNjM5OTU0MDA4fQ.NqvaOnDf65aY1zpM_JPFRnhkgUZfhmbP22MfDxUQ-kU

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTk4Mjk1Nzg4NDQ2ZTA3YjgzM2M3NDkiLCJuYW1lIjoibWFyayIsImlhdCI6MTYzNzM2MjAxNywiZXhwIjoxNjM5OTU0MDE3fQ.zB9bWdgaCiKpruj4eE_DILBvyXAjRlZ-gojt_jxr3kg
