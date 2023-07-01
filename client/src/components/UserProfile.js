import React,{useState,useEffect, useContext} from "react";
import {useParams} from "react-router-dom"
import {UserContext} from "../App"

const Profile = ()=>{
    const [userProfile,setProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showfollow,setShowfollow] = useState(state?!state.following.includes(userid):true)

    useEffect(()=>{
        fetch(`/user/${userid}`,{
          headers: {
            "authorization":"Bearer "+localStorage.getItem("jwt")
          }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            if(result.user && result.posts){
                setProfile(result)
            }
            else {console.log( "user and post is not found")}
        })
    },[])

    const followUser = () =>{
        fetch('/follow',{
            method:"put",
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer '+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowfollow(false)
        })
    }

    const unfollowUser = () =>{
        fetch('/unfollow',{
            method:"put",
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer '+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setShowfollow(true)
        })
    }

    const imageStyle = windowWidth < 600 ? { height: "120px", width: "120px", borderRadius: "60px", marginTop:"20px"} : { height: "160px", width: "160px", borderRadius: "80px" };


    return(
        <>
        {
          userProfile ?
          <div style={{maxWidth:"550px",margin:"0px auto"}}>
          <div style={{display:"flex",
                justifyContent:"space-evenly",
                margin:"18px 0px",
                borderBottom:"1px solid grey"}}>
              <div>
                  <img style={imageStyle}
                  src={userProfile.user.pic} />
              </div>
              <div>
                  <h4>{userProfile.user.name}</h4>
                  <h5>{userProfile.user.email}</h5>
                  <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                      <h6>{userProfile.posts.length} Posts</h6>
                      <h6>{userProfile.user.followers.length} Followers</h6>
                      <h6>{userProfile.user.following.length} Following</h6>
                  </div>
                  {
                    showfollow ? 
                      <button className="btn waves-effect waves-light  light-blue accent-3 follow"
                         onClick={()=>followUser()}>
                         Follow
                     </button>
                      :
                     <button className="btn waves-effect waves-light  light-blue accent-3 unfollow"
                         onClick={()=>unfollowUser()}>
                         UnFollow
                     </button>
                  }
                  
              </div>
          </div>
          <div className="gallery">
              {
                  userProfile.posts.map(item=>{
                      return(
                          <img key={item._id} className="item" src={item.photo} alt={item.title} />
                      )
                  })
              }
          </div>
         </div>
          : <h2>Loading Please wait...</h2>
        }
       </>
    )
}

export default Profile;