import Spinner from "./Spinner"

interface FullLoaderProp{
    SpinnerTitle?:string
}
const FullLoader = ({SpinnerTitle="Loading..."}:FullLoaderProp) => {
  return (
    <div className='w-full h-dvh overflow-hidden flex items-center bg-red-100'>
        <div className="w-full max-w-5xl flex justify-center mx-auto">
          <Spinner SpinnerTitle={SpinnerTitle} />
        </div>
      </div>
  )
}

export default FullLoader
