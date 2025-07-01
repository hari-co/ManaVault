"use client";
import React, { useState } from "react";

export default function login() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordDifferent, setPasswordDifferent] = React.useState(false);

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordDifferent(true);
    } else {
      return;
    }
  }

    return (
      <div className="bg-blue-200 flex justify-center items-center min-h-[calc(100vh-3.5rem)] w-screen">
        <form className="bg-white flex flex-col p-8 rounded shadow-md w-96">
          <div className="flex justify-center">
            <h2>Register for ManaVault</h2>
          </div>
          <div>
            <p>Username</p>
            <input
              className="border"
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              />
              <p>Email</p>
              <input
                className="border"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <p>Password</p>
              <input 
                className="border"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <p>Confirm Password</p>
              <input
                className="border"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                />
          </div>
          {passwordDifferent && (
            <p className="text-red-500">
              Passwords do not match. Please try again.
            </p>
            )}
          <button
          className="border rounded mt-8 p-2 hover:bg-gray-300"
            type="submit"
            onClick={register}
            >
              Register
            </button>
        </form>
      </div>
    )
}