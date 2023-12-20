import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import classes from './LoginPage.module.scss';
import {cryptPassword} from "../utils/helpers";

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
        const response = await fetch('http://localhost:8888/final-project-back-end/public/user/validate-email.php', {
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

    const setHashedPassword = async password => {
        const hashedPassword = await cryptPassword(password);
        user.password = hashedPassword;
        user.confirmPassword = hashedPassword;
    }

    const navigateToLoginWithMessage = message => {
        navigate('/login', {state: {message: message}});
    }

    const submitSignUp = async () => {
        const response = await fetch('http://localhost:8888/final-project-back-end/public/user/signup.php', {
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

        if (await validatePassword(user.password, user.confirmPassword)) {
            await setHashedPassword(user.password);
        } else {
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
