import {React,useState,useContext} from "react";
import {Link,useNavigate} from "react-router-dom"
import {UserContext} from '../App'
import M from "materialize-css"

const Signin = ()=>{
    const {state,dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const validateForm = () => {
        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            M.toast({ html: "invalid email or password", classes: "#f44336 red" });
            return false;
          }
        if (password.length < 10) {
          M.toast({ html: "invalid email or password", classes: "#f44336 red" });
          return false;
        }
        return true;
      };

    const PostData = ()=>{
        if (!validateForm()) {
            return;
          }
        fetch("/signin",{
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"#f44336 red"})
            }
            else {
                localStorage.setItem("jwt",data.token)
                data.user.password = undefined
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER", payload:data.user})
                M.toast({html: "Login Successful", classes:"#00e676 green accent-3"})
                navigate('/')
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
                <input type="Password" placeholder="Password" style={{marginBottom:20}} value={password} onChange={(e)=>setPassword(e.target.value)} />
                <button className="btn waves-effect waves-light  light-blue accent-3"
                onClick={()=>PostData()}>
                   LogIn
                </button>
                <h5>
                    <Link to="/signup">Don't have an account ?</Link>
                </h5>
                <h6>
                    <Link to="/reset">Forgot password ?</Link>
                </h6>
            </div>
        </div>
    )
}

export default Signin;