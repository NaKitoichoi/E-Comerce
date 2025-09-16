import SelectQuantity from 'components/common/SelectQuantity';
import withBase from 'hocs/withBase';
import React, { useEffect, useState } from 'react'
import { updateCart } from 'store/user/userSlice';
import { formatPrice } from 'ultils/helpers';


const OrderItem = ({ dispatch, color, dfquantity = 1, thumbnail, pid, title, price }) => {
    const [quantity, setQuantity] = useState(() => dfquantity);
    const handleQuantity = (number) => {
        if (number > 1) setQuantity(number)
    }
    const handleChangeQuantity = (flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => prev - 1)
        if (flag === 'plus') setQuantity(prev => prev + 1)
    }
    useEffect(() => {
        dispatch(updateCart({ pid, quantity, color }))
    }, [quantity])

    return (
        <div className='w-full mx-auto grid grid-cols-10 p-3 border'>
            <span className='col-span-6 w-full text-center'>
                <div className='flex gap-2 text-[20px]'>
                    <img src={thumbnail} alt="thumb" className='w-32 h-32 object-cover' />
                    <div className='flex flex-col items-start gap-1'>
                        <span className='font-bold'>{title}</span>
                        <span className='text-xs'>{color}</span>
                    </div>
                </div>
            </span>
            <span className='col-span-2 w-full text-center justify-center'>
                <div className='flex items-center h-full'>
                    <SelectQuantity
                        quantity={quantity}
                        handleQuantity={handleQuantity}
                        handleChangeQuantity={handleChangeQuantity}
                    />
                </div>
            </span>
            <span className='col-span-2 w-full text-center h-full flex items-center justify-center'>
                {formatPrice(price * quantity) + ' VND'}
            </span>
        </div>
    )
}

export default withBase(OrderItem)
