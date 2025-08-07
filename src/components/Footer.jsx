import React from 'react'

const Footer = () => {
    return (
        <div className='bg-slate-800 fixed bottom-0  text-white flex flex-col justify-center items-center w-full'>
            <div className="logo font-bold text-white text-2xl">
                <span className='text-green-500'> &lt;</span>

                <span>Pass</span><span className='text-green-500'>OP/&gt;</span>


            </div>
            <div className='flex justify-center items-center'> Created with <lord-icon
                src="https://cdn.lordicon.com/zjhryiyb.json"
                trigger="hover"
                colors="primary:#f28ba8,secondary:#f28ba8,tertiary:#ffc738,quaternary:#f28ba8,quinary:#f24c00">
            </lord-icon> by Junaid Anwar </div>
        </div>
    )
}

export default Footer
