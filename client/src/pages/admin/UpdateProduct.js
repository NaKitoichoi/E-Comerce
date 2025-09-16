import { Button, InputForm, MarkDownEditor, Select, Loading } from 'components'
import React, { memo, useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { validate, fileToBase64,capitalizeWords } from 'ultils/helpers'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { showModal } from 'store/app/appSlice'
import { apiUpdateProduct } from 'apis'



const UpdateProduct = ({ editProduct, render, setEditProduct }) => {
    const { register, formState: { errors }, handleSubmit, reset, watch } = useForm()
    const dispatch = useDispatch()
    const { categories } = useSelector(state => state.app)
    const [invalidField, setInvalidField] = useState([]);
    const [hoverEl, setHoverEl] = useState(null);
    const [isFocusDescription, setIsFocusDescription] = useState(null);

    const [payload, setPayload] = useState({
        description: '',
    });
    const [preview, setPreview] = useState({
        thumb: null,
        images: [],
    });

    useEffect(() => {
        reset({
            title: editProduct?.title || '',
            price: editProduct?.price || '',
            quantity: editProduct?.quantity || '',
            color: editProduct?.color || '',
            category: editProduct?.category || '',
            brand: editProduct?.brand || '',
        })
        setPayload({ description: typeof editProduct?.description === 'object' ? editProduct?.description.join(',') : editProduct?.description })
        setPreview({
            thumb: editProduct?.thumb || '',
            images: editProduct?.images || [],
        })
    }, [editProduct])
    


    const changeValue = useCallback((e) => {
        setPayload(e)
    }, [payload])

    const handlePreviewThumb = async (file) => {
        const base64Thumb = await fileToBase64(file)
        setPreview(prev => ({ ...prev, thumb: base64Thumb }))
    }
    const handlePreViewImages = async (files) => {
        const imagesPreview = []
        for (let file of files) {
            const base64Image = await fileToBase64(file)
            imagesPreview.push(base64Image)
        }
        setPreview(prev => ({ ...prev, images: imagesPreview }))
    }

    useEffect(() => {
        if (watch('thumb') instanceof FileList && watch('thumb')?.length > 0)
            handlePreviewThumb(watch('thumb')[0])
    }, [watch('thumb')])
    useEffect(() => {
        if (watch('images') instanceof FileList && watch('images')?.length > 0)
            handlePreViewImages(watch('images'))
    }, [watch('images')])

    const handleUpdateProduct = async (data) => {
        const invalids = validate(payload, setInvalidField)
        if (invalids === 0) {
            if (data.category) data.category = categories?.find(el => el.title === data.category)?.title
                const finalPayload = { ...data, ...payload }
                finalPayload.thumb = data.thumb instanceof FileList && data.thumb?.length > 0 ? data?.thumb[0] : preview?.thumb
                const formData = new FormData()
                for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
                finalPayload.images = data.thumb instanceof FileList && data.images?.length > 0 ? data?.images : preview?.images


                for (let image of finalPayload.images) formData.append('images', image)
                dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
                const response = await apiUpdateProduct(formData, editProduct._id)

                dispatch(showModal({ isShowModal: false, modalChildren: null }))
                if (response.success) {
                    toast.success(response.mes)
                    render()
                    setEditProduct(null)
                } else toast.error(response.mes)
            }
        }

        return (
            <div className='flex flex-col w-full gap-4 px-4 relative'>
                <div className='h-[69px] w-full'></div>
                <div className='fixed top-0 right-0 left-[327px] bg-gray-100 py-4 flex justify-between items-center px-4 border-b'>
                    <h1 className='text-3xl font-bold tracking-tight'>Update Product</h1>
                    <Button handleOnClick={() => setEditProduct(null)}>Cancel</Button>
                </div>
                <div className='px-5'>
                    <form onSubmit={handleSubmit(handleUpdateProduct)}>
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
                                option={categories?.map(el => ({ code: el.title, value: el.title }))}
                                register={register}
                                id='category'
                                style='flex-auto'
                                errors={errors}
                                fullWidth
                                validate={{ required: 'Need fill this field' }}
                            />
                            <Select
                                label='Brand (Optional)'
                                option={categories?.find(el => el.title === watch('category'))?.brand?.map(el => ({ code: el, value: el }))}
                                value={watch('brand')}
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
                            value={payload.description}
                            setIsFocusDescription={setIsFocusDescription}
                        />
                        <div className='flex flex-col gap-2 py-2'>
                            <label className='font-semibold text-xl' htmlFor="thumb">Upload Thumb </label>
                            <input
                                type="file"
                                id='thumb'
                                {...register('thumb')}
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
                                {...register('images')}
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
                                            <img src={el} alt="product" className='w-[200px] object-contain' />
                                        </div>
                                    ))}
                                </div>}
                        </div>
                        <div className='mb-4'>
                            <Button type='submit'>Update Product</Button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    export default memo(UpdateProduct)
