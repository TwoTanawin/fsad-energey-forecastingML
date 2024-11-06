const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const envConfig = `export const environment = {
  production: ${process.env.NODE_ENV === 'production'},
  googleApiKey: "${process.env.GOOGLE_API_KEY}"
};`;

fs.writeFileSync('./src/environments/environment.ts', envConfig);
