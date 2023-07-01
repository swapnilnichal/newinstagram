import React,{useState,useEffect, useContext,useRef} from "react";
import {UserContext} from "../App"
import { json } from "react-router-dom";

const Profile = ()=>{
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const filePathRef = useRef(null);


    useEffect(()=>{
        fetch('/mypost',{
          headers: {
            "authorization":"Bearer "+localStorage.getItem("jwt")
          }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result.mypost)
        })
    },[])
    
    useEffect(()=>{
        if(image){
            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","insta-clone")
            data.append("cloud_name","dc42djaq0")
            fetch("https://api.cloudinary.com/v1_1/dc42djaq0/image/upload",{
               method: "post",
               body:data
             })
             .then(res=>res.json())
             .then(data=>{ 
                fetch("/updatepic",{
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    console.log(result)
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPLOADPIC",payload:result.pic})
                })
                if (filePathRef.current) {
                    filePathRef.current.value = '';
                  }
                })
              .catch(err=>{
                 console.log(err)
              })
        }  
    },[image])

    const updatePhoto = (file) =>{
        setImage(file)
    }

    const imageStyle = windowWidth < 600 ? { height: "100px", width: "100px", borderRadius: "50px", marginTop:"20px"} : { height: "160px", width: "160px", borderRadius: "80px" };

    return(
       <div style={{maxWidth:"550px",margin:"0px auto"}}>
        <div style={{display:"flex",
              justifyContent:"space-around",
              margin:"18px 0px",
            }}>
            <div>
                <img style={imageStyle}
                src={state?state.pic:"loading"} />
            </div>
            <div className="profile-details">
                <h4>{state?state.name:"loading"}</h4>
                <h5>{state?state.email:"loading"}</h5>
                <div style={{display:"flex",justifyContent:"space-evenly",width:"108%"}}>
                    <h6>{mypics.length} Posts</h6>
                    <h6>{state?state.followers.length:"0"} Followers</h6>
                    <h6>{state?state.following.length:"0"} Following</h6>
                </div>
            </div>
        </div>
        <div className="file-field input-field" style={{marginLeft:"51px",paddingBottom:"15px",borderBottom:"1px solid grey"}}>
                    <div className="btn waves-effect waves-light  light-blue accent-3">
                        <span>add profile pic</span>
                        <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" ref={filePathRef} />
                    </div>
                 </div>
        <div className="gallery">
            {
                mypics.map(item=>{
                    return(
                        <img key={item._id} className="item" src={item.photo} alt={item.title} />
                    )
                })
            }
        </div>
       </div>
    )
}

export default Profile;