import React from 'react';
import styles from './home.module.css';
import { useNavigate } from 'react-router-dom';
import Card from '../components/shared/Card/Card.jsx';
import Button from '../components/shared/Button/Button.jsx';

const Home = () => {
    // const signInLinkStyle = {
    //     color : '#0077ff',
    //     fontWeight: 'bold',
    //     textDecoration: 'none',
    //     marginLeft : '10px'
    // };
    const Navigate = useNavigate();
    function startRegister() {
        Navigate('/authenticate');
    }
    return (
        <div className={styles.cardWrapper}>
            <Card title="Welcome to Coders Group!!">
                <p className={styles.text}>
                    We're working very hard to get Coders Groups ready
                    for everyone! while we wrap up the finish, we adding
                    people gradually, to make sure nothing breaks!....
                </p>
                <div>
                    <Button onClick={startRegister} text="Let's Go" />
                </div>
                <div className={styles.signinWrapper}>
                    <span className={styles.hasInvite}>
                        Have an invite text?
                    </span>
                </div>
            </Card>
        </div>
    );
};

export default Home;