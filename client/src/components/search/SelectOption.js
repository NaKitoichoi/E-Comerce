import React, {memo} from 'react'

const SelectOption = ({icon, bgColor='bg-white',hover='hover:bg-gray-800 hover:text-white cursor-pointer hover:border-gray-800'}) => {
  return (
    <div className={`${bgColor} w-12 h-12 rounded-full border shadow-md flex items-center justify-center ${hover}`}>
      {icon}
    </div>
  )
}

export default memo(SelectOption)
