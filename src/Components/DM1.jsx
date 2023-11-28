import React from 'react'
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
const DM1 = ({ Contract, Signer }) => {
    const [address1, setaddress1] = useState()
    const [address2, setaddress2] = useState()
    const [messages, setmessages] = useState({})
    const [connections, setconnections] = useState([])
   
    const [msg, setmsg] = useState()
    const fetch = async () => {
        const address = await Signer.address
        setaddress1(address)
    }
    const fetchEvent = async () => {
        try{const connections1 = await Contract.filters.roomcreated(address1, null, null)
        console.log(connections1)
        const eve = await Contract.queryFilter(connections1)
        console.log(eve)
        setconnections(eve)
        // console.log(connections[0].args[0])
        console.log(connections)}catch{}
    }
    const readmessage = async () => {
        try{console.log("click")
        const messages1 = await Contract.readMessage(address2);
        setmessages(messages1)
        console.log(messages)}catch{

        }
    }

    const withdraw = async () => {
        console.log(address2)
        try{
            await Contract.withdrawFunds(address2);
            
        }catch(error){
            if(error.message.includes("time expired")){
                alert("")
            }
            console.log(error)
            alert("time not expired")
        }
    }
    useEffect(() => {
      fetch()
    }, [])
    const gettime = (time)=>{
        let temp=time+60;
        const currentUnixTimestamp = Math.floor(Date.now() / 1000);
        if(currentUnixTimestamp>=time+60){
            console.log("time");
        }
        else{
            console.log("abc")
        }
        // console.log(time)
    }
    const sendmessage = async (address2) => {
        try{console.log(address2, msg)
        await Contract.sendMessage(address2, msg)}catch{
            console.log("wait")
        }
    }
    
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
                                                    gettime(Number(logs.args[2][0]))
                                                    setaddress2(logs.args[1])
                                                    
                                                    readmessage(address2)
                                                    
                                                }}>
                                                    {logs.args[1]}
                                                </button>
                                            </div>
                                        ))}
                                    </>
                                </div>
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    id="button-addon2"
                                    style={{ color: "--bs-primary" }}
                                    onClick={fetchEvent}
                                >
                                    ✉️
                                </button>

                            </div>
                        </div>
                            {/* <div className="card-footer text-body-secondary"><div className="input-group mb-3">
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


                            </div></div> */}
                        </div>
                    </div>
                    <div className="col-md-8" style={{ maxWidth: "100%", height: "100%", borderLeft: "2px solid #ccc" }} >
                        <div className="card text-center" style={{ height: '100%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "space-between", height: '100%' }}>
                                <div className="card-header">Messages </div>
                                <div className="card-body">
                                    {/* {messages} */}
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
            

        </div>

    )
}

export default DM1
