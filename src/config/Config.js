const dotenv = require('dotenv');
const minimist = require('minimist');

const options = {
  alias: { 
    e: 'environment',  // Alias para 'environment'
    p: 'persistence'   // Alias para 'persistence'
  },
  default: { 
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',  
    persistence: 'file_system'  // Valor por defecto
  }
};

const args = minimist(process.argv.slice(2), options);
const { environment, persistence } = args;

const envFileName = environment === 'development' ? '.env.development' : '.env.production';
dotenv.config({ path: `./${envFileName}` });

const PORT = environment === 'development' ? 3000 : 8080;

module.exports = {
  PORT: process.env.PORT || PORT,
  MONGO_URL: process.env.MONGO_URL,
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  NODE_ENV: environment.toUpperCase(),  
  PERSISTENCE: persistence.toUpperCase() 
};
