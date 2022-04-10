import Lottie from "react-lottie"
import Indicator from "../../public/loading-indicator"


const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: Indicator,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

function Loader(){
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <Lottie options={defaultOptions} height={120} width={120}></Lottie>
    </div>
  )
}


export default Loader