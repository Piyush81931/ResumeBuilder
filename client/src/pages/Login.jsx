import { Lock, LogIn, Mail, User2Icon } from "lucide-react";
import React,{useState} from "react";
import api from "../configues/api";
import { useDispatch } from "react-redux";
import { login } from "../fetaures/authSlice";
import toast from 'react-hot-toast'
const Login = () => {
  const query = new URLSearchParams(window.location.search)
  const urlState = query.get('state')
  const [state, setState] = useState(urlState || "login")

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          const {data} = await api.post(`/api/users/${state}`,formData)
          dispatch(login(data))
          localStorage.setItem('token',data.token)
          toast.success(data.message)
        } catch (error) {
          console.log(error?.response?.data?.message)
          console.log(error.message)
         toast.error(error?.response?.data?.message || error.message) 
        }

    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>
        <p className="text-gray-500 text-sm mt-2">Please {state} continue</p>
        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <User2Icon width={16} color="#6B7280"/>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border-none outline-none ring-0"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail width={13} color="#6B7280"/>
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="border-none outline-none ring-0"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock width={13} color="#6B7280"/>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mt-4 text-left text-[#1e3a8a]">
          <button className="text-sm" type="reset">
            Forget password?
          </button>
        </div>
        <button
          type="submit"
          className="mt-2 w-full h-11 rounded-full text-white bg-[#1e40af] hover:bg-white hover:text-[#1e40af] hover:border-2 hover:border-[#1e40af] transition"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>
        <p
          onClick={() =>
            setState((prev) => (prev === "login" ? "register" : "login"))
          }
          className="text-gray-500 text-sm mt-3 mb-11"
        >
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <a href="#" className="text-[#1e3a8a]  hover:underline">
            click here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
