# SCGTest
## Prerequire Application
* npm (https://www.npmjs.com/)
* Google API Key

## For Line Chat
* ngrok (to allow external callback to localhost)
* redis ( default port)
* Line Acc Token
 
## How to run Backend
* enter folder backend
* set .env ( example is on file .env_example)
    * Google API Key
    * Line Acc Token
* RUN > npm install
* RUN > npm start
* RUN > ngrok http 3000 ( allow line callback and u got ngrok url @ this step)
* Set Up Line Webhook with url ${ngrok_url}/scg/linemsg/webhook

## How to run Frontend
* enter folder frontend
* RUN > npm install
* RUN > npm run dev


