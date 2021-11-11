import React, { useRef, useState} from 'react';
import logo from './Img/Rectangle 1.png'

const Chat = () => {
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [value, setValue] = useState('')
    const socket = useRef()
    const [connected, setConnected] = useState(false)
    const [id, setId] = useState('')

    function addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
    }

    function getDate() {
        return (`${addZero(new Date().getHours())}:${addZero(new Date().getMinutes())}`)
    }

    function connect(e) {

        e.preventDefault()

        socket.current = new WebSocket('wss://ws.qexsystems.ru')

        socket.current.onopen = () => {
            setConnected(true)
            socket.current.send(JSON.stringify({
                userId: id,
                yans: true,
                event: 'open',
                messageId: Date.now(),
            }))
        }

        socket.current.onclose= () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }

        socket.current.onmessage = function(event) {
            try {
                if (JSON.parse(event.data).yans) {
                    const message = JSON.parse(event.data)
                    switch (message.event) {
                        case 'message':
                            setMessages(prev => [message, ...prev])
                            break;
                        case 'open':
                            socket.current.send(JSON.stringify({
                                userId: id,
                                yans: true,
                                event: 'openResponse',
                            }))
                            setUsers(prev => [message.userId, ...prev])
                            break
                        case 'openResponse':
                            setUsers(prev => [message.userId, ...prev])
                            break
                        default:
                            break;
                    }
                     
                }
            } catch (error) {
                return undefined
            }
          }
    }

    const sendMessage = (e) => {
        e.preventDefault()
        const message = 
        {
            text: value,
            id: id,
            yans: true,
            event: 'message',
            time: getDate(),
            messageId: Date.now(),
            
        }
        socket.current.send(JSON.stringify(message))
        setMessages(prev => [message, ...prev])
        setValue('')
    }

    if (!connected) {
        return(
            <div className="w-full h-screen flex justify-center items-center flex-col">
                <h1 className="text-lg my-4">Введи имя</h1>
                <form onSubmit={(id !== '') ? e => connect(e, users) : e => e.preventDefault()} className="flex flex-row">
                    <input className="rounded border border-green-500" value={id} onChange={e => setId(e.target.value)} type="text" placeholder="Введи имя"/>
                    <button className="rounded border mx-4" type='submit'>Вход</button>
                </form>
            </div>
        )
    }


    return (
        <div>
            <div className="w-full h-[75px] bg-[#0F0F0F] flex flex-row">
                    {users.map( user =>  
                        <div className="text-white flex flex-row items-center mr-4" key={Math.random()}>
                            <img src={logo} alt="" className="mr-[18px] h-[45px] w-[45px] rounded-full bg-contain"/>
                            <p className="font-semibold text-[26px] text-[#D9D9D9]">{user}</p>
                        </div>) 
                    }
            </div>
            <div className="messages overflow-y-auto flex flex-col-reverse flex-grow bg-[#1A1A1A] px-[30px] pt-[35px]">
                <div className="flex flex-auto"></div>
                {messages.map(mess =>
                    <div key={mess.messageId} className={(mess.id===id) ? "flex justify-end pt-[9px]" : "flex justify-start pt-[9px]"}>
                        <div className="flex flex-row">
                            {(mess.id!==id) 
                            ?   <div className="items-end flex mr-[17px]">
                                    <img src={logo} className="w-[60px] h-[60px]" alt="" />
                                </div>
                            :   undefined}
                            <div className={(mess.id===id) ? "border px-[16px]  pt-[10px] pb-[5px] bg-[#14ff72] bg-opacity-70 text-white max-w-[470px] rounded-[9px] break-words flex flex-col" : 'border px-[16px] pt-[10px] pb-[5px] bg-[#464646] text-white max-w-[470px] rounded-[9px] break-words flex flex-col'}>
                                <p className={mess.id === id ? "hidden" : "text-[20px] font-bold text-[#ECECEC]"}>{mess.id}</p>
                                <p className="text-[19px]">{mess.text}</p>
                                <p className="text-right">{mess.time}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-[#3A3A3A] w-full h-[69px]">
                <form onSubmit={value!== '' ? e => sendMessage(e) :  e => e.preventDefault()} className="flex-row flex px-[28px] py-[15px] justify-between">
                    <input className="font-light text-[26px] text-[#D1D1D1] w-full h-full bg-transparent focus:outline-none" value={value} onChange={e => setValue(e.target.value)} type="text" placeholder="Enter text message..."/>
                    <div className="cursor-pointer" onClick={value!=='' ? sendMessage : undefined}>
                        {(value === '') 
                        ?   <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M34.9222 2.00038C35.0017 1.80162 35.0212 1.58387 34.9782 1.37415C34.9352 1.16442 34.8315 0.971925 34.6801 0.820535C34.5287 0.669146 34.3363 0.565517 34.1265 0.522494C33.9168 0.479472 33.699 0.498948 33.5003 0.578509L33.2925 0.661634L1.67872 13.3054L1.67653 13.3076L0.687783 13.7013C0.500511 13.776 0.337532 13.901 0.216848 14.0625C0.0961641 14.2241 0.0224721 14.4158 0.00391212 14.6165C-0.0146478 14.8173 0.0226467 15.0193 0.111676 15.2002C0.200705 15.3811 0.338005 15.5339 0.508408 15.6416L1.40528 16.2104L1.40747 16.2148L11.389 22.5651L12.334 23.1666L12.9356 24.1116L19.2859 34.0932L19.2903 34.0976L19.859 34.9944C19.9671 35.1642 20.12 35.3008 20.3008 35.3893C20.4815 35.4778 20.6832 35.5146 20.8836 35.4959C21.0839 35.4771 21.2753 35.4034 21.4364 35.2829C21.5976 35.1624 21.7225 34.9998 21.7972 34.8129L22.1931 33.8219L34.839 2.20601L34.9222 1.9982V2.00038ZM30.9125 6.13476L31.9428 3.55788L29.3659 4.5882L12.9728 20.9813L13.7122 21.4516C13.8478 21.5378 13.9629 21.6528 14.049 21.7885L14.5193 22.5279L30.9125 6.13476Z" fill="#9B9B9B"/>
                            </svg>
                        :   <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M34.9229 1.5002C35.0024 1.30144 35.0219 1.08369 34.9789 0.873962C34.9359 0.664233 34.8323 0.471742 34.6809 0.320352C34.5295 0.168963 34.337 0.0653336 34.1273 0.0223111C33.9175 -0.0207115 33.6998 -0.00123505 33.501 0.0783258L33.2932 0.161451L1.67945 12.8052L1.67727 12.8074L0.688515 13.2011C0.501244 13.2758 0.338265 13.4008 0.217581 13.5624C0.0968965 13.7239 0.0232045 13.9156 0.00464454 14.1164C-0.0139154 14.3171 0.0233791 14.5191 0.112409 14.7C0.201438 14.8809 0.338737 15.0337 0.50914 15.1414L1.40602 15.7102L1.4082 15.7146L11.3898 22.0649L12.3348 22.6665L12.9363 23.6115L19.2866 33.593L19.291 33.5974L19.8598 34.4943C19.9679 34.664 20.1207 34.8006 20.3015 34.8891C20.4823 34.9776 20.6839 35.0144 20.8843 34.9957C21.0847 34.9769 21.276 34.9032 21.4372 34.7827C21.5984 34.6622 21.7232 34.4996 21.7979 34.3127L22.1938 33.3218L34.8398 1.70583L34.9229 1.49801V1.5002ZM30.9132 5.63458L31.9435 3.0577L29.3666 4.08801L12.9735 20.4811L13.7129 20.9515C13.8486 21.0376 13.9636 21.1526 14.0498 21.2883L14.5201 22.0277L30.9132 5.63458Z" fill="#14FF72"/>
                            </svg>}
                    </div>
                </form>
            </div>
        </div>
        
    );
};

export default Chat;
