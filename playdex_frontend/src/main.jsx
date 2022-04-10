import React from 'react'
import { render } from 'react-dom'
import './index.css'
import App from './pages/home'
import Login from './pages/login'
import Upload from './pages/upload'
import Register from './pages/signup'
import NotFound from './components/404'
import VideoDetail from './pages/video_detail'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuperTokens, { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import * as reactRouterDom from "react-router-dom";
import Session from "supertokens-auth-react/recipe/session";
import axios from "axios";
import ThirdParty, {Github, Google, Facebook, Apple} from "supertokens-auth-react/recipe/thirdparty";

SuperTokens.init({
    appInfo: {
        appName: "dex",
        apiDomain: "http://localhost:7648",
        websiteDomain: "http://localhost:10081",
        apiBasePath: "/auth",
        websiteBasePath: "/user"
    },
    recipeList: [
        ThirdParty.init({
            signInAndUpFeature: {
                providers: [
                    Github.init(),
                    Google.init(),
                    Facebook.init(),
                    Apple.init(),
                ]
            }
        }),
        Session.init()
    ]
});



Session.addAxiosInterceptors(axios);

async function callAPI() {
    // use axios as you normally do
    let response = await axios.get("https://yourapi.com");
}


// import App from './pages/signup'

// import Home from './pages/home'

// render(
//   <React.StrictMode>
//     {/*<Home />*/}
//     <Upload />
//   </React.StrictMode>,
//   document.getElementById('root')
// )

render(
    <BrowserRouter>
    {/*<Home />*/}
      <Routes>
        {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}
        <Route path="/" element={<App />} />
        <Route path="video/upload" element={<Upload />} />
        <Route path="user/register" element={<Register />} />
        <Route path="user/login" element={<Login />} />
        <Route path="videos/:videoId" element={<VideoDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>,
  document.getElementById('root')
)
