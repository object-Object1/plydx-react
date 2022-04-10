import { useState, useEffect } from 'react'
import SuperTokens, { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import * as reactRouterDom from "react-router-dom";
import axios from "axios";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import ThirdParty, {Github, Google, Facebook, Apple} from "supertokens-auth-react/recipe/thirdparty";
import Session from "supertokens-auth-react/recipe/session";

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


function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState([])
  
  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000",
    })
    .then(res => setData(prev => [...data, res.data]))
    .catch(err => console.log('got nothing', err.message))
  }, [])

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" />
          {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}
        </Routes>
      </Router>
    </>
  )
}

export default App
