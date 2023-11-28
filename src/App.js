import { Contract, ethers } from 'ethers';
import './App.css';
import { useState, useEffect } from 'react';
import instance from './Twitter.json'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Instructor from './Components/Instructor';
import User from './Components/User';
import Navbar from './Components/Navbar.jsx';
import Createpost from './Components/Createpost.jsx'
import Feed from './Components/Feed.jsx'
import Follow from './Components/Follow.jsx'
import DM from './Components/DM.jsx'
import DM1 from './Components/DM1.jsx'
function App() {
  window.ethereum.on('accountsChanged', () => {
    console.log("accound changed");
    window.location.reload()
  })
  const contractaddress = instance.networks[5777].address;
  const abi = instance.abi;
  const [state, setstate] = useState({
    provider: null,
    signer: null,
    contract: null
  })

  useEffect(() => {
    const connectToMetamask = async () => {
      try {
        if (window.ethereum == null) {
          alert("install metamask")
        } else {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          const contract = new Contract(contractaddress, abi, signer)
          console.log(contract)
          setstate({
            provider,
            signer,
            contract
          })
          let p = await state.contract
          console.log(state.contract)
          if (p != null) {
            console.log(state.contract)
          }

        }
      } catch (e) {
        alert("failed to connect")
      }
    }
    connectToMetamask()
  }, [])





  return (
    <div className="App">
       <Router>
         <Navbar />
         <Routes>
           <Route path='/Loginasuser' element={<Instructor Contract={state.contract} Signer={state.signer} />} />
           <Route path='/Loginasinstructor' element={<User Contract={state.contract} Signer={state.signer} />} />
           <Route path="/Loginasuser/createpost" element={<Createpost Contract={state.contract} Signer={state.signer} />} />
           <Route path="/Loginasuser/feed" element={<Feed Contract={state.contract} Signer={state.signer} />} />
           <Route path='/Loginasinstructor/follow' element={<Follow Contract={state.contract} Signer={state.signer} />} />
           <Route path='/Loginasinstructor/chat' element={<DM Contract={state.contract} Signer={state.signer} />} />
           <Route path='/Loginasuser/chat' element={<DM1 Contract={state.contract} Signer={state.signer} />} />
         </Routes>
       </Router>
    </div>
  );
}

export default App;
