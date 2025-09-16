import React, { useEffect, useState } from 'react'
import payment from 'assets/payment.svg'
import { useSelector } from 'react-redux'
import { formatPrice } from 'ultils/helpers'
import { Congrat, InputForm, Paypal } from 'components'
import { useForm } from 'react-hook-form'
import withBase from 'hocs/withBase'
import { getCurrent } from 'store/user/asyncActions'

const CheckOut = ({ dispatch, navigate }) => {
  const { register, formState: { errors }, reset, handleSubmit, watch, setValue } = useForm()
  const { currentCart, current } = useSelector(state => state.user)
  const [isSuccess, setIsSuccess] = useState(false);
  const address = watch('address')
  console.log(currentCart);

  const orderProducts = currentCart.map(item => ({
    product: item.product?._id,
    title: item.title,
    thumbnail: item.product?.thumb || item.thumbnail,
    price: item.price,
    quantity: item.quantity,
    color: item.color,
  }));

  useEffect(() => {
    setValue('address', current?.address)
  }, [current.address])

  useEffect(() => {
    if (isSuccess) dispatch(getCurrent())
  }, [isSuccess])

  return (
    <div className='w-full p-8 grid grid-cols-10 gap-4 h-full max-h-screen overflow-y-auto'>

      {isSuccess && <Congrat />}
      <div className='w-full flex justify-center items-center col-span-4'>
        <img src={payment} alt="payment" className=' object-contain' />
      </div>
      <div className='w-full flex flex-col items-center justify-center col-span-6 gap-6'>
        <h2 className='text-3xl mb-6 font-bold'>CheckOut Your Order</h2>
        <table className='table-auto w-full'>
          <thead>
            <tr className='border bg-gray-200'>
              <th className='text-left p-2'>Product</th>
              <th className='text-center p-2'>Quantity</th>
              <th className='text-right p-2'>Price</th>
            </tr>
          </thead>
          <tbody>
            {currentCart?.map(el => (<tr className='border' key={el._id}>
              <td className='text-left p-2'>{el.title}</td>
              <td className='text-center p-2'>{el.quantity}</td>
              <td className='text-right p-2'>{`${formatPrice(el.price)} VND`}</td>
            </tr>))}
          </tbody>
        </table>
        <div className='flex w-full justify-end gap-2 font-bold text-xl'>
          <span className=''>Total :</span>
          <span>{`${formatPrice(currentCart?.reduce((sum, el) => +el?.price * +el?.quantity + sum, 0))} VND`}</span>
        </div>
        <span className='font-semibold'>{`Address : ${current.address}`}</span>
        <div className='w-full'>
          <Paypal
            payload={{
              products: orderProducts,
              total: Math.round(+currentCart?.reduce((sum, el) => +el?.price * +el?.quantity + sum, 0) / 24000),
              address,
            }}
            setIsSuccess={setIsSuccess}
            amount={Math.round(+currentCart?.reduce((sum, el) => +el?.price * +el?.quantity + sum, 0) / 24000)}
          />
        </div>
      </div>
    </div>
  )
}

export default withBase(CheckOut)
