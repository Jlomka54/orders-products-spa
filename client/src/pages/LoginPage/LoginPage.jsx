import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
} from "../../features/auth/authSelectors";
import "./LoginPage.css";

const LoginPage = () => {
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

    setFormError("");

    try {
      await dispatch(
        loginUser({
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
    <section className="login-page">
      <form className="login-page__form" onSubmit={handleSubmit}>
        <h1 className="login-page__title">Login</h1>

        <label className="login-page__field">
          <span className="login-page__label">Name</span>
          <input
            className="login-page__input"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />
        </label>

        <label className="login-page__field">
          <span className="login-page__label">Password</span>
          <input
            className="login-page__input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>

        {(formError || authError) && (
          <p className="login-page__error">{formError || authError}</p>
        )}

        <button
          className="login-page__button"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="login-page__hint">
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </section>
  );
};

export default LoginPage;
