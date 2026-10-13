import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>
      <div className="text-5xl">
        Hello World
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="light"
        limit={3}
      />
    </>
  )
}

export default App
