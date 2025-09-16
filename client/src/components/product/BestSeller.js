import React, { useEffect, useState, memo } from 'react'
import { apiGetProducts } from 'apis/product'
import { Product, CustomSlider } from 'components'
import { useDispatch, useSelector } from 'react-redux'
import {getNewProducts} from 'store/products/asynActions'

const tabs = [
    { id: 1, name: 'best seller' },
    { id: 2, name: 'new arrivals' },
]

const BestSeller = () => {
    const [bestSeller, setBestSellers] = useState(null)
    const [activedTab, setActivedTab] = useState(1)
    const [product, setProducts] = useState(null)
    const dispatch = useDispatch()
    const {newProducts} = useSelector(state => state.products)

    const fetchProducts = async () => {
        const response = await apiGetProducts({ sort: '-sold' })
        if (response.success) {
            setBestSellers(response.product)
            setProducts(response.product)
        }}
    useEffect(() => {
        fetchProducts()
        dispatch(getNewProducts())
    }, [])
    useEffect(() => {
        if (activedTab === 1) setProducts(bestSeller)
        if (activedTab === 2) setProducts(newProducts)
    }, [activedTab])
    return (
        <div className='w-full'>
            <div className='flex text-[20px] gap-8 pb-4 border-b-2 border-main'>
                {tabs.map(el => (
                    <span
                        key={el.id}
                        className={`font-semibold capitalize cursor-pointer text-gray-400 ${activedTab === el.id ? 'text-gray-900' : ''} `}
                        onClick={() => setActivedTab(el.id)}
                    >{el.name}</span>
                ))}
            </div>
            <div className='mt-4 mx-[-10px]'>
                <CustomSlider product={product} activedTab={activedTab}/>
            </div>
            <div className='w-full flex gap-4 mt-4'>
                <img
                    src='https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657'
                    alt='banner'
                    className='flex-1 object-contain'
                />
                <img
                    src='https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657'
                    alt='banner'
                    className='flex-1 object-contain'
                />
            </div>
        </div>
    )
}

export default memo(BestSeller)