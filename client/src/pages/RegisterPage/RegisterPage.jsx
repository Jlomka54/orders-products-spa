import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
} from "../../features/auth/authSelectors";
import "./RegisterPage.css";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/orders" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setFormError("Name is required");
      return;
    }

    if (!password) {
      setFormError("Password is required");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    setFormError("");

    try {
      await dispatch(
        registerUser({
          username: trimmedUsername,
          password,
        }),
      ).unwrap();
      navigate("/orders", { replace: true });
    } catch {
      return;
    }
  };

  return (
    <section className="register-page">
      <form className="register-page__form" onSubmit={handleSubmit}>
        <h1 className="register-page__title">Register</h1>

        <label className="register-page__field">
          <span className="register-page__label">Name</span>
          <input
            className="register-page__input"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />
        </label>

        <label className="register-page__field">
          <span className="register-page__label">Password</span>
          <input
            className="register-page__input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
        </label>

        {(formError || authError) && (
          <p className="register-page__error">{formError || authError}</p>
        )}

        <button
          className="register-page__button"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Register"}
        </button>

        <p className="register-page__hint">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
};

export default RegisterPage;
