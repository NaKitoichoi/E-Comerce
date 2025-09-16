import withBase from 'hocs/withBase'
import React, { memo } from 'react'
import { renderStartFromNumber, formatPrice } from 'ultils/helpers'

const ProductCard = ({ price, totalRatings, title, image, navigate, pid, category }) => {
    return (
        <div
            onClick={(e) => navigate(`/${category?.toLowerCase()}/${pid}/${title}`)}
            className='w-1/3 gap-4 p-2 cursor-pointer'
        >
            <div className='flex w-full border gap-4 items-center'>
                <img src={image} alt='products' className='w-[150px] object-contain p-4' />
                <div className='flex flex-col mt-[15px] items-start gap-1 w-full p-4 text-sm'>
                    <span className='line-clamp-1 capitalize'>{title?.toLowerCase()}</span>
                    <span className='flex h-4'>{renderStartFromNumber(totalRatings, 14)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span>{`${formatPrice(price)} VND`}</span>
                </div>
            </div>
        </div>
    )
}

export default withBase(memo(ProductCard))

