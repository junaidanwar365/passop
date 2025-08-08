import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const ref = useRef()
    const passRef = useRef()
    const [form, setform] = useState({ site: "", user: "", pass: "" })
    const [passArray, setpassArray] = useState([])

    const getPasswords=async() => {
      let req=await fetch("/api/passwords")
      let password=await req.json()
      setpassArray(password)
    }
    
    useEffect(() => {

        getPasswords()
        // let password = localStorage.getItem("pass");
        // if (password) {
        //     setpassArray(JSON.parse(password))
        // }
    }, [])

    const showPassword = () => {
        if (passRef.current.type == "password") {
            passRef.current.type = "text"
        } else {
            passRef.current.type = "password"
        }
        if (ref.current.getAttribute('state') === 'hover-cross') {
            ref.current.removeAttribute('state');  // Remove the 'state' attribute
        } else {
            ref.current.setAttribute('state', 'hover-cross');  // Add the 'state' attribute
        }
    }

    const savePassword = async() => {
        if (form.site.length > 3 && form.user.length > 3 && form.pass.length > 3) {


            const newPass = form.id ? form : { ...form, id: uuidv4() };

            let passID = [...passArray, newPass];
            setpassArray(passID);
    
            // POST or PUT depending on whether it's a new entry or an edited entry
            const method = form.id ? "PUT" : "POST";
            
            await fetch("/api/passwords", { 
                method: method, 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(newPass) 
            });
            // await fetch("http://localhost:3000/",{ method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })

            // let passID = [...passArray, { ...form, id: uuidv4() }]
            // setpassArray(passID)

            // await fetch("http://localhost:3000/",{ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: uuidv4() }) })
            // localStorage.setItem("pass", JSON.stringify(passID))
            // console.log(passID)

            // Clear the input fields after saving
            setform({ site: "", user: "", pass: "" });
        } else {
            toast("Error: Password is not Saved!")
        }
    }

    const editPassword = async(id) => {

        // setform({...passArray.filter(i => i.id === id)[0],id:id})
        setform({ ...passArray.find(i => i.id === id) });
        setpassArray(passArray.filter(item => item.id !== id))

    }
    const delPassword = async(id) => {
        setpassArray(passArray.filter(item => item.id != id))
        await fetch("/api/passwords",{ method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({id}) })
        // localStorage.setItem("pass", JSON.stringify(passArray.filter(item => item.id !== id)))
    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }
    const copyText = (text) => {
        toast('🦄 Copy to ClipBoard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        navigator.clipboard.writeText(text);
    }



    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"

            />
            <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div></div>

            <div className="p-3 md:mycontainer min-h-[87vh] text-center">
                <h1 className='text-4xl font-bold '>
                    <span className='text-green-500'> &lt;</span>
                    <span>Pass</span><span className='text-green-500'>OP/&gt;</span>
                </h1>
                <p className='text-green-900 text-lg'>Your Own Password Manager</p>

                <div className=" flex items-center  flex-col p-4 gap-8">
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' className='rounded-full border border-green-500 w-full px-4 py-1' type="text" name='site' />

                    <div className="flex flex-col md:flex-row  w-full justify-between gap-8">

                        <input value={form.user} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-green-500 w-full px-4 py-1' type="text" name='user' />

                        <div className='relative w-full'>

                            <input ref={passRef} value={form.pass} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full px-4 py-1' type="password" name='pass' />

                            <span className='absolute right-4 cursor-pointer' onClick={showPassword}>
                                <lord-icon //eye-icon
                                    src="https://cdn.lordicon.com/zpwnkfbk.json"
                                    stroke="bold" trigger="hover" ref={ref}>
                                </lord-icon>
                            </span>
                        </div>

                    </div>
                    <button onClick={savePassword} className='flex gap-3 bg-green-500 border-2 border-green-900 hover:bg-green-400 rounded-full w-fit py-2 px-5'>
                        <lord-icon //addicon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover"
                        >
                        </lord-icon>
                        Save Password
                    </button>
                </div>
{/* PASSWORD TABLE  */}
                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4 text-start'>Your Passwords</h2>
                    {passArray.length === 0 && <div> No Password To Show </div>}
                    <div className="w-full overflow-x-auto">
                    {passArray.length != 0 && <table className='min-w-[600px] table-auto mb-4  w-full rounded-md overflow-hidden'>
                        <thead>
                            <tr className='bg-green-800 text-white'>
                                <th className='py-2 border border-white'>Sites</th>
                                <th className='py-2 border border-white'>Usernames</th>
                                <th className='py-2 border border-white'>Passwords</th>
                                <th className='py-2 border border-white'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {passArray.map((item, index) => (
                                <tr key={index} className='bg-green-100'>
                                    <td className='border border-white w-[25%]'>
                                        <div className="flex justify-center items-center gap-2">
                                            <a  href={item.site} target='_blank'>{item.site}</a>
                                            <div onClick={() => copyText(item.site)}>
                                                <lord-icon
                                                    style={{ "width": "20px", "height": "20px", "cursor": "pointer" }}
                                                    src="https://cdn.lordicon.com/xpgofwru.json"
                                                    trigger="hover">
                                                </lord-icon></div>
                                        </div>
                                    </td>
                                    <td className='border border-white w-[25%]'>
                                        <div className="flex justify-center items-center gap-2"><div >{item.user}</div><div onClick={() => copyText(item.user)}>
                                            <lord-icon
                                                style={{ "width": "20px", "height": "20px", "cursor": "pointer" }}
                                                src="https://cdn.lordicon.com/xpgofwru.json"
                                                trigger="hover">
                                            </lord-icon></div>
                                        </div>
                                    </td>
                                    <td className='border border-white w-[25%]'>
                                        <div className="flex justify-center items-center gap-2"><div>{"*".repeat(item.pass.length)}</div> <div onClick={() => copyText(item.pass)}>
                                            <lord-icon
                                                style={{ "width": "20px", "height": "20px", "cursor": "pointer" }}
                                                src="https://cdn.lordicon.com/xpgofwru.json"
                                                trigger="hover">
                                            </lord-icon></div>
                                        </div>
                                    </td>
                                    <td className='border border-white w-[25%]'>
                                        <div className="flex justify-center items-center gap-2 ">
                                            <div onClick={() => { editPassword(item.id) }}><lord-icon //Edit
                                                style={{ "width": "25px", "height": "25px", "cursor": "pointer" }}
                                                src="https://cdn.lordicon.com/wuvorxbv.json"
                                                trigger="hover" stroke="bold" state="hover-line">
                                            </lord-icon></div>

                                            <div onClick={() => { delPassword(item.id) }}><lord-icon //delete
                                                style={{ "width": "25px", "height": "25px", "cursor": "pointer" }}
                                                src="https://cdn.lordicon.com/drxwpfop.json"
                                                trigger="hover" stroke="bold" >
                                            </lord-icon></div>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    }</div>
                </div>

            </div >
        </>
    )
}

export default Manager
