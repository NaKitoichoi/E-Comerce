import React, {memo} from 'react'

const Banner = () => {
  return (
    <div className='w-full'>
      <img
        src='https://i.pinimg.com/736x/8b/46/01/8b46016b6bc16f50f3fadc13a7afdcef.jpg'
        alt='banner'
        className='w-full object-contain'
      />
    </div>
  )
}

export default memo(Banner)
