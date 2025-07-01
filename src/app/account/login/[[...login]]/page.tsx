"use client";
import React, { useState } from "react";

export default function login() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
  }

    return (
      <div className="bg-blue-200 flex justify-center items-center min-h-[calc(100vh-3.5rem)] w-screen">
        <form className="bg-white flex flex-col p-8 rounded shadow-md w-96">
          <div className="flex justify-center">
            <h2>ManaVault Login</h2>
          </div>
          <div>
            <p>Username</p>
            <input
              className="border"
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={e => setUsername(e.target.value)}
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
          </div>
          <button
          className="border rounded mt-8 p-2 hover:bg-gray-300"
            type="submit"
            onClick={signIn}
            >
              Login
            </button>
        </form>
      </div>
    )
}