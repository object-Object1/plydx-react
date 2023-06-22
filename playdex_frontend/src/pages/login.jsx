import { useState, useEffect } from "react"
import logo from '../../public/playdex.svg'
import axios from "axios"
import _ from 'lodash'
import { useNavigate } from 'react-router-dom'




function userLogin(){

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [authenticated, setAuthenticated] = useState(false)
	const navigate = useNavigate();


	const emailState = (e) => {
		setEmail(e.target.value)
	}


	const passwordState = (e) => {
		setPassword(e.target.value)
	}

	const submitAccount = (e) => {
		e.preventDefault()
		axios({
			method: "POST",
			url: `${import.meta.env.VITE_BACKEND_URL}/u/login`,
			params: {
				email: email,
				password: password
			},
			withCredentials: true

		}).then((res) => console.log(console.log("response",res))).catch((e) => console.log("error", e))
		// axios({method: "GET", data})
		// .then(res => {return res.data})
		// .then(data => {
		// 	if(data.message == "success"){
		// 		console.log(authenticated)
		// 		setAuthenticated(!authenticated)
		// 	}
		// 	else{
		// 		console.log(data.message)				
		// 	}
		// })
		// .catch(err => console.log(err.message))

		setTimeout(() => {
			navigate('/')
		}, 5000)


		// if(authenticated) navigate('/')
		// navigate('/')
		// setSubmitted(!submitted)

	}

	return (
		<>
		<form onSubmit={submitAccount}>
			<img className="h-20 w-20 mx-auto mt-6" src={logo}></img>
			<h1 className="text-4xl font-bold text-center mx-5 my-4">Welcome Back 👋</h1>
			<div className="space-y-5 sm:mx-auto mx-7 flex flex-col items-center"> 
			  <div className="">
			    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Username</label>
			    <div className="flex">
			      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-100 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
			        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style={{fill: "rgba(0, 0, 0, 1)"}}><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10c1.466 0 2.961-.371 4.442-1.104l-.885-1.793C14.353 19.698 13.156 20 12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8v1c0 .692-.313 2-1.5 2-1.396 0-1.494-1.819-1.5-2V8h-2v.025A4.954 4.954 0 0 0 12 7c-2.757 0-5 2.243-5 5s2.243 5 5 5c1.45 0 2.748-.631 3.662-1.621.524.89 1.408 1.621 2.838 1.621 2.273 0 3.5-2.061 3.5-4v-1c0-5.514-4.486-10-10-10zm0 13c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3z"></path></svg>
			      </span>
			      <input onChange={emailState} type="email" id="email" className="rounded-none rounded-r-lg bg-gray-50 shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 px-7 text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Bonnie@example.com"></input>
			    </div>
			  </div>
			  
			  <div>
			    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Password</label>
			    <div className="flex">
			      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
			        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style={{fill: "rgba(0, 0, 0, 1)"}}><path d="M20 12c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z"></path></svg>
			      </span>
			      <input onChange={passwordState} type="password" id="password" className="rounded-none rounded-r-lg bg-gray-50 shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 px-7 block min-w-0 text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Password"></input>
			    </div>
			  </div>
			  <button type="submit" className="bg-[#6902FF] sm:w-64 w-full py-2 font-semibold text-white rounded">Sign In</button>
			   {/* OAUTH */}
			  {/*<span className="font-bold">Or</span>
			  <button className="sm:w-64 w-full flex justify-evenly py-2 border font-semibold rounded">
			    <svg width="30" height="30" className="inline -translate-x-5" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
			      <path d="M27.2569 12.5519H26.25V12.5H15V17.5H22.0644C21.0338 20.4106 18.2644 22.5 15 22.5C10.8581 22.5 7.5 19.1419 7.5 15C7.5 10.8581 10.8581 7.5 15 7.5C16.9119 7.5 18.6513 8.22125 19.9756 9.39937L23.5113 5.86375C21.2788 3.78312 18.2925 2.5 15 2.5C8.09687 2.5 2.5 8.09687 2.5 15C2.5 21.9031 8.09687 27.5 15 27.5C21.9031 27.5 27.5 21.9031 27.5 15C27.5 14.1619 27.4138 13.3438 27.2569 12.5519Z" fill="#FFC107"/>
			      <path d="M3.94116 9.18187L8.04804 12.1938C9.15929 9.4425 11.8505 7.5 14.9999 7.5C16.9118 7.5 18.6512 8.22125 19.9755 9.39937L23.5112 5.86375C21.2787 3.78312 18.2924 2.5 14.9999 2.5C10.1987 2.5 6.03491 5.21062 3.94116 9.18187Z" fill="#FF3D00"/>
			      <path d="M14.9999 27.5C18.2287 27.5 21.1624 26.2644 23.3806 24.255L19.5118 20.9813C18.2147 21.9677 16.6296 22.5013 14.9999 22.5C11.7487 22.5 8.98808 20.4269 7.94808 17.5338L3.87183 20.6744C5.94058 24.7225 10.1418 27.5 14.9999 27.5Z" fill="#4CAF50"/>
			      <path d="M27.2569 12.5519H26.25V12.5H15V17.5H22.0644C21.5714 18.8853 20.6833 20.0957 19.51 20.9819L19.5119 20.9806L23.3806 24.2544C23.1069 24.5031 27.5 21.25 27.5 15C27.5 14.1619 27.4138 13.3438 27.2569 12.5519Z" fill="#1976D2"/>
			    </svg>
			    <span className="-translate-x-6">Sign in with Google</span>
			  </button>*/}

			  <span>Havent created one yet?, <a href="/user/register" className="font-bold">Sign Up</a> </span>

			</div>
		</form>	
		</>
	)
}


export default userLogin