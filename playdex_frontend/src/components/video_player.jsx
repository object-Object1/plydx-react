function videoPlayer(){
	return (
		<>
		<div className="flex items-end justify-between sm:translate-y-80 translate-y-28  mx-2 rounded">
		  <video width="820" height="720" className="absolute -z-10 rounded">
		    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
		    <source src="movie.ogg" type="video/ogg" />
		  </video>
		    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
		      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
		    </svg>
		  <div className="bg-indigo-500 sticky opacity-80 h-10 space-x-5 items-center rounded-md justify-center z-10 md:w-7/12 w-11/12 mx-2 px-3 my-3 flex">
		    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style={{fill: "rgba(255, 255, 255, 255)"}}><path d="M7 6v12l10-6z"></path></svg>
		    <button>
		      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white space-x-5" viewBox="0 0 20 20" fill="currentColor">
		        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
		      </svg>    
		    </button>
		    <div className="bg-white w-10/12 h-2 rounded-full"></div>
		    <span className="text-sm text-white font-semibold">5:27</span>
		  </div>
		</div>
		</>
	)
}


export default videoPlayer