import React,{useState,useEffect} from 'react';
import {useNavigate} from "react-router-dom"
import M from "materialize-css"

const CreatePost = () =>{

  const navigate = useNavigate()
  const [title,setTitle] = useState("")
  const [body,setBody] = useState("")
  const [image,setImage] = useState("")
  const [url,setUrl] = useState("")

  useEffect(()=>{
    if(url){
    fetch("/createpost",{
      method: "post",
      headers:{
          "Content-Type": "application/json",
          "Authorization": "Bearer "+localStorage.getItem("jwt")
      },
      body: JSON.stringify({
          title,
          body,
          pic:url
      })
    }).then(res=>res.json())
      .then(data=>{
        if(data.error){
          M.toast({html: data.error, classes:"#f44336 red"})
        }
        else {
          M.toast({html: "created post Successful", classes:"#00e676 green accent-3"})
          navigate('/')
           }
        })
       .catch(err=>{
           console.log(err)
        })
      }
  },[url])

  const postDetails = () =>{
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
      setUrl(data.url)
    })
    .catch(err=>{
      console.log(err)
    })
  }


    return(
        <div className='card input-field'
        style={{margin:"30px auto",
                maxWidth:"500px",
                padding:"20px",
                textAlign:"center"}}>
           <input type='text' placeholder='title' value={title}  onChange={(e)=>setTitle(e.target.value)} />
           <input type='text' placeholder='body' value={body}  onChange={(e)=>setBody(e.target.value)}  />

           <div className="file-field input-field">
             <div className="btn #039be5 light-blue darken-1">
               <span>Upload</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
              </div>
              <div className="file-path-wrapper">
                 <input className="file-path validate" type="text" />
              </div>
            </div>
             <button className="btn waves-effect waves-light  #039be5 light-blue darken-1"
             onClick={()=>postDetails()}>
                Create Post
             </button>
        </div>
    )
}

export default CreatePost