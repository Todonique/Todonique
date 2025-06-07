import React, { useState } from "react";
import "./Register.css";
import { auth, firestore } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    dateOfBirth: "",
    role: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const initialCriteria = {
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    minLength: false,
    noTripleRepeat: true,
  };

  const [passwordCriteria, setPasswordCriteria] = useState(initialCriteria);

  const checkPasswordCriteria = (password) => {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const minLength = password.length >= 8;
    const noTripleRepeat = !/(.)\1\1/.test(password);

    setPasswordCriteria({
      hasLowerCase,
      hasUpperCase,
      hasNumber,
      hasSpecialChar,
      minLength,
      noTripleRepeat,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      checkPasswordCriteria(value);
    }

    if (message) {
      setMessage("");
    }
  };

  const validateForm = () => {
    const { name, surname, email, password, dateOfBirth, role } = form;

    if (!name || !surname || !email || !password || !dateOfBirth || !role) {
      setMessage("Please fill in all the fields.");
      setMessageType("error");
      return false;
    }

    if (!Object.values(passwordCriteria).every(Boolean)) {
      setMessage("Password does not meet all the criteria.");
      setMessageType("error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await setDoc(doc(firestore, "users", user.uid), {
        name: form.name,
        surname: form.surname,
        email: form.email,
        dateOfBirth: form.dateOfBirth,
        role: form.role,
        userNotifications: [],
      });

      setMessage("User registered successfully!");
      setMessageType("success");
      navigate("/login");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="surname"
          placeholder="Surname"
          value={form.surname}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <div className="password-criteria">
          <p>Password must:</p>
          <ul>
            <li className={passwordCriteria.hasLowerCase ? "valid" : "invalid"}>
              • Have at least one lowercase character
            </li>
            <li className={passwordCriteria.hasUpperCase ? "valid" : "invalid"}>
              • Have at least one uppercase character
            </li>
            <li className={passwordCriteria.hasNumber ? "valid" : "invalid"}>
              • Have at least one number
            </li>
            <li className={passwordCriteria.hasSpecialChar ? "valid" : "invalid"}>
              • Have at least one special character
            </li>
            <li className={passwordCriteria.minLength ? "valid" : "invalid"}>
              • Be at least 8 characters
            </li>
            <li className={passwordCriteria.noTripleRepeat ? "valid" : "invalid"}>
              • Not contain 3 identical characters in a row
            </li>
          </ul>
        </div>
        <input
          type="date"
          name="dateOfBirth"
          placeholder="Date of Birth"
          value={form.dateOfBirth}
          onChange={handleChange}
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="staff">Staff</option>
        </select>
        <button type="submit">Register</button>
        {message && <p className={messageType}>{message}</p>}
      </form>
    </div>
  );
};

export default Register;
