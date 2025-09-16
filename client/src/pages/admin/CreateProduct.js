import React, { useCallback, useState, useEffect } from 'react'
import { InputForm, Select, Button, MarkDownEditor, Loading } from 'components'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { validate, fileToBase64 } from 'ultils/helpers'
import { RiDeleteBin2Line } from "react-icons/ri"
import { toast } from 'react-toastify'
import { apiCreateProduct } from 'apis'
import { showModal } from 'store/app/appSlice'

const CreateProduct = () => {
  const dispatch = useDispatch()
  const { categories } = useSelector(state => state.app)
  const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()
  const [invalidField, setInvalidField] = useState([]);
  const [payload, setPayload] = useState({
    description: '',
  });
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });
  const changeValue = useCallback((e) => {
    setPayload(e)
  }, [payload])
  const [hoverEl, setHoverEl] = useState(null);

  const handlePreviewThumb = async (file) => {
    const base64Thumb = await fileToBase64(file)
    setPreview(prev => ({ ...prev, thumb: base64Thumb }))
  }
  const handlePreViewImages = async (files) => {
    const imagesPreview = []
    for (let file of files) {
      // if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      //   toast.warning('File not support')
      //   return
      // }
      const base64Image = await fileToBase64(file)
      imagesPreview.push({ name: file.name, path: base64Image })
    }
    setPreview(prev => ({ ...prev, images: imagesPreview }))
  }

  useEffect(() => {
    if (watch('thumb'))
      handlePreviewThumb(watch('thumb')[0])
  }, [watch('thumb')])
  useEffect(() => {
    if (watch('images'))
      handlePreViewImages(watch('images'))
  }, [watch('images')])

  const handleCreateProduct = async (data) => {
    const invalids = validate(payload, setInvalidField)
    if (invalids === 0) {
      if (data.category) data.category = categories?.find(el => el._id === data.category)?.title
      const finalPayload = { ...data, ...payload }
      const formData = new FormData()
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
      if (finalPayload.thumb) formData.append('thumb', finalPayload.thumb[0])
      if (finalPayload.images) {
        for (let image of finalPayload.images) formData.append('images', image)
      }
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
      const response = await apiCreateProduct(formData)
      dispatch(showModal({ isShowModal: false, modalChildren: null }))
      if (response.success) {
        toast.success(response.mes)
        reset()
        setPreview({
          thumb: '',
          images: [],
        })
      } else toast.error(response.mes)
    }
  }

  // const handleRemoveImage = (name) => {
  //   const files = [...watch('images')]
  //   reset({
  //     images: files?.filter(el => el.name !== name)
  //   })
  //   if (preview.images?.some(el => el.name === name)) setPreview(prev => ({ ...prev, images: prev.images?.filter(el => el.name !== name) }))
  // }

  return (
    <div className='w-full'>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
        <span>Create New Product</span>
      </h1>
      <div className='px-5'>
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputForm
            label='Name Product'
            register={register}
            errors={errors}
            id='title'
            fullWidth
            placeholder='Name of New Product'
            validate={{
              required: 'Need fill this field',
            }}
          />
          <div className='w-full flex gap-4 my-6'>
            <InputForm
              label='Price'
              register={register}
              errors={errors}
              id='price'
              style='flex-1'
              placeholder='Price of New Product'
              type='number'
              validate={{
                required: 'Need fill this field',
              }}
            />
            <InputForm
              label='Quantity'
              register={register}
              errors={errors}
              id='quantity'
              style='flex-auto'
              placeholder='Quantity of New Product'
              type='number'
              validate={{
                required: 'Need fill this field',
              }}
            />
            <InputForm
              label='Color'
              register={register}
              errors={errors}
              id='color'
              style='flex-auto'
              placeholder='Color of New Product'
              validate={{
                required: 'Need fill this field',
              }}
            />
          </div>
          <div className='w-full flex gap-4 my-6'>
            <Select
              label='Category'
              option={categories?.map(el => ({ code: el._id, value: el.title }))}
              register={register}
              id='category'
              style='flex-auto'
              errors={errors}
              fullWidth
              validate={{ required: 'Need fill this field' }}
            />
            <Select
              label='Brand (Optional)'
              option={categories?.find(el => el._id === watch('category'))?.brand?.map(el => ({ code: el, value: el }))}
              register={register}
              id='brand'
              style='flex-auto'
              errors={errors}
              fullWidth
              validate={{ required: 'Need fill this field' }}
            />
          </div>
          <MarkDownEditor
            name='description'
            changeValue={changeValue}
            label='Description'
            invalidFields={invalidField}
            setInvalidFields={setInvalidField}
            validate={{ required: 'Need fill this field' }}
          />
          <div className='flex flex-col gap-2 py-2'>
            <label className='font-semibold text-xl' htmlFor="thumb">Upload Thumb </label>
            <input
              type="file"
              id='thumb'
              {...register('thumb', { required: 'Need fill this field' })}
              className="file:px-4 file:py-2 file:rounded file:border-none file:cursor-pointer file:bg-gray-400
              file:hover:text-white w-fit text-sm"
            />
            {errors['thumb'] && <small className='text-xs text-red-500'>{errors['thumb']?.message}</small>}
            {preview.thumb &&
              <div className='my-4'>
                <img src={preview.thumb} alt="thumbnail" className='w-[200px] object-contain' />
              </div>}
          </div>
          <div className='flex flex-col gap-2 py-2'>
            <label className='font-semibold text-xl' htmlFor="images">Upload Products </label>
            <input
              type="file"
              id='images'
              {...register('images', { required: 'Need fill this field' })}
              multiple
              className="file:px-4 file:py-2 file:rounded file:border-none file:cursor-pointer file:bg-gray-400
              file:hover:text-white w-fit text-sm"
            />
            {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
            {preview.images?.length > 0 &&
              <div className='my-4 flex flex-wrap w-full gap-3'>
                {preview.images?.map((el, index) => (
                  <div
                    onMouseEnter={() => setHoverEl(el.name)}
                    key={index} className='w-fit relative'
                    onMouseLeave={() => setHoverEl(null)}
                  >
                    <img src={el.path} alt="product" className='w-[200px] object-contain' />
                    {/* {hoverEl === el.name && <div
                      onClick={() => handleRemoveImage(el.name)}
                      className='absolute inset-0 cursor-pointer bg-overlay flex items-center justify-center'
                    >
                      <RiDeleteBin2Line size={50} color='white' />
                    </div>} */}
                  </div>
                ))}
              </div>}
          </div>
          <div className='mb-4'>
            <Button type='submit'>Create New Product</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProduct
