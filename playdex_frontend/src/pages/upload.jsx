import { useState, useEffect } from "react"
import Nav from '../components/navbar'
import Footer from '../components/footer'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from '../../config/firebase'
import { useNavigate } from 'react-router-dom'
import Loader from "../components/loading_indicator"
import filesize from "filesize"
import axios from "axios"
import _ from 'lodash'
// import crypto from "crypto-js"


//#TODO
//attach videoId metadata to the file/object
//send that videoId to db as a reference for a file in bucket

const availableTagsList = [
	"RPG",
	"Action",
	"Racing",
	"FPS",
	"Battle Royale",
	"Puzzle",
	"Adventure",
	"Sports",
	"Multiplayer",
	"PC", 
	"XBOX",
	"PlayStation",
	"Nintendo",
	"Handheld",

]

function videoUploaderForm(){

	const [selectedTags, setSelectedTags] = useState([])
	const [loaded, setLoaded] = useState(false)
	const [title, setTitle] = useState()
	const [data, setData] = useState()
	const [loggedIn, setLoggedIn] = useState(false)
	const [description, setDescription] = useState("")
	const navigate = useNavigate();
	const [image, setImage] = useState([])

	const addTag = (tag) => {
		if(selectedTags.includes(tag)){
			const tg = selectedTags.filter(x => x!=tag);
			(selectedTags.length < 2) ? setSelectedTags(prev => []):setSelectedTags(tg)
		}
		else{
			(selectedTags.length < 3) ? setSelectedTags(prev => [...selectedTags, tag]): void(0)
		}
	}



	useEffect(() => {
		axios({
			method: "GET",
			url: "http://localhost:3037",
			withCredentials: true
		})
		.then(res => {
			if(res.data.isLoggedIn){
				setData(res.data.user)
				setLoggedIn(!loggedIn)
			}
			else{
				navigate('/user/login')
			}
		})
		.then(() => {
			console.log("user_data",data)
			setLoaded(!loaded)
		})

	},[])
	
	const changeTitle = (e) => {
		setTitle(e.target.value)
	}

	const fileChange = (e) => {
	    const file = e.target.files[0]
	    setImage([...image, file])
	    console.log(file)
	}


	const changeDescription = (e) => {
		setDescription(prev => e.target.value)
	}

	// const randomHash = crypto.createHash('sha1').update((Math.random() * 1e17).toString()).digest('hex')
	const randomInt = Math.random() * 1e17

	//fix large uploads not showing up on bucket issue
	const uploadFile = () => {
		const size = filesize(image[0].size, {round:0, exponent:2, output:"object"})
		const supportedTypes = ['.jpeg','.jpg','.mpeg', '.mp4', '.mov','.flv','3gp']
		const fileName = [...image[0].name] 
		const index = fileName.indexOf('.')
		const ext = _.takeRight(fileName, fileName.length - index).join('')
		const maxSize = 100
		if(supportedTypes.includes(ext) && size.value < maxSize){
		    const meta = {
		    	videoId: randomInt,
		    }
		    // setMetadata(metadata.videoId.toString())
		    const bucket = ref(storage, 'gameplays/'+image[0].name)
		    const uploadStats = uploadBytesResumable(bucket, image[0], meta)
		    .then(() => {
		    	console.log(data)
		    	getDownloadURL(bucket).then(url => {
				    axios({
						method: "POST",
						url: 'http://localhost:3037/video/add/',
						params: {
							uploaded_by: JSON.stringify({name:data.username, userId:data._id}),
							title: title,
							description: description,
							tags: selectedTags,
							metadata: url

						}
					})
		    	})
		    })

		}
		else{
			console.log('unsupported file type, available:', supportedTypes)
		}

	}
  


	const handleSubmit = (e) => {
		// e.preventDefault()
		try{

			uploadFile()
			
			navigate('/')
		}
		catch(err){
			console.log(err.message)
		}
		// setSubmitted(!submitted)
	}



	// remove chip
	// const deleteChip = (e) => {

	// }

	if(!loaded){
		return (
			<Loader />
		)
	}

	else{

		return (
			<>
			{/* use navigator to redirect */}
			{/*{(submitted) ? <Navigator to="/" />: void(0)}*/}
			<div>
			<Nav authenticated={loggedIn} username={data.username}/>
			<h1 className="font-bold text-4xl mb-3 text-center">Upload Your Gameplay</h1>
			<div className="flex flex-wrap overflow-hidden justify-center lg:space-x-7 space-x-0">
		     {/*form*/}
		     
		     <form onSubmit={handleSubmit}>
			  <div className="h-auto sm:w-auto w-full sm:mx-0 mx-4">
			      <div className="flex justify-center">
			        <div className="mb-3 xl:w-96 w-full">
			          <label htmlFor="exampleEmail0" className="form-label inline-block sm:translate-x-0 translate-x-16 mb-2 font-semibold text-gray-700"
			            >Title</label
			          >
			          <input
			          	onChange={changeTitle}
			            type="title"
			            name="title"
			            className="form-control block sm:w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out -translate-x-4 mx-auto focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
			            id="exampleEmail0"
			          />
			        </div>
			      </div>

			       <div className="flex justify-center">
			        <div className="mb-3 xl:w-96">
			          <label
			            htmlFor="exampleFormControlTextarea1"
			            className="form-label inline-block mb-2 text-gray-700"
			            >Description(optional)</label
			          >
			          <textarea
			          	onChange={changeDescription}
			            className="form-control block w-64 py-1.5 text-base sm:mx-0  font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
			            id="exampleFormControlTextarea1"
			            rows="3"
			            name="description"
			          ></textarea>
			        </div>
			      </div>


			        <div className="flex justify-center">
			          <div className="mb-3 xl:w-96">
			            <label
			              htmlFor="exampleFormControlInput1"
			              className="form-label inline-block mb-2 text-gray-700"
			              >Add Upto 3 Tags or none</label
			            >
			            <div>
			            	<ul className="flex flex-row space-x-2 w-72 space-y-4">
			            		{(selectedTags.length > 0) && selectedTags.map(tag => {
			            			return (
			            				<li key={tag} className="px-2 bg-indigo-400 text-white rounded-full flex items-center justify-center space-x-[4px]">
				            				#{tag}
										</li>
			            			)
			            		})}
			            	</ul>
			            	<ul className="flex flex-wrap w-72 w-96 space-y-4 space-x-4 mx-auto">
					            {availableTagsList.map(tag => {
					            	return (
					            		<li key={tag} className={`bg-${(selectedTags.includes(tag)) ? `indigo`: `gray`}-400 px-2 border rounded-full flex items-center justify-center space-x-[4px]`}>
				            				<button type="button" className="inline" onClick={() => {
				            					// e.preventDefault()
				            					addTag(tag)}
				            				}>#{tag}
											</button>
										</li>
					            	)
					            })}
				            </ul>
			            </div>
			          </div>
			        </div>

			  </div>
			  <div className="sm:translate-x-0 translate-x-16">

			    <div className="flex justify-center">
			      <div className="mb-3 w-96">
			        <img src=""></img>
			        <label htmlFor="formFile" className="form-label inline-block mb-2 text-gray-700"
			          >Video file</label
			        >
			        <input
				      onChange={fileChange}
			          className="form-control block h-72 sm:w-auto w-[260px] px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-dashed border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
			          // onChange={imageHandler}
			          type="file"
			          name="gameplay_clip"
			          id="formFile"
			        />
			      </div>
			    </div>
			      <button className="bg-[#6902FF] xl:-translate-x-2 translate-x-0 xl:w-full w-auto my-4 py-3 sm:px-8 text-white rounded font-semibold px-[67px]">
			        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
			          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
			        </svg>
			        <span>Upload Video</span>
			      </button>
			    
			  </div>
		      {/*form*/}
		      </form>
			</div>

			<Footer />
			</div>
		</>
		)
	}

}

export default videoUploaderForm