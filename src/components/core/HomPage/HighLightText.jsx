import React from 'react'

const HighLightText = ({text}) => {
  return (
    <div>
        <span className=' bg-gradient-to-r from-[#6e58d2c3] to-[#923CB5] text-transparent bg-clip-text'>
          {text}
          </span>
    </div>
  )
}

export default HighLightText