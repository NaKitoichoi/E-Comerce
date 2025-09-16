import {  Button, OrderItem} from 'components';
import withBase from 'hocs/withBase';
import React from 'react'
import { useSelector } from 'react-redux'
import { createSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { formatPrice } from 'ultils/helpers';
import path from 'ultils/path';

const DetailCart = ({ location,navigate }) => {
    const { currentCart,current } = useSelector(state => state.user)
    console.log(currentCart);
    
const handleSubmit = () => {
  if(!current?.address) return Swal.fire({
    title:'Almost!',
    text: 'Please Update your Address before CheckOut',
    icon:'info',
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: 'Go Update',
    cancelButtonText:'Cancel',

  }).then((result) => {
    if(result.isConfirmed) navigate({
        pathname: `/${path.MEMBER}/${path.PERSIONAL}`,
        search: createSearchParams({redirect: location.pathname}).toString()
    })
  })
  else{
    window.open(`/${path.CHECKOUT}`)
  }
}
    

    return (
        <div className='w-full'>
            <h1 className='fixed top-0 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
                <span>My Cart</span>
            </h1>
            <div className='flex flex-col w-main mx-auto border my-8'>
                <div className='w-full mx-auto font-bold border grid grid-cols-10 py-3'>
                    <span className='col-span-6 w-full px-4'>Product</span>
                    <span className='col-span-1 w-full px-2'>Quantity</span>
                    <span className='col-span-3 w-full text-center'>Price</span>
                </div>
                {currentCart?.map(el => (
                    <OrderItem
                        key={el._id}
                        el={el}
                        dfquantity={el.quantity}
                        color={el.color}
                        title={el.title}
                        thumbnail={(el.thumbnail || el.product.thumb)} 
                        price={el.price}
                        pid={el.product?._id}
                    />
                ))}
            </div>
            <div className='w-main mx-auto flex items-end justify-center flex-col gap-3 mb-12'>
                <span className='flex items-center gap-2 font-bold text-xl'>
                    <span className='flex items-center'>Total :</span>
                    <span>{`${formatPrice(currentCart?.reduce((sum, el) => +el?.price * +el?.quantity + sum, 0))} VND`}</span>
                </span>
                <span className='text-gray-500 italic text-center text-sm'>Shipping, Taxes, and Discounts Calculated at Checkout.</span>
                <Button handleOnClick={handleSubmit}>Checkout</Button>
                {/* <Link target='_blank' className='bg-main text-white px-4 py-2 rounded-md' to={`/${path.CHECKOUT}`}>Checkout</Link> */}
            </div>
        </div>
    )
}

export default withBase(DetailCart)
