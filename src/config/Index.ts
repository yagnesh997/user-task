import * as dotenv from "dotenv"
import * as path from 'path';
import * as Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object().keys({
  ENV: Joi.string().required().valid('production', 'development', 'staging', 'test'),
  PORT: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  SECRET_KEY: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  FACEBOOK_CLIENT_ID: Joi.string().required(),
  FACEBOOK_CLIENT_SECRET: Joi.string().required()
})
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.ENV,
  port: envVars.PORT,
  secretkey: envVars.SECRET_KEY,
  google_client_id: envVars.GOOGLE_CLIENT_ID,
  google_client_secret: envVars.GOOGLE_CLIENT_SECRET,
  facebook_client_id: envVars.FACEBOOK_CLIENT_ID,
  facebook_client_secret: envVars.FACEBOOK_CLIENT_SECRET
};
