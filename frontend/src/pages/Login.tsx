import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import type { FormEvent } from "react";
import { toast } from "react-toastify";
import api, { setAccessToken } from "../lib/axios";
import { getErrorMessage } from "../utils/getErrorMessage";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { sessionLoading, token, setToken, navigate } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (token) {
      if (!token) return;
      navigate("/");
    }
  }, [token, navigate]);
  if (sessionLoading) return null;

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (currentState === "Sign Up") {
        const response = await api.post("/api/user/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          setAccessToken(response.data.token);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await api.post("/api/user/login", {
          email,
          password,
        });
        
        if (response.data.success) {
          setToken(response.data.token);
          setAccessToken(response.data.token);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl ">{currentState}</p>
        <hr className=" border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Login" ? (
        " "
      ) : (
        <input
          required
          type="text"
          className=" w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      )}
      <input
        required
        type="email"
        className=" w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <input
        required
        type="password"
        className=" w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <div className=" w-full flex justify-between text-sm mt-[-8px]">
        <p className=" cursor-pointer">Forget our Password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className=" cursor-pointer"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className=" cursor-pointer"
          >
            Login Here
          </p>
        )}
      </div>
      <button
        type="submit"
        className=" cursor-pointer text-white bg-black font-light px-8 py-2 mt-4"
      >
        {currentState === "Login" ? "Login" : "Sign up"}
      </button>
    </form>
  );
};

export default Login;
