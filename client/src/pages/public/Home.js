import React from 'react'
import { Sidebar, Banner, CustomSlider, DealDaily, FeatureProducts, BestSeller } from 'components'
import { useSelector } from 'react-redux'
import icons from 'ultils/icons'
import withBase from 'hocs/withBase'
import { createSearchParams } from 'react-router-dom'

const { IoMdArrowDropright } = icons
const Home = ({ navigate }) => {
  const { newProducts } = useSelector(state => state.products)
  const { categories } = useSelector(state => state.app)

  return (
    <>
      <div className='w-main'>
        <div className='w-full flex mt-6'>
          <div className='flex flex-col gap-5 w-[25%]'>
            <Sidebar />
            <DealDaily />
          </div>
          <div className='flex flex-col gap-5 pl-5 w-[75%] '>
            <Banner />
            <BestSeller />
          </div>
        </div>
        <div className='my-6 w-full'>
          <FeatureProducts />
        </div>
        <div className='my-6 w-full'>
          <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>NEW ARRIVALS</h3>
          <div className='mt-4 mx-[-10px]'>
            <CustomSlider
              product={newProducts}
            />
          </div>
        </div>
        <div className='my-6 w-full'>
          <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>HOT COLECTIONS</h3>
          <div className='flex flex-wrap gap-4 mt-4'>
            {categories?.filter(el => el.brand.length > 0)?.map(el => (
              <div
                key={el._id}
                className='w-[396px] '
              >
                <div className='border flex p-4 gap-4 min-h-[180px] items-center'>
                  <img src={el?.image} alt="" className='w-[144px] h-[129px] flex-1 object-cover' />
                  <div className='flex-1 text-gray-700'>
                    <h4 className='font-semibold uppercase cursor-pointer hover:underline'>{el.title}</h4>
                    <ul className='text-sm'>
                      {el?.brand?.map(item => (
                        <span
                          key={item}
                          className='flex gap-1 items-center cursor-pointer hover:underline text-gray-500'
                          onClick={() => navigate({
                            pathname: `/${el.title}`,
                            search: createSearchParams({
                              brand: item,
                            }).toString(),
                          })}
                        >

                          <IoMdArrowDropright size={14} />
                          <li>{item}</li>
                        </span>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default withBase(Home)
