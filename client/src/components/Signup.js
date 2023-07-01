import {React,useState,useEffect} from "react"
import {Link,useNavigate} from "react-router-dom"
import M from "materialize-css"


const Signup = ()=>{
    const navigate = useNavigate()
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)
    useEffect(()=>{
        if(url){
            uploadFields()
        }
    })

    const validateForm = () => {
        if (name.length > 15) {
          M.toast({ html: "Name should be less than 15 characters", classes: "#f44336 red" });
          return false;
        }
        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            M.toast({ html: "Invalid email Address", classes: "#f44336 red" });
            return false;
          }
        if (password.length < 10) {
          M.toast({ html: "Password should be at least 10 characters", classes: "#f44336 red" });
          return false;
        }
        return true;
      };

    const uploadPic = () =>{
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

    const uploadFields = ()=>{
        if (!validateForm()) {
            return;
          }
        fetch("/signup",{
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"#f44336 red"})
            }
            else {
                M.toast({html: data.message, classes:"#00e676 green accent-3"})
                navigate('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    const PostData = ()=>{
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
    }

    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className="auth-header">Instagram</h2>
                <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Invalid email address" />
                <input type="Password" placeholder="Password" style={{marginBottom:20}} value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <div className="file-field input-field">
                    <div className="btn waves-effect waves-light  light-blue accent-3">
                        <span>add profile pic</span>
                        <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                 </div>
                <button className="btn waves-effect waves-light  light-blue accent-3"
                onClick={()=>PostData()}>
                   SignUp
                </button>
                <h5>
                    <Link to="/signin">Already have an account ?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Signup;