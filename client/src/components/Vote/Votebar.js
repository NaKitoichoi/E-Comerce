import React, { useRef, useEffect, memo } from 'react'
import { TiStarFullOutline } from "react-icons/ti";

const Votebar = ({ number, ratingCount, ratingTotal }) => {
    const percentRef = useRef()
    useEffect(() => {
        const percent = Math.round(ratingCount * 100 / ratingTotal) || 0
        percentRef.current.style.cssText = `right: ${100- percent}%`
    }, [ratingCount, ratingTotal])

    return (
        <div className='flex items-center gap-2 text-sm text-gray-500'>
            <div className='flex w-[10%] items-center justify-center gap-1 text-sm'>
                <span>{number}</span>
                <TiStarFullOutline color='orange' />
            </div>
            <div className='w-[75%]'>
                <div className='relative w-full h-2 bg-gray-200 rounded-md'>
                    <div ref={percentRef} className='absolute inset-0  bg-red-500 rounded-md'>

                    </div>
                </div>
            </div>
            <div className='w-[15%] justify-end text-sm text-400'>
                {`${ratingCount || 0} reviewer`}
            </div>
        </div>
    )
}

export default memo(Votebar)
