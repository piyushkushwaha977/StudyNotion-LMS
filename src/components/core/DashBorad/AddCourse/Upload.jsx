import { useEffect,  useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"

import React from 'react'
import ReactPlayer from 'react-player'

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  // const { course } = useSelector((state) => state.course)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )
 

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      previewFile(file)
      setSelectedFile(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4",".mkv"] },
    onDrop,
  })

  const previewFile = (file) => {
    // console.log(file)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  useEffect(() => {
    register(name, { required: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register])

  useEffect(() => {
    setValue(name, selectedFile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, setValue])

  return (
    <div className=" w-full mx-auto flex flex-col space-y-2 ">
      <label className=" flex justify-between text-sm text-richblack-5" htmlFor={name}>
        <div>{label} {!viewData && <sup className="text-pink-200">*</sup>}</div>
      </label>
      <div
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[240px] md:min-h-[300px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
        {previewSource ? (
          <div className="flex w-full  flex-col p-2 md:p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className=" md:h-[16rem] max-w-[18rem]  md:max-w-5xl rounded-md object-cover "
              />
            ) : (
              <ReactPlayer height="100%" width="100%" playsinline controls={true} url={previewSource} />
             )}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("")
                  setSelectedFile(null)
                  setValue(name, null)
                }}
                className="mt-3 text-richblack-400 underline"
              >
                Cancel
              </button>
            )}
          </div>
           ) 
           :
           (
            <div {...getRootProps()} className="flex w-full flex-col items-center p-6" >
             <input {...getInputProps()} />
                  {/* File Size Description */}
              <>
              <div className=" text-xs md:text-[14px] text-white pb-4 ">Video Size Should be less than 
                 <span className=" bg-black font-bold text-yellow-50  rounded-md py-0.5 pr-1 ml-1"> 8 MB </span>
              </div>
         <div className=" text-xs md:text-[14px] text-white pb-4 "> Thumbnail Size Should be less than 
              <span className=" bg-black font-bold text-yellow-50  rounded-md py-0.5 pr-1 ml-1"> 200KB </span>
         </div>
              </>
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span className="font-semibold text-yellow-50">Browse</span> a
              file
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center  text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}
