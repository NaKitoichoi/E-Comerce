import React, { useState, memo } from 'react'
import { formatPrice, renderStartFromNumber } from 'ultils/helpers'
import label from 'assets/label.webp'
import labelBlue from 'assets/label-blue.png'
import icons from 'ultils/icons'
import { SelectOption } from 'components'
import withBase from 'hocs/withBase'
import { showModal } from 'store/app/appSlice'
import { DetailProduct } from 'pages/public'
import { apiUpdateCart, apiUpdateWishList } from 'apis'
import { toast } from 'react-toastify'
import { getCurrent } from 'store/user/asyncActions'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import path from 'ultils/path'
import { createSearchParams } from 'react-router-dom'
import clsx from 'clsx'


const { FaEye, FaHeart, BsCart4, BsFillCartCheckFill } = icons

const Product = ({
  productData,
  isNew,
  normal,
  navigate,
  dispatch,
  location,
  pid,
  className
}) => {
  const [isShowOption, setIsShowOption] = useState(false)
  const { current } = useSelector(state => state.user)

  const handleClickOptions = async (e, flag) => {
    e.stopPropagation()
    if (flag === 'QUICK_VIEW') {
      dispatch(showModal({ isShowModal: true, modalChildren: <DetailProduct data={{ pid: productData?._id, category: productData?.category }} isQuickView /> }))
    }
    if (flag === 'CART') {
      if (!current) Swal.fire({
        title: 'Almost...',
        text: 'Please Login !!',
        icon: 'info',
        confirmButtonText: 'Go to Login',
        cancelButtonText: 'Not Now',
        showCancelButton: true,
      }).then((rs) => {
        if (rs.isConfirmed) navigate({
          pathname: `/${path.LOGIN}`,
          search: createSearchParams({ redirect: location.pathname }).toString()
        })
      })
      const response = await apiUpdateCart({
        pid: productData._id,
        color: productData.color,
        quantity: 1,
        price: productData.price,
        thumbnail: productData.thumbnail,
        title: productData.title,
      })
      if (response.success) {
        toast.success(response.mes)
        dispatch(getCurrent())
      } else toast.error(response.mes)
    }
    if (flag === 'WISHLIST') {
      const response = await apiUpdateWishList(pid)
      console.log(response);

      if (response.success) {
        dispatch(getCurrent())
        toast.success(response.mes)
      } else toast.error(response.mes)
    }
  }
  return (
    <div className={clsx('w-full text-base px-[10px]', className)}>
      <div
        className='w-full border p-[15px] flex flex-col items-center'
        onClick={() => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)}
        onMouseEnter={e => {
          e.stopPropagation()
          setIsShowOption(true)
        }}
        onMouseLeave={e => {
          e.stopPropagation()
          setIsShowOption(false)
        }}
      >
        <div className='w-full relative'>
          {isShowOption && (<div
            className='absolute bottom-[10px] left-0 right-0 flex justify-center gap-4 animate-slide-top'>
            <span
              title='Quick View'
              onClick={(e) => handleClickOptions(e, 'QUICK_VIEW')}>
              <SelectOption icon={<FaEye size={20} />} />
            </span>
            {!current?.cart.some(el => el?.product?.toString() === productData._id?.toString())
              ? <span
                title='Add to Cart'
                onClick={(e) => handleClickOptions(e, 'CART')}>
                <SelectOption icon={<BsCart4 size={20} />} />
              </span>
              : <span
                title='Added to Cart'
                onClick={e => e.stopPropagation()}>
                <SelectOption bgColor='bg-green-400 border-none' hover='' icon={<BsFillCartCheckFill size={20} />} />
              </span>}
            <span
              title='Add to WishList'
              onClick={(e) => handleClickOptions(e, 'WISHLIST')}
            >
              <SelectOption icon={<FaHeart size={20} color={current?.wishlist?.some(i => i._id === pid) ? 'red' : 'gray'} />} />
            </span>
          </div>)}
          <img src={productData?.thumb || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOtjqFKVwZWNCqI33H1OWcsUaZYww6FLLFAw&s'}
            alt=''
            className='w-[274px] h-[274px] object-cover'
          />
          {!normal && <img
            src={isNew ? label : labelBlue}
            alt=''
            className={`absolute ${isNew ? ' top-[-15px] left-[-20px] w-[130px] ' : ' top-[-15px] left-[-20px] w-[130px]'} object-contain `}
          />}
          <span className='font-bold text-white top-[-12px] left-[5px] absolute '>{isNew ? 'New' : 'Trending'}</span>
        </div>
        <div className='flex flex-col mt-[15px] items-start gap-1 w-full'>
          <span className='flex h-4'>{renderStartFromNumber(productData?.totalRatings)?.map((el, index) => (
            <span key={index}>{el}</span>
          ))}</span>
          <span className='line-clamp-1'>{productData?.title}</span>
          <span>{`${formatPrice(productData?.price)} VND`}</span>
        </div>
      </div>
    </div>
  )
}

export default withBase(memo(Product))
