import React, { useEffect, useState, memo } from 'react'
import icons from 'ultils/icons'
import { apiGetProducts } from 'apis/product'
import { formatPrice, renderStartFromNumber, secondsToHms } from 'ultils/helpers'
import { CountDown } from 'components'
import moment from 'moment'
import { useSelector } from 'react-redux'
import withBase from 'hocs/withBase'
import { getDealDaily } from 'store/products/productSlice'

const { TiStarFullOutline, LuMenu } = icons
let idInterval

const DealDaily = ({ dispatch }) => {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [expireTime, setExpireTime] = useState(false);
  const { dealDaily } = useSelector(state => state.products)  
  
  const fetchDealDaily = async () => {
    const response = await apiGetProducts({ sort: '-totalRatings' ,limit:20})
    console.log(response);
    if (response.success) {
      const pr = response?.product[Math.round(Math.random() * 20)]
      
      dispatch(getDealDaily({ data: pr, time: Date.now() + 24 * 60 * 60 * 1000 }))
    }
  }
  useEffect(() => {
    if (dealDaily?.time) {
      const deltaTime = dealDaily.time - Date.now()      
      const number = secondsToHms(deltaTime)
      setHour(number.h)
      setMinute(number.m)
      setSecond(number.s)
    }
  }, [dealDaily])
  useEffect(() => {
    idInterval && clearInterval(idInterval)
    if(moment(moment(dealDaily?.time).format('MM/DD/YYYY')).isBefore(moment()))
    fetchDealDaily()
  }, [expireTime])
  useEffect(() => {
    idInterval = setInterval(() => {
      if (second > 0) setSecond(prev => prev - 1)
      else {
        if (minute > 0) {
          setMinute(prev => prev - 1)
          setSecond(59)
        } else {
          if (hour > 0) {
            setHour(prev => prev - 1)
            setMinute(59)
            setSecond(59)
          } else {
            setExpireTime(true)
            clearInterval(idInterval)
          }
        }
      }
    }, 1000)
    return () => {
      clearInterval(idInterval)
    }
  }, [second, minute, hour, expireTime])

  return (
    <div className='border w-full flex-auto '>
      <div className='flex items-center justify-between p-4 w-full'>
        <span className='flex-1 flex justify-center '><TiStarFullOutline size={20} color='#DD1111' /></span>
        <span className='flex-8 font-semibold text-[18px] flex justify-center text-gray-700'>DEAL DAILY</span>
        <span className='flex-1 '></span>
      </div>
      <div className='w-full flex flex-col items-center gap-2 mt-2'>
        <img src={dealDaily?.data?.thumb || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOtjqFKVwZWNCqI33H1OWcsUaZYww6FLLFAw&s'}
          alt=''
          className='w-full object-contain '
        />
        <span className='line-clamp-1 text-center'>{dealDaily?.data?.title}</span>
        <span className='flex h-4'>{renderStartFromNumber(dealDaily?.data?.totalRatings, 20)?.map((el, index) => (
          <span key={index}>{el}</span>
        ))}</span>
        <span>{`${formatPrice(dealDaily?.data?.price)} VND`}</span>
      </div>
      <div className='px-4 mt-4'>
        <div className='flex justify-center gap-2 items-center mb-4'>
          <CountDown unit={'Hours'} number={hour} />
          <CountDown unit={'Minutes'} number={minute} />
          <CountDown unit={'Seconds'} number={second} />
        </div>
        <button type='button' className='flex gap-2 items-center justify-center w-full bg-main text-white hover:bg-gray-800 font-medium py-2 rounded-3xl mb-4'>
          <LuMenu />
          <span>Options</span>
        </button>
      </div>
    </div>
  )
}

export default withBase(memo(DealDaily))
