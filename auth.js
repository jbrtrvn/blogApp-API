// [SECTION] Dependencies and Modules
const jwt = require("jsonwebtoken");
require('dotenv').config();

// [SECTION] Token Creation
module.exports.createAccessToken = (user) => {
	console.log(user);
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}
	return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
}

// [SECTION] Token Verification
module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization;

	if (!token) {
		return res.status(401).send({ auth: "Failed. No Token" });
	}

	// Remove "Bearer " prefix if it exists
	if (token.startsWith('Bearer ')) {
		token = token.slice(7);
	}

	jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
		if (err) {
			return res.status(403).send({
				auth: "Failed",
				message: err.message
			});
		} else {
			req.user = decodedToken;
			next();
		}
	});
}


// [SECTION] Admin Verification
module.exports.verifyAdmin = (req, res, next) => {
    console.log('User in verifyAdmin:', req.user);
    if (req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        });
    }
};


// [SECTION] Error Handler
module.exports.errorHandler = (err, req, res, next) => {
	// Log error
	console.error(err);

	const errorMessage = err.message || 'Internal Server Error';
	const statusCode = err.status || 500;

	res.status(statusCode).json({
		error: {
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}
	})
}

// [SECTION] Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
	if (req.user){
		next();
	} else {
		res.sendStatus(401);
	}
}

// [SECTION] Middleware to check if user is the author of the blog post
module.exports.verifyOwnership = (req, res, next) => {
	const userId = req.user.id; // The ID of the authenticated user

	// Assuming `req.blog` contains the blog post object retrieved by `findById`
	if (req.blog.author.toString() !== userId.toString()) {
		return res.status(403).send({
			auth: "Failed",
			message: "You are not authorized to modify this blog post"
		});
	}

	next();
}