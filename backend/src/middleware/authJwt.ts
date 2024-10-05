import { NextFunction, Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config();
const jwtSecret = process.env.EduTrade_JWT_SECRET || 'default-secret-key';

import jwt, { JwtPayload } from "jsonwebtoken";
console.log('JWT Secret:', process.env.EduTrade_JWT_SECRET);

export function verifyToken(
	req: Request,
	res: Response,
	next: NextFunction,
): Response | void {
	/* #swagger.security = [{
		"bearerAuth": []
	}] 
	#swagger.autoHeaders=false
	*/
	let token = req.headers["authorization"];

	if (!token) {
		return res.status(403).send({ message: "No token provided" });
	}

	token = token.split(" ")[1];

	jwt.verify(token, jwtSecret!, (err, decoded) => {
		if (err) {
			return res.status(401).send({
				message: "Unauthorized: " + err.message || "",
			});
		}
		// Set request user id to decoded id in typescript
		req.body.userId = (decoded! as JwtPayload).id;
		next();
	});
}

export default { verifyToken };
