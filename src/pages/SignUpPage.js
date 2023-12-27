import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import classes from './LoginPage.module.scss';

function SignUpPage() {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleChange = e => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const validateEmail = async email => {
        const response = await fetch('http://localhost:3001/user/email-validate', {
            mode: "cors",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email: email})
        });
        const data = await response.json();
        return data.status === "success";
    }

    const validatePassword = async (password, confirmPassword) => {
        return password === confirmPassword;
    }

    const navigateToLoginWithMessage = message => {
        navigate('/login', {state: {message: message}});
    }

    const submitSignUp = async () => {
        const response = await fetch('http://localhost:3001/user/signup', {
            mode: "cors",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
        const data = await response.json();
        setIsLoading(false);
        if (data.status === "success") {
            navigateToLoginWithMessage(data.message);
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);

        if (!(await validateEmail(user.email))) {
            setError("Email already exists");
            setIsLoading(false);
            return;
        }

        if (user.password.length < 8) {
            setIsLoading(false);
            setError("Password must be at least 8 characters");
            return;
        }

        if (!user.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])[0-9a-zA-Z!@#$%^&*]{8,}$/)) {
            setIsLoading(false);
            setError("Password must contain at least one number, one special character, one uppercase letter, and one lowercase letter");
            return;
        } else if (!(await validatePassword(user.password, user.confirmPassword))) {
            setIsLoading(false);
            setError("Passwords do not match");
            return;
        }

        await submitSignUp();
    };

    return (
        <div className="signup-form">
            <form onSubmit={handleSubmit}>
                <h1>Sign up</h1>
                <p>Create your account</p>
                {error && (
                    <div className={classes.errorWrapperDiv}>
                        <p>{error}</p>
                    </div>
                )}
                <div>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        required
                        value={user.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        required
                        value={user.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={user.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={user.password}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        required
                        value={user.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <br />
                <div className={classes.radioContainerDiv}>
                    <div className={classes.radioWrapperDiv}>
                        <label htmlFor="css">consumer</label>
                        <input
                            type="radio"
                            name="role"
                            value="consumer"
                            onChange={handleChange}
                            checked={user.role === "consumer"}
                        />
                    </div>
                    <div className={classes.radioWrapperDiv}>
                        <label htmlFor="html">supplier</label>
                        <input
                            type="radio"
                            name="role"
                            value="supplier"
                            onChange={handleChange}
                            checked={user.role === "supplier"}
                        />
                    </div>
                </div>
                <br />
                <div>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <button type="submit" name="save">
                            Sign up
                        </button>
                    )}
                </div>
                <br />
                <div>
                    Already have an account? <Link to='/login'>Log in</Link>
                </div>
            </form>
        </div>
    );
}

export default SignUpPage;
