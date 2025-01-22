import React, { useState } from "react";
import { Link } from "react-router-dom";

function UserSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userData, setUserData] = useState({});
  const submitHandler = async (e) => {
    e.preventDefault(); //stops the page from reloading

    setUserData({
      fullName: {
        firstName: firstName,
        lastName: lastName,
      },
      email: email,
      password: password,
    });

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div>
        <img
          className="w-16 mb-10"
          src="data:image/png;base64,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"
          alt=""
        />

        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg font-medium mb-2">What&apos;s your name</h3>
          <div className="flex gap-4 mb-6">
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </div>
          <h3 className="text-lg font-medium mb-2">What&apos;s your email</h3>
          <input
            required
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <h3 className="text-lg font-medium mb-2">Enter your password</h3>
          <input
            className="bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            required
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <button className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 border w-full text-lg placeholder:text-base">
            Login
          </button>
        </form>
        <p className="text-center">
          Already have an account?
          <Link to={"/login"} className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>
      <div>
        <p className="text-[10px] leading-tight">
          This site is protected by reCAPTCHA and the <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service apply</span>.
        </p>
      </div>
    </div>
  );
}

export default UserSignup;
