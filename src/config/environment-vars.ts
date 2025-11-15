import joi from 'joi';
import "dotenv/config";

export type ReturnEnvironmentVars = {
  PORT: number;
}

type ValidationEnvironmentVars = {
  error: joi.ValidationError | undefined,
  value: ReturnEnvironmentVars
}

const validateEnvVars = (vars:NodeJS.ProcessEnv):ValidationEnvironmentVars =>{
  const envSchema = joi.object({
    PORT: joi.number().integer().positive().required()
  }).unknown(true);
  const {error,value} = envSchema.validate(vars, {
    convert: true
  });
  return {error,value};
}

const loadEnvVars = ():ReturnEnvironmentVars => {
    const result = validateEnvVars(process.env);
    if (result.error) {
      throw new Error(result.error.message);
    }
    const value = result.value;
    return{
      PORT: value.PORT
    }
}

const envs = loadEnvVars();
export default envs;