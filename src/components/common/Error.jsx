
import errorImage from "../../assets/Images/errror.image.jpg"


const Error = () => {

    return (
      <div className="bg-black w-full h-full ">
        <div className="mx-4 flex flex-col justify-center items-center h-screen text-center  overflow-y-hidden">
          <img
            className="w-100 h-52 md:h-72 "
            src={errorImage}
            alt="error"
          />
          <div className=" mt-12 bg-gradient-to-r from-[#6e58d2c3] to-[#923CB5] text-transparent bg-clip-text text-3xl md:text-4xl font-bold ">OOPs Something Went Wrong </div>

        </div>
      </div>  
      );
    };

export default Error;



// Advanced Error Component using useRouteError
// import { useRouteError } from "react-router-dom"
// import errorImage from "../../assets/Images/errror.image.jpg"


// const Error = () => {

//     const err = useRouteError()
    
//     return (
//         <div className="flex flex-col justify-center items-center h-screen text-center bg-[#ecf0f1] overflow-y-hidden">
//           <img
//             className="w-100 h-72"
//             src={errorImage}
//             alt="error"
//           />
//           <div className=" mt-12 md:text-4xl">OOPs Some Issue</div>
//           <span className="text-lg font-fira-code  font-bold">{err.status}</span>
//           <span className="mt-2 text-lg font-medium font-fira-code">
//             {err.statusText}
//           </span>
//           <p className="mt-2 text-lg font-medium font-fira-code">{err.data}</p>
//         </div>
//       );
//     };

// export default Error;