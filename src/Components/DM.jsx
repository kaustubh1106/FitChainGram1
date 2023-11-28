import React from 'react'
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import '../styles/DM.css'
const DM = ({ Contract, Signer }) => {
    const [address1, setaddress1] = useState()
    const [address2, setaddress2] = useState()
    const [msg, setmsg] = useState()
    const [messages, setmessages] = useState({})
    const [connections, setconnections] = useState([])
    const [addtoconn, setaddtoconn] = useState();
    const [ans, setans] = useState()
    const fetch = async () => {
        try{const address = await Signer.address
        setaddress1(address)}catch{
            
        }
    }
    const fetchEvent = async () => {
        try{const connections1 = await Contract.filters.roomcreated(null, address1, null)
        const eve = await Contract.queryFilter(connections1)
        console.log(eve)
        setconnections(eve)
        // console.log(connections[0].args[0])
        console.log(connections)}catch{
            alert("please wait")
        }
    }
    //fetchEvent()
    const readmessage = async (add) => {
        try {
            console.log("click")
            const messages1 = await Contract.readMessage(add);
            setmessages(messages1)
            console.log(messages1[0][2])
            console.log(messages)
        } catch (error) {
            console.log(error)
        }
    }

    const withdraw = async () => {
        console.log(address2)
        try {
            const tx = await Contract.withdrawFunds(address2);
            tx.wait()
        } catch (error) {
            if (error.message.includes("time expired")) {
                alert("")
            }
            console.log(error)
            alert("error")
        }
    }
    const satisfy = async ()=>{
        try{
            await Contract.satisfied(address2,true);
        }catch(e){
            alert("all four question done")
        }
    }
    const check = (e) => {
        for (let i = 0; i < connections.length; i++) {
            if (addtoconn == connections[i] && addtoconn != "") {
                return true
            }
            else {
                return false
            }
        }
    }
    useEffect(() => {
        check()
        if (messages) {
            readmessage()
        }

    }, [])
    const sendmessage = async (address2) => {
        try{console.log(address2, msg)
        await Contract.sendMessage(address2, msg)}catch{
            console.log("wait")
        }
    }
    const connect = async (e) => {
        //e.preventDefault()
        //const addresstoconnect = document.getElementById('connect').value
        console.log("click")
        const amount1 = {
            value: ethers.parseEther('1.4')
        }
        console.log(addtoconn)
        try { await Contract.connectwithinstructor(addtoconn, amount1) }
        catch {
            alert("some error occured")
        }
    }
    useEffect(() => {
        if (Signer && Signer.address && Contract) {
            fetch()
            if (address1) {
                try {
                    fetchEvent()
                } catch { console.log("wait") }
            }
        }
    }, [Signer, Contract])

    return (
        <div style={{ height: '90vh' }}>
            <div className="card mb-3 mydiv1" style={{ maxWidth: "100%", height: "100%" }}>
                <div className="row g-0" style={{ height: '100%' }}>
                    <div className="col-md-4" style={{ borderRight: "2px solid #ccc", height: "100%" }}>
                        <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>                           <div>

                            <div className="card-header">Connections</div>
                            <div className="card-body">

                                <div className="card-body">
                                    <>
                                        {connections.map((logs) => (
                                            <div key={logs.args[0]}> {/* Ensure each item has a unique key */}
                                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => {
                                                    setaddress2(logs.args[0])
                                                    readmessage(logs.args[0])
                                                    setans(Number(logs.args[2][2]))
                                                    //console.log(logs.args[0])
                                                }}>
                                                    {logs.args[0]}
                                                </button>
                                            </div>
                                        ))}
                                    </>
                                </div>


                            </div>
                        </div>
                            <div className="card-footer text-body-secondary"><div className="input-group mb-3">
                                <input
                                    type="text"
                                    id='connect'
                                    className="form-control"
                                    placeholder="Connect"
                                    aria-label="Recipient's username"
                                    aria-describedby="button-addon2"
                                    onChange={(e) => setaddtoconn(e.target.value)}
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    id="button-addon2"
                                    style={{ color: "--bs-primary" }}
                                    onClick={connect}
                                >
                                    🤝🏻
                                </button>


                            </div></div>
                        </div>
                    </div>
                    <div className="col-md-8" style={{ maxWidth: "100%", height: "100%", borderLeft: "2px solid #ccc" }} >
                        <div className="card text-center" style={{ height: '100%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "space-between", height: '100%' }}>
                                <div className="card-header">Messages</div>
                                <div className="card-body">
                                    {/* {messages} */}
                                    <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    id="button-addon2"
                                    style={{ color: "--bs-primary" }}
                                    onClick={satisfy}
                                >
                                    satisfied {ans}
                                </button>

                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    id="button-addon2"
                                    style={{ color: "--bs-primary" }}
                                    onClick={() => withdraw()}
                                >
                                    withdraw
                                </button>
                                {
                                    address2 && messages.length > 0 ? messages.map((logs) => {
                                        return (
                                            <>
                                                <div>
                                                    {logs[2]}
                                                </div>

                                            </>
                                        )
                                    })
                                        : console.log("wait")
                                }

                            </div>
                        </div>

                        <div className="card-footer text-body-secondary" style={{ maxWidth: "100%", borderLeft: "2px solid #ccc" }}>< div className="input-group mb-3" >
                            <input
                                type="text"
                                id='message'
                                className="form-control"
                                placeholder="MESSAGE"
                                aria-label="Recipient's username"
                                aria-describedby="button-addon2"
                                onChange={(e) => setmsg(e.target.value)}
                            />
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                id="button-addon2"
                                style={{ color: "--bs-primary" }}
                                onClick={() => sendmessage(address2)}
                            >
                                ✉️
                            </button>

                        </div ></div>
                    </div>

                </div>
            </div>
        </div>
            { addtoconn }

        </div >

    )
}

export default DM


