import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import classes from './LoginPage.module.scss';
import {cryptPassword} from "../utils/helpers";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEye } from '@fortawesome/free-solid-svg-icons'

export default function LoginPage(props) {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const [initialPassword, setInitialPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.message) {
            setMessage(location.state.message);
        }
    }, [location.state]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleChange = e => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const setHashedPassword = async password => {
        user.password = await cryptPassword(password);
    }

    const resetInitialPassword = () => {
        setUser({
            ...user,
            password: initialPassword
        });
    }

    const navigateToSignUpWithUserData = userData => {
        navigate('/signup', { state: { userData: userData } });
    }

    const submitLogin = async () => {
        const response = await fetch(
            'http://localhost:8888/final-project-back-end/public/user/login.php',
            {
                method: "POST",
                mode: "cors",
                credentials: "include",
                body: JSON.stringify(user)
            });
        const data = await response.json();
        if (data.status === "success") {
            props.setLoggedIn(true);
            navigateToSignUpWithUserData(data.userData);
        } else {
            setIsLoading(false);
            resetInitialPassword();
            setMessage(data.message);
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setInitialPassword(user.password);
        await setHashedPassword(user.password);
        await submitLogin();
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Log in</h1>
                {message && (
                    <div className={classes.errorWrapperDiv}>
                        <p>{message}</p>
                    </div>
                )}
                <div>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        required
                        value={user.email}
                        onChange={handleChange}
                    />
                </div>
                <div className={classes.passwordWrapperDiv}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        required
                        value={user.password}
                        onChange={handleChange}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                </div>
                <br />
                <div>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <button type="submit" name="save">
                            Log in
                        </button>
                    )}
                </div>
                <br />
                <div>
                    Don't have an account? <Link to='/signup'>Sign up</Link>
                </div>
            </form>
        </div>
    );
}

