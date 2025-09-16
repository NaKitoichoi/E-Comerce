import { apiAddVarriant } from 'apis'
import Button from 'components/button/Button'
import Loading from 'components/common/Loading'
import InputForm from 'components/input/InputForm'
import React, { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { showModal } from 'store/app/appSlice'
import Swal from 'sweetalert2'
import { fileToBase64 } from 'ultils/helpers'

const CustomizeVarriants = ({ customizeVarriant, setCustomizeVarriant }) => {
    const { register, formState: { errors }, handleSubmit, reset, watch } = useForm()
    const dispatch = useDispatch()
    const [preview, setPreview] = useState({
        thumb: '',
        images: '',
    });
    useEffect(() => {
        reset({
            title: customizeVarriant?.title,
            price: customizeVarriant?.price,
            color: customizeVarriant?.color,
        })
    }, [customizeVarriant])

    const handleAddVarriant = async (data) => {
        if (data.color === customizeVarriant.color) Swal.fire('Oops!', 'Color not Changed', 'info')
        else {
            const formData = new FormData()
            for (let i of Object.entries(data)) formData.append(i[0], i[1])
            if (data.thumb) formData.append('thumb', data.thumb[0])
            if (data.images) {
                for (let image of data.images) formData.append('images', image)
            }
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            const response = await apiAddVarriant(formData, customizeVarriant._id)
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


    return (
        <div className='flex flex-col w-full gap-4 px-4 relative'>
            <div className='h-[69px] w-full'></div>
            <div className='fixed top-0 right-0 left-[327px] bg-gray-100 py-4 flex justify-between items-center px-4 border-b'>
                <h1 className='text-3xl font-bold tracking-tight'>Customize Varriant of Product</h1>
                <Button handleOnClick={() => setCustomizeVarriant(null)}>Cancel</Button>
            </div>
            <form onSubmit={handleSubmit(handleAddVarriant)} className='p-4 w-full flex flex-col'>
                <div className='w-full flex gap-4 items-center p-4'>
                    <InputForm
                        label='Original Name'
                        register={register}
                        errors={errors}
                        id='title'
                        fullWidth
                        style='flex-auto'
                        placeholder='Price of Varriant'
                        validate={{
                            required: 'Need fill this field',
                        }}
                    />
                </div>
                <div className='w-full flex gap-4 items-center p-4'>
                    <InputForm
                        label='Price Varriant'
                        register={register}
                        errors={errors}
                        id='price'
                        fullWidth
                        style='flex-auto'
                        placeholder='Price of Varriant'
                        validate={{
                            required: 'Need fill this field',
                        }}
                    />
                    <InputForm
                        label='Color Varriant'
                        register={register}
                        errors={errors}
                        id='color'
                        fullWidth
                        style='flex-auto'
                        placeholder='Color of Varriant'
                        validate={{
                            required: 'Need fill this field',
                        }}
                    />
                </div>
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
                                    key={index}
                                    className='w-fit relative'
                                >
                                    <img src={el} alt="product" className='w-[200px] object-contain' />
                                </div>
                            ))}
                        </div>}
                </div>
                <div className='mb-4'>
                    <Button type='submit'>Add Varriant</Button>
                </div>
            </form>
        </div>
    )
}

export default memo(CustomizeVarriants)
