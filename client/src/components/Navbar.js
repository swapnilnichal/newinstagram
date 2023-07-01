import React,{useContext,useRef,useEffect,useState} from "react";
import {Link,useNavigate} from 'react-router-dom'
import M from "materialize-css"
import {UserContext} from '../App'

const Navbar = ()=>{
    const searchModal = useRef(null)
    const [userDetails,setUserDetails] = useState([])
    const [search,setSearch] = useState('')
    const {state,dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    useEffect(()=>{
         M.Modal.init(searchModal.current)
    },[])

    const renderList = () =>{
      if(state){
        return[
          <li key="1"><i data-target="modal1" id="nav-icon" className="material-icons modal-trigger" style={{color:"black",marginRight:"20px"}}>search</i></li>,
          <li key="3">
            <Link to="/create">
             <div style={{ display: 'flex', alignItems: 'center' }}>
               <i className="material-icons" id="nav-icon" style={{color:"black",marginRight:"10px"}}>add_box</i><span className="hidelink">create post</span>  
             </div>
             </Link>   
          </li>,
          <li key="4"><Link to="/myfollowingpost"><span className="hidelink">My Following Posts</span></Link></li>,
          <li key="5">
                <button className="Btn"  onClick={()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    navigate('/signin')
                }}>
                  <div className="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
                  <div className="text">Logout</div>
              </button>
          </li>
        ]
      }
      else {
        return[
          <li key="6"><Link to="/signup">Signup</Link></li>,
          <li key="7"><Link to="/signin">Signin</Link></li>
        ]
      }
    }

    const fetchUsers = (query)=>{
       setSearch(query)
       fetch("/search-users",{
            method: "post",
            headers:{
                 "Content-Type": "application/json"
            },
            body: JSON.stringify({
              query
           })
       }).then(res=>res.json())
       .then(results=>{
           setUserDetails(results.user)
       })
    }

    return(
    <nav>
        <div className="nav-wrapper white">
           {state ? (
             <ul>
               <li>
               <Link to="/profile">
                 <div style={{ display: 'flex', alignItems: 'center' }}>
                   <img
                      style={{ height: "30px", width: "30px", borderRadius: "15px",marginRight:"10px" }}
                      src={state ? state.pic : "loading"}
                      className="profilepic"
                      alt="Profile"
                   />
                      <span className="hidelink">Profile</span>  
                </div>
               </Link>
              </li>
             </ul>     
            ) : null}
             
          <Link to={state?'/':'/signin'}  className="brand-logo center left" >Instagram</Link>
             <ul id="nav-mobile" className="right">
                {renderList()}    
             </ul>
        </div>

        <div id="modal1" className="modal"  ref={searchModal}>
          <div className="modal-content" style={{color:"black"}}>
          <input type="text" placeholder="Search Users" value={search} onChange={(e)=>fetchUsers(e.target.value)}/>
          <ul className="collection vertical-list">
            {
              userDetails.map(item=>{
                return <li key={item._id} className="collection-item">
                         <Link to={item._id !== state._id ? "/profile/"+item._id : "/profile"}
                           onClick={()=> {
                              M.Modal.getInstance(searchModal.current).close()
                              setSearch('')
                           }}>
                             {item.email}
                         </Link>
                       </li>
              })
            }
          </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
          </div>
        </div>
    </nav>
  );
}

export default Navbar;