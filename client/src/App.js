import './App.css';
import React,{useEffect,createContext,useReducer, useContext} from 'react';
import {BrowserRouter,Route,Routes,useNavigate} from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './components/Home';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost'
import UserProfile from './components/UserProfile'
import SubscribedUserPost from "./components/SunscribedUserPost"
import Reset from './components/reset';
import Newpassword from "./components/Newpassword"
import {reducer,initialState} from './reducers/userReducer'

export const UserContext = createContext()

const Routing = () =>{
  const navigate = useNavigate()
  const {state,dispatch} = useContext(UserContext)
  useEffect(() =>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER", payload:user})
    }else{
      if(!window.location.pathname.startsWith("/reset"))
      navigate('/signin')
    }
  },[])

  return (
    <>
      <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route path="/create" element={<CreatePost/>} />
          <Route path="/profile/:userid" element={<UserProfile/>} />
          <Route path="/myfollowingpost" element={<SubscribedUserPost/>} />
          <Route exact path="/reset" element={<Reset/>} />
          <Route path="/reset/:token" element={<Newpassword/>} />
       </Routes>
    </>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
       <BrowserRouter>
          <Navbar />
          <Routing />
       </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App;
