
# SCGTest  
## Prerequire Application  
* npm (https://www.npmjs.com/)  
* Google API Key  
  
## For Line Chat  
* ngrok (to allow external callback to localhost)  
* redis ( default port)  
* Line Acc Token  
  
## Line Chat Flow  
User State list : blank , searching  
  
### blank state 
the answer is **no**
 - user state change to **blank**   
 - Response Query Msg
the answer is one of **[eat, shop, tour, stay]**
 - user state change to **searching**   
 - Response Query Msg

### searching state
the answer is **no** 
 - user state change to **blank**   
 - Response Query Msg
the answer is anything else
 - user state change to **blank**   
 - Response List of Place

## How to run Backend  
* enter folder backend  
* create and set .env ( example is on file .env_example)  
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