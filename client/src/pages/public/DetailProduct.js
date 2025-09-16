import React, { use, useCallback, useEffect, useRef, useState } from 'react'
import { createSearchParams, useParams, useSearchParams } from 'react-router-dom'
import { apiGetProduct, apiGetProducts } from 'apis/product'
import { Button, Breadcrumbs, SelectQuantity, CustomSlider, ProductExtraInfoItem, ProductInfomation } from 'components'
import Slider from 'react-slick'
import ReactImageMagnify from 'react-image-magnify'
import { formatPrice, renderStartFromNumber } from 'ultils/helpers'
import { productExtraInformation } from 'ultils/constants'
import DOMPurify from 'dompurify';
import clsx from 'clsx'
import { toast } from 'react-toastify'
import withBase from 'hocs/withBase'
import { apiUpdateCart } from 'apis'
import Swal from 'sweetalert2'
import path from 'ultils/path'
import { getCurrent } from 'store/user/asyncActions'
import { useSelector } from 'react-redux'

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 2,
  autoplay: false,
  autoplaySpeed: 3000,
};

const DetailProduct = ({ isQuickView, data, dispatch, navigate, location }) => {
  const params = useParams()
  const { current } = useSelector(state => state.user)
  const [searchParams] = useSearchParams()
  const titleRef = useRef()

  const [category, setCategory] = useState(null);
  const [pid, setPid] = useState(null);
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [update, setUpdate] = useState(false);
  const [varriant, setVarriant] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({
    title: '',
    thumb: '',
    images: [],
    price: '',
    color: '',
  });

  useEffect(() => {
    if (data) {
      setPid(data.pid)
      setCategory(data.category)
    } else if (params && params.pid) {
      setPid(params.pid)
      setCategory(params.category)
    }
  }, [data, params])

  const fetchProductData = async () => {
    const response = await apiGetProduct(pid)
    if (response.success) {
      setProduct(response.productData)
      setCurrentImage(response.productData.thumb)
    }
  }
  useEffect(() => {
    if (varriant && product) {
      setCurrentProduct({
        title: product?.variants.find(el => el.sku === varriant)?.title,
        color: product?.variants.find(el => el.sku === varriant)?.color,
        images: product?.variants.find(el => el.sku === varriant)?.images,
        price: product?.variants.find(el => el.sku === varriant)?.price,
        thumb: product?.variants.find(el => el.sku === varriant)?.thumb,
      })
    } else {
      setCurrentProduct({
        title: product?.title,
        color: product?.color,
        images: product?.images || [],
        price: product?.price,
        thumb: product?.thumb,
      })
    }
  }, [varriant, product])
  const fetchProducts = async () => {
    const response = await apiGetProducts({ category })
    if (response.success) setRelatedProducts(response.product)
  }
  useEffect(() => {
    if (pid) {
      fetchProductData()
      fetchProducts()
    }
    window.scrollTo(0, 0)
    titleRef.current.scrollIntoView({ block: 'center' })
  }, [pid])
  useEffect(() => {
    if (pid) fetchProductData()
  }, [update])
  const rerender = useCallback(() => {
    setUpdate(!update)
  }, [update])

  const handleQuantity = useCallback((number) => {
    if (!Number(number) || Number(number) < 1) {
      return
    } else {
      setQuantity(number)
    }
  }, [quantity])
  const handleChangeQuantity = useCallback((flag) => {
    if (flag === 'minus' && quantity === 1) return
    if (flag === 'minus') setQuantity(prev => prev - 1)
    if (flag === 'plus') setQuantity(prev => prev + 1)
  }, [quantity])

  const handleClickImage = (e, el) => {
    e.stopPropagation(e)
    setCurrentImage(el)
  }
  const handleAddtoCard = async () => {
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
      pid,
      color: currentProduct?.color || product.color,
      quantity,
      price: currentProduct?.price || product.price,
      thumbnail: currentProduct?.thumb || product.thumb,
      title: currentProduct?.title || product.title
    })
    if (response.success) {
      toast.success(response.mes)
      dispatch(getCurrent())
    } else toast.error(response.mes)
  }

  return (
    <div ref={titleRef} className='w-full'>
      {!isQuickView && <div className='h-[81px] flex bg-gray-200 items-center justify-center'>
        <div className='w-main'>
          <h3>{currentProduct.title || product?.title}</h3>
          <Breadcrumbs title={currentProduct.title || product?.title} category={category} />
        </div>
      </div>}
      <div onClick={e => e.stopPropagation()} className={clsx('w-main bg-white m-auto mt-4 flex', isQuickView && 'w-fit py-10 max-h-[90vh]p overflow-y-auto')}>
        <div className={clsx('w-2/5 flex flex-col gap-4', isQuickView && 'w-1/2 px-10')}>
          <div className='border w-[458px] h-[458px] overflow-hidden flex items-center'>
            <ReactImageMagnify {...{
              smallImage: {
                alt: 'Wristwatch by Ted Baker London',
                isFluidWidth: true,
                src: currentProduct.thumb || currentImage,
              },
              largeImage: {
                width: 1800,
                height: 1500,
                src: currentProduct.thumb || currentImage,
              }
            }} />
          </div>
          <div className='w-[458px]'>
            <Slider className='image-slider flex gap-2 justify-between' {...settings}>
              {currentProduct.images?.length === 0 && product?.images?.map(el => (
                <div key={el} className='flex-1'>
                  <img onClick={e => handleClickImage(e, el)} src={el} alt="sub-product" className='cursor-pointer h-[143px] w-[143px] border object-cover flex justify-center items-center' />
                </div>
              ))}
              {currentProduct.images?.length > 0 && currentProduct.images?.map(el => (
                <div key={el} className='flex-1'>
                  <img onClick={e => handleClickImage(e, el)} src={el} alt="sub-product" className='cursor-pointer h-[143px] w-[143px] border object-cover flex justify-center items-center' />
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className={clsx('w-2/5 flex flex-col gap-4 pr-8', isQuickView && 'w-1/2 px-10')}>
          <div className='flex items-center justify-between'>
            <h2 className='font-semibold text-[30px]'>{`${formatPrice(currentProduct.price || product?.price)} VND`}</h2>
            <span className='text-sm text-main'>{`In Stock : ${product?.quantity}`}</span>
          </div>
          <div className='flex items-center mt-4'>
            {renderStartFromNumber(product?.totalRatings)?.map((el, index) => (<span key={index}>{el}</span>))}
            <span className='text-sm text-main pl-4'>{`Sold : ${product?.sold} pieces`}</span>
          </div>
          <ul className='text-sm text-gray-500 list-disc pl-4'>
            {product?.description?.length > 1 && product?.description?.map(el => (<li className='leading-6' key={el}>{el}</li>))}
            {product?.description?.length === 1 && <div className='text-sm line-clamp-[10] mb-8' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }}></div>}
          </ul>
          <div className='my-4 flex gap-4'>
            <span className='font-bold'>Color</span>
            <div className='flex flex-wrap gap-4 items-center w-full'>
              <div
                onClick={() => setVarriant(product)}
                className={clsx('flex items-center gap-2 p-2 border cursor-pointer', !varriant && 'border-red-500')}
              >
                <img src={product?.thumb} alt="thumb" className='w-8 h-8 rounded-md object-contain' />
                <span className='flex flex-col'>
                  <span>{product?.color}</span>
                  <span className='text-sm'>{product?.price}</span>
                </span>
              </div>
              {product?.variants.map(el => (
                <div
                  key={el.sku}
                  onClick={() => setVarriant(el.sku)}
                  className={clsx('flex items-center gap-2 p-2 border cursor-pointer', varriant === el.sku && 'border-red-500')}
                >
                  <img src={el?.thumb} alt="thumb" className='w-8 h-8 rounded-md object-contain' />
                  <span className='flex flex-col'>
                    <span>{el?.color}</span>
                    <span className='text-sm'>{el?.price}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className='flex gap-8 items-center'>
            <h1 className='font-semibold'>Quantity</h1>
            <SelectQuantity
              quantity={quantity}
              handleQuantity={handleQuantity}
              handleChangeQuantity={handleChangeQuantity}
            />
          </div>
          <div>
            <Button
              fw
              handleOnClick={handleAddtoCard}
            >
              Add to Cart
            </Button>
          </div>
        </div>
        {!isQuickView && <div className='w-1/5'>
          {productExtraInformation.map(el => (
            <ProductExtraInfoItem
              key={el.id}
              title={el.title}
              icon={el.icon}
              sub={el.sub}
            />
          ))}
        </div>}
      </div>
      {!isQuickView && <div className='w-main m-auto mt-8'>
        {product && (
          <ProductInfomation
            totalRatings={product?.totalRatings}
            ratings={product?.ratings}
            nameProduct={product?.title}
            pid={product?._id}
            rerender={rerender}
          />
        )}
      </div>}
      {!isQuickView && <div className='w-main m-auto mt-8'>
        <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>OTHER CUSTOMER ALSO BUY</h3>
        <div className='mt-4 mx-[-10px]'>
          <CustomSlider
            product={relatedProducts}
            normal={true}
          />
        </div>
      </div>}
    </div>
  )
}

export default withBase(DetailProduct)
