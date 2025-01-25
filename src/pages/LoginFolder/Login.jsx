import "react";
import "./login.css";
// import assets from "../../assets/assets";
import { useState } from "react";
import { signup , login , resetPassword} from "../../config/firebase";

const Login = () => {

  const [currState, setCurrSate] = useState("Sign Up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    if (currState === "Sign Up") {
      setLoading(true);
      try {
        await signup(userName, email, password);
      } catch (error) {
        console.error("Signup failed:", error);
      } finally {
        setLoading(false);
      }
    }
    else{
      setLoading(true); 
      try {
        await login(email,password)
      } catch (error) {
        console.error("Signup failed:", error);
      } finally {
        setLoading(false);
      }
      

    }
  };

  return (
    <div className="login">
     {loading ? <div className="spinner"></div> : <><div className="chat-logo"><img className="logo" src="/src/assets/chat-logo.png" alt="logo" /> <span className="span">Samvaad</span></div>
      <form className="login-form" onSubmit={onSubmitHandler}>
        <h2>{currState}</h2>
        {currState === "Sign Up" ? (
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            className="form-input"
            type="text"
            placeholder="Username"
            required
          />
        ) : null}

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="form-input"
          type="email"
          placeholder="Email Address"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="form-input"
          type="password"
          placeholder="Enter Password"
          required
        />
         <button type="submit" disabled={loading}>
          {loading ? "Processing..." : currState === "Sign Up" ? "Create Account" : "Login now"}
        </button>
        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the term of use & privacy policy</p>
        </div>
        <div className="login-forget">
          <div className="forget">
          {currState === "Sign Up" ? (
            <>
              <p className="login-toggle">Already have an account </p>{" "}
              <h5 onClick={() => setCurrSate("Login")}>Login here</h5>
            </>
          ) : (
            <>
              <p className="login-toggle">Create an account </p>
              <h5 onClick={() => setCurrSate("Sign Up")}>click here</h5>
            </>
          )}</div>
           <div className="forget">
          {currState === "Login" ? ( <><p className="login-toggle">Forget Password ? </p>
              <h5 onClick={() => resetPassword(email)}>click here</h5> </>):null}
              </div>
        </div>
      </form>
      </>}
     
    </div>
  );
};

export default Login;
