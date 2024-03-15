import { Request, Response } from "express";

import morgan from 'morgan';
import config from './Index';
import logger from './Logger';

morgan.token('message', (__: Request, res: Response) => res.locals.errorMessage || '');

const getIpFormat = () => (config.env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
    skip: (__: Request, res: Response) => res.statusCode >= 400,
    stream: { write: (message: string) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
    skip: (__: Request, res: Response) => res.statusCode < 400,
    stream: { write: (message: string) => logger.error(message.trim()) },
});

export default {
    successHandler,
    errorHandler,
};
