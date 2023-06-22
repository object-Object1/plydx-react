import { useState, useEffect } from "react"
import Player from '../components/video_player'
import Plyr from 'plyr-react'
import { Link, useParams } from "react-router-dom";
import { Video } from "grommet"
import Lottie from "react-lottie"
import Indicator from "../../public/loading-indicator"
import FlameActive from "../components/flame_svg"
import FlameInActive from "../components/flame_inactive"
import 'plyr-react/dist/plyr.css'
import Nav from '../components/navbar'
import Footer from '../components/footer'
import axios from "axios"


//bring over the current like status of all videos
function videoDetail(){
	const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: Indicator,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };
  const [loggedIn, setLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState({})
	const [keyStroke, setKeystroke] = useState("")
	const [comments, setComment] = useState([])
	const [lit, setLit] = useState(false)
	let [litCount, setLitCount] = useState()
	let [commentCount, setCommentCount] = useState()

	const [isFetching, setIsFetching] = useState(true)
	const [video, setVideoFile] = useState([])
 	let params = useParams();
 	// console.log(params.videoId)
	useEffect(() => {
		axios({
			method: "POST",
			url: `${import.meta.env.VITE_BACKEND_URL}/video_data`,
			withCredentials: true,
			data: {
				videoId: params.videoId
			}
		})
		.then(videoObj => {
			console.log("video object", videoObj)
			setVideoFile(videoObj.data.video)
			setCurrentUser(videoObj.data.user)
			setCommentCount(videoObj.data.video.comment.length)
			setLitCount(videoObj.data.video.lits.length)
		})
		.then(() => {
			setIsFetching(!isFetching)
		})

	}, [])

	useEffect(() => {
		(!currentUser)? void(0): setLoggedIn(true)
		console.log("current user 1:", currentUser)
	}, [currentUser])


	const changeCommentState = (e) => {
		setKeystroke(e.target.value)
	}


	const addComment = (e) => {
		e.preventDefault()
		setCommentCount(commentCount += 1)
		setComment([...comments, keyStroke])
		if(keyStroke.length > 1){
			axios({
				method: "POST",
				url: `${import.meta.env.VITE_BACKEND_URL}/add_comment`,
				data: {
					user: currentUser,
					comment: keyStroke,
					videoId: params.videoId
				}
			})

		}
		else{
			void(0)
		}
		console.log(comments)
	}

	function handleButton(id){
		axios({
			method: "POST",
			url: `${import.meta.env.VITE_BACKEND_URL}/lit`,
			data:{
				user:currentUser,
				videoId: id
			}
		})
		.then(res => {
			if(res.data.added){
				setLit(!lit)
				setLitCount(litCount += 1)
				console.log("added")
				// setVideosList(newObj)
			}
			else{
				console.log("not added")
			}
		})
	}
	// const setComment = (e) => {
	// 	(e.target)
	// 	setKeystroke(e.target.value)
	// 	console.log(keyStroke)
	// }

	if(isFetching){
		return (
			<div className="flex w-full h-screen items-center justify-center">
				<Lottie options={defaultOptions} height={120} width={120}></Lottie>
			</div>
		)

	}
	else{

			return (
				<>
				{(loggedIn) ? <Nav authenticated={loggedIn} username={currentUser.username}/>: <Nav authenticated={loggedIn}/>}
					{/*<Nav authenticated={loggedIn} username={currentUser.username} /> */}
					<div className="flex sm:flex-row h-11/12 flex-col">
					  <div className="sm:h-screen h-auto px-2 w-full flex-col flex justify-center py-4">
					  	<Video controls="over" fit="cover" className="text-red-500">
					  		<source key="video" src={video.video_uri} type="video/mp4" />
					  		 <track
							    key="cc"
							    label="English"
							    kind="subtitles"
							    srcLang="en"
							    default
							  />
					  	</Video>
					    {/*<video width="1280" height="720" controls>
					      <source src={video.video_uri} type="video/mp4"></source>
					    </video>*/}
				    	<div className="flex flex-row space-x-5 items-center m-2">
				    		{(!!currentUser) ? 
						  	  (<button className="flex items-center space-x-1" id={video._id} onClick={() => handleButton(video._id)}>
					          {(!!currentUser) && ((video.lits.includes(currentUser._id.toString() && lit)) ? <FlameActive /> : <FlameInActive/>)}
					          <span id={video._id} className="font-bold text-lg">{(lit) ? litCount :video.lits.length}</span>
					        </button>):

					        (
					        	<button>
					        		<Link to="/user/login">
					        			<FlameInActive />
					        		</Link>
					        	</button>
					        )

					      }


					        <button className="flex items-end space-x-2">
					          <svg width="24" height="24" className="inline" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					            <path d="M4.5 2.8233C4.10218 2.8233 3.72064 2.97202 3.43934 3.23676C3.15804 3.50149 3 3.86055 3 4.23494V15.5281C3 15.9025 3.15804 16.2616 3.43934 16.5263C3.72064 16.791 4.10218 16.9398 4.5 16.9398H7.5C7.89782 16.9398 8.27936 17.0885 8.56066 17.3532C8.84196 17.618 9 17.977 9 18.3514V20.0934L14.229 17.1374C14.4623 17.0071 14.7287 16.9388 15 16.9398H19.5C19.8978 16.9398 20.2794 16.791 20.5607 16.5263C20.842 16.2616 21 15.9025 21 15.5281V4.23494C21 3.86055 20.842 3.50149 20.5607 3.23676C20.2794 2.97202 19.8978 2.8233 19.5 2.8233H4.5ZM0 4.23494C0 3.11177 0.474106 2.03459 1.31802 1.24039C2.16193 0.44618 3.30653 0 4.5 0H19.5C20.6935 0 21.8381 0.44618 22.682 1.24039C23.5259 2.03459 24 3.11177 24 4.23494V15.5281C24 16.6513 23.5259 17.7285 22.682 18.5227C21.8381 19.3169 20.6935 19.7631 19.5 19.7631H15.414L8.274 23.7976C8.04628 23.9267 7.78619 23.9965 7.52037 23.9999C7.25454 24.0033 6.99254 23.9401 6.76118 23.8169C6.52981 23.6937 6.33741 23.5148 6.20366 23.2986C6.06991 23.0823 5.99962 22.8365 6 22.5864V19.7631H4.5C3.30653 19.7631 2.16193 19.3169 1.31802 18.5227C0.474106 17.7285 0 16.6513 0 15.5281V4.23494Z" fill="#6902FF" />
					          </svg>
					          <span className="font-bold text-lg">{video.comment.length}</span>
					        </button>
				    	</div>
					  </div>

					  <div className="sm:w-1/2 w-auto overflow-y-scroll">
					    <div className="m-4 space-y-3 h-11/12">
					      <div className="flex items-center space-x-6 h-11/12">
					        <h1 className="text-2xl font-semibold">Comments</h1>
					        <h2 className="text-xl bg-gray-900 rounded text-white px-3">{commentCount}</h2>
					      </div>
					      <input type="text" onChange={changeCommentState} className="bg-gray-100 px-4 py-[10px] text-sm" placeholder="Leave comment here"></input>
					      {(!loggedIn) ? <button className="px-4 bg-[#6902FF] text-white font-semibold py-[8px]"><Link to="/user/login">Done</Link></button> : <button className="px-4 bg-[#6902FF] text-white font-semibold py-[8px]" onClick={addComment}>Done</button>}
					      <div>
					      	<ul className="space-y-7 mb-7">
					          {video.comment.map(comment => {
					          	return (
					          		<li key={comment._id} className="flex items-center">
							            <img className="h-10 w-10 rounded-full" src={"https://avatars.dicebear.com/api/bottts/:" + comment.user_name + ".svg"}></img>
							            <div className="flex-row mx-2">
							              <p className="font-semibold">{comment.user_name}</p>
							              <p className="text-[13px]">{comment.comment_text}</p>
							            </div>
							        </li>
					          	)
					          })}
					        </ul>
					        {(!!currentUser) &&
						        <ul className="space-y-7">
						          {comments.map(comment => {
						          	return (
						          		<li key={comment} className="flex items-center">
								            <img className="h-10 w-10 rounded-full" src={"https://avatars.dicebear.com/api/bottts/:" + currentUser.username + ".svg"}></img>
								            <div className="flex-row mx-2">
								              <p className="font-semibold">{currentUser.username}</p>
								              <p className="text-[13px]">{comment}</p>
								            </div>
								        </li>
						          	)
						          })}
						        </ul>
						      }
					      </div>
					    </div>
					  </div>
					</div>
				<Footer />	
				</>
			)
		}
	}

export default videoDetail