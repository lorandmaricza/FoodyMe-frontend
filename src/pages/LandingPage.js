import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { checkSession } from '../utils/helpers';
import classes from './LandingPage.module.css';


function LandingPage () {
    const navigate = useNavigate();

    useEffect(() => {
        checkSession().then((data) => {
            if (data.loggedIn) {
                navigate('/dashboard', { state: { user: data.user } });
            } else {
                navigate('/');
            }
        }).catch(error => console.log(error));
    }, [navigate]);

    return (
        <div className={classes.wrapperDiv}>
            <div className={classes.imgDiv}></div>
        </div>
    );
}

export default LandingPage;