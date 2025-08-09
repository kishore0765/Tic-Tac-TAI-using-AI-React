import React from 'react'
import { motion } from 'framer-motion'

const Square = ({value,onClick}) => {
  // Determine the text color based on the square's value
  const textColor = value === 'X' ? 'text-[#38BDF8]' : 'text-[#F472B6]';

  return (
    <motion.button 
      className={`w-[90px] h-[90px] bg-[#1E293B] flex items-center font-bold text-5xl justify-center ${textColor}`}
      whileTap={{scale:0.9}}
      onClick={onClick}
    >
        {value}
    </motion.button>
  )
}

export default Square
