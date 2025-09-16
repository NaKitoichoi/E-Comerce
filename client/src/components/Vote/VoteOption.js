import React, { memo, useRef, useEffect, useState } from 'react'
import logo from 'assets/logo.png'
import { voteOption } from 'ultils/constants'
import { TiStarFullOutline } from "react-icons/ti";
import {Button} from 'components'


const VoteOption = ({ nameProduct, handleSubmitVoteOption }) => {
    const modalRef = useRef()

const [choosenScore, setChoosenScore] = useState(null);
const [comment, setComment] = useState('');
const [score, setScore] = useState(null);

    useEffect(() => {
        modalRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
    },[])
    return (
        <div onClick={e => e.stopPropagation()} ref={modalRef} className='bg-white w-[700px] flex flex-col p-4 gap-4 items-center justify-center'>
            <img src={logo} alt="logo" className='w-[300px] my-8 object-contain' />
            <h2 className='text-center text-medium text-lg'>{`Voting product ${nameProduct}`}</h2>
            <textarea 
            className='w-full form-textarea text-sm placeholder:italic placeholder:text-xs placeholder:text-gray-500' 
            placeholder='Type something...'
            value={comment}
            onChange={e => setComment(e.target.value)}
            >
            </textarea>
            <div className='w-full flex flex-col gap-4'>
                <p className='text-center'>How do you like this product?</p>
                <div className='flex items-center justify-center gap-4'>
                    {voteOption.map(el => (
                        <div className='flex flex-col w-[100px] h-[100px] items-center justify-center p-4 gap-2 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer'
                         key={el.id}
                         onClick={() => {
                            setChoosenScore(el.id)
                            setScore(el.id)
                         }}
                         >
                            {Number(choosenScore) && choosenScore >= el.id ? <TiStarFullOutline color='orange'/> : <TiStarFullOutline color='gray'/>}
                            <span>{el.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            <Button handleOnClick={() => handleSubmitVoteOption({comment, score})} fw>Submit</Button>
        </div>
    )
}

export default memo(VoteOption)
