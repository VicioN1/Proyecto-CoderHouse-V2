const dotenv = require('dotenv');
const minimist = require('minimist');

const options = {
  alias: { 
    e: 'environment',  
    p: 'persistence'  
  },
  default: { 
    environment: 'production',  
    persistence: 'file_system' 
  }
};

const args = minimist(process.argv.slice(2), options);
const { environment, persistence } = args;

const envFileName = '.env';
dotenv.config({ path: `./${envFileName}` });

const PORT = 8080;

module.exports = {
  PORT: 8080,
  MONGO_URL: process.env.MONGO_URL,
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  NODE_ENV: environment.toUpperCase(),  
  PERSISTENCE: persistence.toUpperCase() 
};
