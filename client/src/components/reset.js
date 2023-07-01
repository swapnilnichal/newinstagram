import {React,useState} from "react";
import {Link,useNavigate} from "react-router-dom"
import M from "materialize-css"

const Reset = ()=>{
    const navigate = useNavigate()
    const [email,setEmail] = useState("")

    const PostData = ()=>{
        fetch("/reset-password",{
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"#f44336 red"})
            }
            else {
                M.toast({html:data.message, classes:"#00e676 green accent-3"})
                navigate('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className="auth-header">Instagram</h2>
                <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <button className="btn waves-effect waves-light  light-blue accent-3"
                onClick={()=>PostData()}>
                   Reset password
                </button>
            </div>
        </div>
    )
}

export default Reset;