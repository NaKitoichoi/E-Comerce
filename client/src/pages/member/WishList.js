import { Product } from 'components'
import React from 'react'
import { useSelector } from 'react-redux'

const WishList = () => {
  const { current } = useSelector(state => state.user)
  return (
    <div className='w-full relative'>
      <header className='text-3xl font-semibold p-4 border border-b-gray-200'>
        WishList
      </header>
      <div className='p-4 w-full flex flex-wrap gap-4'>
        {current.wishlist.map(el => (
          <div key={el._id} className='bg-white rounded-md w-[300px] drop-shadow py-2'>
            <Product pid={el._id} productData={el} className=''/>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WishList
