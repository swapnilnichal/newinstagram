import {React,useState,useContext} from "react";
import {Link,useNavigate,useParams} from "react-router-dom"
import M from "materialize-css"

const Signin = ()=>{
    const navigate = useNavigate()
    const [password,setPassword] = useState("")
    const {token} = useParams()

    const PostData = ()=>{
        fetch("/new-password",{
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                token
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
                <input type="Password" placeholder="enter a new Password" style={{marginBottom:20}} value={password} onChange={(e)=>setPassword(e.target.value)} />
                <button className="btn waves-effect waves-light  light-blue accent-3"
                onClick={()=>PostData()}>
                   Update Password
                </button>
            </div>
        </div>
    )
}

export default Signin;