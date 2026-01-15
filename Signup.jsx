import React, { useState } from "react";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", notes: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5500/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      alert(data.message);
      setForm({ name: "", email: "", password: "", notes: "" });
    } catch (error) {
      console.error(error);
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">Signup</h2>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="mb-2 p-2 w-full border" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="mb-2 p-2 w-full border" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="mb-2 p-2 w-full border" />
        <input name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} className="mb-4 p-2 w-full border" />
        <button className="bg-blue-500 text-white p-2 w-full rounded">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
