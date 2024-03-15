import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import ApiError from '../utils/ApiError'
import pick from "../utils/Pick";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validate = (schema: any) => (req: Request, __: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorMessage = error.details.map((details: any) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

export default validate;
