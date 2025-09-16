import React, { memo } from 'react'
import Slider from 'react-slick'
import { Product } from 'components'

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: false,
    autoplaySpeed: 3000,
};
const CustomSlider = ({ product, activedTab, normal }) => {
    return (
        <>
            {product && <Slider {...settings}>
                {product?.map((el, index) => (
                    <Product
                        key={index}
                        pid={el._id}
                        productData={el}
                        isNew={activedTab === 1 ? false : true}
                        normal={normal}
                    />
                ))}
            </Slider>}
        </>
    )
}


export default memo(CustomSlider)
