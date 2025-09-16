import React, { memo } from 'react'

const CountDown = ({unit, number}) => {
  return (
    <div className='w-[30%] h-[60px] flex justify-center items-center bg-[#F4F4F4] rounded-md flex-col font-bold'>
        <span className='text-[10px] to-gray-800'>{number}</span>
        <span className='text-xs to-gray-700'>{unit}</span>
    </div>
  )
}

export default memo(CountDown)
