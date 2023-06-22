import logo from '../../public/playdex.svg'
import {useState, useEffect} from "react"
import { Link } from 'react-router-dom'
import axios from "axios"

function NavBar(props){
	return (
		<div className="navbar bg-base-100 px-7">
		  <div className="navbar-start">
		    <div className="dropdown">
		      <label tabIndex="0" className="btn btn-ghost btn-circle">
		        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
		      </label>
		      <ul tabIndex="0" className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
		        <li className="sm:invisible visible"><Link to="/video/upload">Upload Video</Link></li>
		      </ul>
		    </div>
		  </div>
		  <div className="navbar-center">
	          <Link to="/"><img className="" src={logo} height="40px" width="40px" loading="lazy"></img></Link>
		  </div>
		  <div className="navbar-end space-x-6">
		    <button className="sm:visible invisible border-2 border-dashed hover:border-solid px-2 py-1 border-[#6902FF] inline rounded space-x-2 hover:scale-95 hover:duration-150">
		    	<Link to="/video/upload">Upload Video</Link>
		    </button>
		    <button className="btn btn-ghost btn-circle">
		      <div className="indicator">
				{(props.authenticated) ? <img className="h-9 w-9 border-2 px-1 rounded-full inline" src={"https://avatars.dicebear.com/api/bottts/:" + props.username +".svg"}></img> : <Link to="/user/login">Log in</Link>}
		      </div>
		    </button>
		  </div>
		</div>
	)
}


export default NavBar