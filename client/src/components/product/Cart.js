import withBase from 'hocs/withBase'
import React, { memo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { showCart } from 'store/app/appSlice'
import icons from 'ultils/icons'
import { formatPrice } from 'ultils/helpers'
import Button from 'components/button/Button'
import { toast } from 'react-toastify'
import { apiRemoveCart } from 'apis'
import { getCurrent } from 'store/user/asyncActions'
import path from 'ultils/path'

const { FaWindowClose, RiDeleteBin2Line } = icons

const Cart = ({ dispatch ,navigate}) => {
    const { currentCart } = useSelector(state => state.user)    

    const removeCart = async (pid,color) => {
        const response = await apiRemoveCart(pid,color)
        if (response.success) {
            dispatch(getCurrent())
        } else toast.error(response.mes)
    }

    useEffect(() => {
        document.body.classList.add('overflow-hidden')
        return () => {
            document.body.classList.remove('overflow-hidden')
        }
    }, [])
    
    return (
        <div onClick={e => e.stopPropagation()} className='fixed top-0 right-0 w-[500px] h-screen bg-black text-white p-8 grid grid-rows-10'>
            <header className='flex justify-between items-center border-b border-gray-700 font-bold text-2xl row-span-1 h-full'>
                <span>Your Cart</span>
                <span onClick={() => dispatch(showCart())} className='p-2 cursor-pointer'><FaWindowClose size={24} /></span>
            </header>
            <section className='row-span-7 h-full max-h-full flex flex-col gap-3 overflow-y-auto py-3'>
                {!currentCart && <span className='text-sm italic'>Your Cart Empty</span>}
                {currentCart && currentCart.map(el => (
                    <div key={el._id} className='flex border-b border-gray-800 py-2 justify-between items-center'>
                        <div className='flex gap-2'>
                            <img src={el?.thumbnail || el?.product?.thumb} alt="thumb" className='w-16 h-16 object-cover' />
                            <div className='flex flex-col gap-1'>
                                <span className=''>{el?.title}</span>
                                <span className='text-xs'>{`Color : ${el?.color}`}</span>
                                <span className='text-xs'>{`Quantity : ${el?.quantity}`}</span>
                                <span className=''>{formatPrice(el?.price) + ' VND'}</span>
                            </div>
                        </div>
                        <span onClick={() => removeCart(el?.product?._id, el.color)} className='w-12 h-12 cursor-pointer flex items-center justify-center rounded-full hover:bg-gray-500'><RiDeleteBin2Line size={24} /></span>
                    </div>
                ))}
            </section>
            <div className='row-span-2 h-full flex flex-col justify-between'>
                <div className='flex items-center my-4 justify-between pt-4 border-t'>
                    <span>Total :</span>
                    <span>{formatPrice(currentCart?.reduce((sum, el) => sum + Number(el?.price*el.quantity), 0)) + ' VND'}</span>
                </div>
                <span className='text-gray-500 italic text-center text-sm'>Shipping, Taxes, and Discounts Calculated at Checkout.</span>
                <Button handleOnClick={() => {
                    dispatch(showCart())
                    navigate(`${path.MEMBER}/${path.DETAIL_CART}`)
                }} style='rounded-full w-full bg-main py-3'>Shopping Cart</Button>
            </div>
        </div>
    )
}

export default withBase(memo(Cart))
