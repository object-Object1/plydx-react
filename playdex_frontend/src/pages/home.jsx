import { Fragment, useState, useEffect } from "react"
import FlameActive from "../components/flame_svg"
import { Dialog, Transition } from '@headlessui/react'
import FlameInActive from "../components/flame_inactive"
import Lottie from "react-lottie"
import Indicator from "../../public/loading-indicator"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { RedditShareButton, TwitterShareButton, FacebookShareButton, FacebookIcon, RedditIcon, TwitterIcon} from "react-share"
import { useNavigate, Link } from 'react-router-dom'
import axios from "axios"



function Home(){

	let [isOpen, setIsOpen] = useState(false)

	const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: Indicator,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

	const [userData, setData] = useState()
	const [loggedIn, setLoggedIn] = useState(false)
	const [isLit, setIsLit] = useState(false)
	// let [litCount, setLitCount] = useState()
	//only an object that has been lit should be here
	const [ litState, setLitState ] = useState()
	const [videosList, setVideosList] = useState([])
	const [obj, setObj] = useState({
		liked: false,
		likeCount: 0
	})
	const [isFetched, setIsFetched] = useState(false)
	const navigate = useNavigate();


	useEffect(() => {
		axios({
			method: "GET",
			url: "http://localhost:3037",
			withCredentials: true
		})

		.then(res => {
			setData(res.data.user)
			setVideosList(res.data.videos)
			const videos = res.data.videos
			if(res.data.user){
				setLoggedIn(!loggedIn)
			}
		})
		.then(() => {
			setIsFetched(!isFetched)
		})

		.catch(err => console.log('error potential causes: a Proxy/VPN or Ip restriction',err.message))
	}, [])



  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }


	function handleButton(id){
		const newObj = videosList.map(video => {
			return (video._id == id) ? {...video, lits: [...video.lits, userData._id.toString()]}: video
		})

		axios({
			method: "POST",
			url: "http://localhost:3037/lit",
			data:{
				user:userData,
				videoId: id
			}
		})
		.then(res => {
			if(res.data.added){
				setVideosList(newObj)
			}
			else{
				console.log("not added")
			}
		})
	}



	if(!isFetched){
		return (
			<div className="flex w-full h-screen items-center justify-center">
				<Lottie options={defaultOptions} height={120} width={120}></Lottie>
			</div>
		)
	}

	else{

			return (
				<> 
					{(loggedIn) ? <Navbar authenticated={loggedIn} username={userData.username}/>: <Navbar authenticated={loggedIn}/>}

					<button>{FlameActive}</button>
					<div className="sm:mx-20 mx-0 my-8">
					  <h1 className="text-5xl font-bold mx-2 xl:-translate-x-12">Top Gameplays</h1>
					</div>
					<div className="flex sm:justify-evenly justify-center items-center xl:justify-start xl:mx-10 mx-0 sm:space-x-11 sm:space-y-0 space-y-3 flex-wrap">
					  {videosList.map((video) => {
					  	return (
						  <div key={video._id} id={video._id} className="h-auto w-72 flex flex-col items-center rounded shadow-md">
						    <div className="h-44 w-full">
						    	<video width="320" height="240">
						    		<source src={video.video_uri} type="video/mp4"></source>
						    	</video>
						    </div>
						    <div className="my-5 w-full">
						    <Link to={'videos/'+video._id} className="mx-4">{video.title}</Link>
						    <span>{obj.liked}</span>
						      <div className="flex justify-end space-x-3 mx-6 my-2">
						      {video.tags.map(tag => {
						      	return (
							        <span key={tag} className="bg-gray-200 text-sm px-2">#{tag}</span>
						      	)
						      })}
						      </div>
						      <div className="flex items-center justify-around">
						      {(!userData) ? (
						        	<button>
						        		<Link to="/user/login">
						        			<FlameInActive />
						        		</Link>
						        	</button>
						         ):

						        (<button className="flex items-center space-x-1" id={video._id} onClick={() => handleButton(video._id)}>
						          { (video.lits.includes(userData)) ? <FlameActive /> : <FlameInActive id={video._id} />}
						          <span id={video._id} className="font-bold text-lg">{video.lits.length}</span>
						        </button>
						        )
						         
						       }
						        <button className="flex items-end space-x-2">
						          <svg width="24" height="24" className="inline" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						            <path d="M4.5 2.8233C4.10218 2.8233 3.72064 2.97202 3.43934 3.23676C3.15804 3.50149 3 3.86055 3 4.23494V15.5281C3 15.9025 3.15804 16.2616 3.43934 16.5263C3.72064 16.791 4.10218 16.9398 4.5 16.9398H7.5C7.89782 16.9398 8.27936 17.0885 8.56066 17.3532C8.84196 17.618 9 17.977 9 18.3514V20.0934L14.229 17.1374C14.4623 17.0071 14.7287 16.9388 15 16.9398H19.5C19.8978 16.9398 20.2794 16.791 20.5607 16.5263C20.842 16.2616 21 15.9025 21 15.5281V4.23494C21 3.86055 20.842 3.50149 20.5607 3.23676C20.2794 2.97202 19.8978 2.8233 19.5 2.8233H4.5ZM0 4.23494C0 3.11177 0.474106 2.03459 1.31802 1.24039C2.16193 0.44618 3.30653 0 4.5 0H19.5C20.6935 0 21.8381 0.44618 22.682 1.24039C23.5259 2.03459 24 3.11177 24 4.23494V15.5281C24 16.6513 23.5259 17.7285 22.682 18.5227C21.8381 19.3169 20.6935 19.7631 19.5 19.7631H15.414L8.274 23.7976C8.04628 23.9267 7.78619 23.9965 7.52037 23.9999C7.25454 24.0033 6.99254 23.9401 6.76118 23.8169C6.52981 23.6937 6.33741 23.5148 6.20366 23.2986C6.06991 23.0823 5.99962 22.8365 6 22.5864V19.7631H4.5C3.30653 19.7631 2.16193 19.3169 1.31802 18.5227C0.474106 17.7285 0 16.6513 0 15.5281V4.23494Z" fill="#6902FF" />
						          </svg>
						          <span className="font-bold text-lg">{video.comment.length}</span>
						        </button>

						        <button onClick={openModal}>
							        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6902FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="{2}">
							          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
							        </svg>
						        </button>
						        {/*modal*/}
									 <Transition appear show={isOpen} as={Fragment}>
						        <Dialog
						          as="div"
						          className="fixed inset-0 z-10 overflow-y-auto"
						          onClose={closeModal}
						        >
						          <div className="min-h-screen px-4 text-center">
						            <Transition.Child
						              as={Fragment}
						              enter="ease-out duration-300"
						              enterFrom="opacity-0"
						              enterTo="opacity-100"
						              leave="ease-in duration-200"
						              leaveFrom="opacity-100"
						              leaveTo="opacity-0"
						            >
						              <Dialog.Overlay className="fixed inset-0" />
						            </Transition.Child>

						            {/* This element is to trick the browser into centering the modal contents. */}
						            <span
						              className="inline-block h-screen align-middle"
						              aria-hidden="true"
						            >
						              &#8203;
						            </span>
						            <Transition.Child
						              as={Fragment}
						              enter="ease-out duration-300"
						              enterFrom="opacity-0 scale-95"
						              enterTo="opacity-100 scale-100"
						              leave="ease-in duration-200"
						              leaveFrom="opacity-100 scale-100"
						              leaveTo="opacity-0 scale-95"
						            >
						              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
						                <Dialog.Title
						                  as="h3"
						                  className="text-lg font-medium leading-6 text-gray-900"
						                >
						                  Share with
						                </Dialog.Title>
						                <div className="mt-2">
						                  <ul className="flex space-x-3 justify-evenly items-center">
						                  	<li>
						                  		<FacebookShareButton url={"http://localhost:7648/video" + video._id}>
						                  			<FacebookIcon size={40} round={true}>Facebook</FacebookIcon>
						                  		</FacebookShareButton>
						                  	</li>
						                  	<li>
						                  		<RedditShareButton url={"http://localhost:7648/video" + video._id}>
						                  			<RedditIcon size={40} round={true}>Reddit</RedditIcon>
						                  		</RedditShareButton>
						                  	</li>
						                  	<li>
						                  		<TwitterShareButton url={"http://localhost:7648/video" + video._id}>
						                  			<TwitterIcon size={40} round={true}>Twitter</TwitterIcon>
						                  		</TwitterShareButton>
						                  	</li>
						                  </ul>
						                </div>

						                <div className="mt-4">
						                  <button
						                    type="button"
						                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
						                    onClick={closeModal}
						                  >
						                    Cancel
						                  </button>
						                </div>
						              </div>
						            </Transition.Child>
						          </div>
						        </Dialog>
						      </Transition>
						      {/*modal*/}
						      </div>
						    </div>
						  </div>
					  	)
					  })
					  }
					  
					</div>
					<Footer />
				</>

			)
		}
	}

export default Home