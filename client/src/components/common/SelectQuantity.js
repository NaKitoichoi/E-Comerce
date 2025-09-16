import React, { memo } from 'react'

const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity }) => {
    return (
        <div className='border border-gray-200'>
            <span 
            onClick={() => handleChangeQuantity('minus')} 
            className='p-2 border-r border-black cursor-pointer hover:bg-black hover:text-white'>-</span>
            <input
                className='py-2 outline-none border-none w-[50px] text-black text-center'
                type="text"
                value={quantity}
                onChange={e => handleQuantity(e.target.value)}
            />
            <span 
            onClick={() => handleChangeQuantity('plus')} 
            className='p-2 border-l border-black cursor-pointer hover:bg-black hover:text-white'>+</span>
        </div>
    )
}

export default memo(SelectQuantity)
