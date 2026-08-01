import axios from "axios";

  const API = axios.create({
      baseURL: 'https://www.alphavantage.co/query',
      timeout: 27000  // netlify times out in 30 secs 
  });
  API.interceptors.request.use((config) => {
    console.log("Request:", {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
    });
    return config;
  });


const FYERSAPI = axios.create({
   //   baseURL: 'https://store-stocks.netlify.app/.netlify/functions/netlifystockfyersbridge/api'
  //baseURL: 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api'
  baseURL: 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api'
})
const UPSTOXAPI = axios.create({
   //   baseURL: 'https://store-stocks.netlify.app/.netlify/functions/netlifystockfyersbridge/api'
  //baseURL: 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api'
  baseURL: 'https://192.168.1.101:8000/.netlify/functions/netlifyupstoxbridge/api'
})
const ICICDIRECTAPI = axios.create({
   //   baseURL: 'https://store-stocks.netlify.app/.netlify/functions/netlifystockfyersbridge/api'
  //baseURL: 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api'
  baseURL: 'https://192.168.1.101:8000/.netlify/functions/netlifystockicicidirectbridge/api'
})
//const FYERSAPILOGINURL = 'https://store-stocks.netlify.app/.netlify/functions/netlifystockfyersbridge/api/fyerscallback'
//const FYERSAPINSECSV = 'https://store-stocks.netlify.app';
//const FYERSAPILOGINURL = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyerscallback'
const FYERSAPILOGINURL = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyerscallback'
const FYERSAUTHORISEURL =  'http://192.168.1.2:3001'  // render.com url  'https://fyers-auto-register-onedinaar.onrender.com' 

const FYERSAPIURL = 'https://api-t1.fyers.in/api/v3/generate-authcode'
const FYERSMODALCALLBAKURL = 'https://192.168.1.101:8000'


const FYERSAPITRADEBOOKURL = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyersgettradebook'
const FYERSAPIPOSITIONBOOKURL = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyersgetpositionbook'
const FYERSAPIHOLDINGSURL = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyersgetholdings'
const FYERSAPIORDERBOOKSURL = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyersgetorderbook'
const FYERSAPICANCELORDER = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyerscancelorder'
const FYERSAPIBUYORDER = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyersplacebuyorder'
const FYERSAPISELLORDER = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyersplacesellorder'


const FYERSAPIKYCORDER = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyerskycorder'
const FYERSAPICOMPLYCUBEURL = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/subscribe/complycubeKyc'
const YAHOOCHARTURL = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fetchYahooChart'
//const FYERSAPIKYCORDER = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/subscribe/complycubeKyc'

const FYERSAPITICKERURL = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersticker/api/fyersgetticker'
const FYERSAPITHREESECQUOTE = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersticker/api/fyersgetbsecequote'
const FYERSAPIGETCQUOTE = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersticker/api/fyersgetquote'
const FYERSPYTONAPIBASE = 'https://192.168.1.2:5000'
const FYERSPYTONAPIBASEMONGO = 'https://192.168.1.2:5000'


//const FYERSAPIMARKETFEEDRENDER = 'https://fyersmarketfeed.onrender.com/stream' // ?accessToken=
const FYERSAPIMARKETFEEDRENDER_SOCKET = 'https://rendersocketio-k4d8.onrende6r.com'  // 'https://localhost:9584' // ?accessToken=  'http://localhost:5000/stream' 
const FYERSAPIMARKETFEEDRENDER = 'https://localhost:9384/stream' //'https://fyerstickers.onrender.com/stream' // ?accessToken=  'http://localhost:5000/stream' 

const FYERSAPIORDERSRENDER = 'http://fyersorders.onrender.com/stream' // ?accessToken=
const FYERSAPIPOSITIONSRENDER = 'http://fyers-positions-socket-git.onrender.com/stream' // ?accessToken=
const FYERSAPIMARKETCUSTOMFEED = 'https://fyerstickers.onrender.com/stream' // ?accessToken=

const FYERSAPITICKERACCESTOKEN = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersticker/api/fyersaccesstoken'
const FYERSAPITICKERURLCLOSE = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersticker/api/close'
//const FYERSAPINSECSV = 'https://192.168.1.101:8000';
const FYERSAPINSECSV = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyersgetnsecsv'; 
const BASEREF = 'https://192.168.1.101:8000'; 

const MARKETSPOTEQUITYENPOINT=  "https://192.168.1.2:3065";//    "https://api-nse-india-vbmd.onrender.com";
const MARKETSPOTEQUITYENPOINT1="https://192.168.1.2:3066"; // `https://feedsmain.onrender.com/api`;
const REACT_APP_RAZORORDERANDPAYMENTURL="https://primebackend-sz0b.onrender.com"; //https://192.168.1.101:8000 `https://onedinaar.com`;
const REACT_APP_RAZORORDERANDPAYMENTURL_LOCAL="https://localhost:8000"; // `https://onedinaar.com`;
const REACT_APP_NGROKLOCALHOST="crinkly-trustful-turret.ngrok-free.dev"
const UPSTOXAPILOGINURL = 'https://192.168.1.101:8000/.netlify/functions/netlifyupstoxbridge/api/upstoxauthcallback'
const     TRADE_LOGIN_URL = "https://api.icicidirect.com/apiuser/login?api_key="
  // upstoxsdklogin this is internal may be for later use 
/*const FYERSAPITRADEBOOKURL = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyersgettradebook'
const FYERSAPIPOSITIONBOOKURL = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyersgetpositionbook'
const FYERSAPIHOLDINGSURL = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyersgetholdings'
const FYERSAPIORDERBOOKSURL = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyersgetorderbook'
const FYERSAPICANCELORDER = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyerscancelorder'
const FYERSAPIBUYORDER = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyersplacebuyorder'
const FYERSAPISELLORDER = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersbridge/api/fyersplacesellorder'

const FYERSAPITICKERURL = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersticker/api/fyersgetticker'
const FYERSAPITHREESECQUOTE = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersticker/api/fyersgetbsecequote'

//const FYERSAPIMARKETFEEDRENDER = 'https://fyersmarketfeed.onrender.com/stream' // ?accessToken=
const FYERSAPIMARKETFEEDRENDER = 'https://localhost:9384/stream' // ?accessToken=  'http://localhost:5000/stream' 

const FYERSAPIORDERSRENDER = 'http://localhost:5002/stream' // ?accessToken=
const FYERSAPIPOSITIONSRENDER = 'http://localhost:5003/stream' // ?accessToken=
const FYERSAPIMARKETCUSTOMFEED = 'https://localhost:9555/stream' // ?accessToken=

const FYERSAPITICKERACCESTOKEN = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersticker/api/fyersaccesstoken'
const FYERSAPITICKERURLCLOSE = 'https://192.168.1.101:8000/.netlify/functions/netlifystockfyersticker/api/close'
const FYERSAPINSECSV = 'https://192.168.1.101:8000';

*/



export { API , FYERSAPI ,UPSTOXAPI, ICICDIRECTAPI , FYERSAPILOGINURL , FYERSAPINSECSV , FYERSAPITRADEBOOKURL ,FYERSAPIHOLDINGSURL ,
  FYERSAPICANCELORDER,FYERSAPIBUYORDER,FYERSAPISELLORDER
  ,FYERSAPIORDERBOOKSURL ,FYERSAPITICKERURL , FYERSAPITICKERURLCLOSE ,FYERSAPITICKERACCESTOKEN,FYERSAPITHREESECQUOTE,FYERSAPIGETCQUOTE,
  FYERSAPIMARKETFEEDRENDER , FYERSAPIMARKETCUSTOMFEED,FYERSAPIORDERSRENDER,FYERSAPIPOSITIONSRENDER,
  FYERSAPIPOSITIONBOOKURL, FYERSAPIMARKETFEEDRENDER_SOCKET, FYERSAPICOMPLYCUBEURL, FYERSAPIKYCORDER,

  UPSTOXAPILOGINURL , TRADE_LOGIN_URL , YAHOOCHARTURL , MARKETSPOTEQUITYENPOINT1, MARKETSPOTEQUITYENPOINT , REACT_APP_RAZORORDERANDPAYMENTURL,REACT_APP_RAZORORDERANDPAYMENTURL_LOCAL,
  REACT_APP_NGROKLOCALHOST,
  FYERSAUTHORISEURL , FYERSAPIURL, FYERSMODALCALLBAKURL, BASEREF,FYERSPYTONAPIBASE , FYERSPYTONAPIBASEMONGO
};
