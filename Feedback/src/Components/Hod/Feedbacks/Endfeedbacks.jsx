import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Auth/AuthContext'
import { BarLoader } from 'react-spinners'
import { AiOutlineEye } from "react-icons/ai"
import axios from "axios"
import { useNavigate } from 'react-router-dom'

const Endfeedbacks = () => {

    console.log("ayhh")
    const { theme } = useAuth()
    const [fbacks, setfbacks] = useState([]);
    const [dep, setdep] = useState("")
    const uid = localStorage.getItem("userid")
    const [loader, setloader] = useState(false)
    const navigate = useNavigate()
    console.log(uid)

    const getuser = async () => {
        setloader(true)
        try {
            setloader(true)

            const { data } = await axios.post(`http://localhost:3000/api/v3/user`, {
                id: uid
            });
            console.log(data);
            setdep(data.user.department);
            console.log(data.user.department)
            getfbydep()
            setloader(false);

        } catch (error) {
        }
    }

    const getfbydep = async () => {
        setloader(true)
        console.log(dep)
        try {
            setloader(true)
            const { data } = await axios.post("http://localhost:3000/api/v2/ecfeedbackby", {
                dep: dep
            });
            console.log(data)
            setfbacks(data.feedback)
            setloader(false)
        } catch (error) {
        }
    }


    useEffect(() => {
        console.log("useEffect triggered");
        getuser();
    }, [uid]);

    useEffect(() => {
        if (dep) {
            getfbydep();
        }
    }, [dep]);



    return (
        <div className={`${theme == "light" ? "bg-white" : "bg-[#1d232a]"} h-[91vh] overflow-y-auto p-5 w-full`}>
            <h1 className={`text-xl font-bold ${theme == "light" ? "text-black" : "text-white"}`}>End-Station FeedBack</h1>
            {loader ? <section className='h-[70vh] flex justify-center items-center'>
                <BarLoader size={23} color='blue' />
            </section> :
                <div className='flex justify-center'>
                    <div className={` ${theme == "light" ? "bg-[#f5f1f0]" : "bg-[#0c131d]"}  h-[80vh] mt-5 overflow-y-auto w-[100%] sm:w-[90%] pb-2 rounded-lg `}>


                        <table className='border-collapse  w-[100%] '>
                            <thead>
                                <tr className=' bg-blue-700 '>
                                    <th className='p-2 py-2 text-left text-white text-lg '>Index</th>
                                    <th className='p-2 text-left py-2 text-white text-lg'>Public</th>
                                    <th className='p-2 text-left py-2 text-white text-lg'>Enroll</th>
                                    {/* <th className='p-2 text-left py-2 text-white text-lg'>Student</th> */}
                                    <th className='p-2 text-left py-2 text-white text-lg'>Status</th>
                                </tr>
                            </thead>
                            <>

                                {fbacks.map((item, index) => {
                                    const name = item.student?.name;
                                    const maskedName =
                                        name.length > 2
                                            ? `${name.charAt(0)}${'*'.repeat(name.length - 2)}${name.charAt(name.length - 1)}`
                                            : name;
                                    return (
                                        <tr className={`${theme == "light" ? "hover:bg-gray-300 " : "hover:bg-slate-950"}`} key={index}>
                                            <td className=' p-2 font-semibold text-left  text-sm'>{index + 1}</td>
                                            <td className=' p-2 font-semibold  cursor-pointer text-left' >{maskedName}</td>
                                            <td className=' p-2 font-semibold cursor-pointer text-left' >{item.student?.Enroll}</td>

                                            <td onClick={() => navigate(`/hod/ecmain/${item._id}`)} className=' p-2 font-semibold text-left flex cursor-pointer ' > View<AiOutlineEye size={23} className='mx-1 mt-1' /></td>
                                        </tr>
                                    )
                                }


                                )
                                }
                            </>


                        </table>
                    </div>
                </div>}



        </div >
    )
}

export default Endfeedbacks
