import React, { useState } from 'react'
import Card from '../../../components/shared/Card/Card.jsx';
import Button from '../../../components/shared/Button/Button.jsx';
import TextInput from '../../../components/shared/TextInput/TextInput.jsx'
import styles from './StepOtp.module.css';
import { verifyOtp } from '../../../http/index.js';
import { useSelector } from 'react-redux';
import { setAuth } from '../../../store/authSlice.js';
import { useDispatch } from 'react-redux';



const StepOtp = () => {
  const [otp, setotp] = useState('');
  const dispatch = useDispatch();
  const { phone, hash } = useSelector((state) => state.auth.otp);
  async function submit() {
    try {
      const { data } = await verifyOtp({ otp, phone, hash });
      dispatch(setAuth(data));
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <div className={styles.cardWrapper}>
        <Card title="Enter the code we just texted you" icon="">
          <TextInput
            value={otp}
            onChange={(e) => setotp(e.target.value)}
          />
          <div className={styles.actionButtonWrap}>
            <Button onClick={submit} text="Next" />
          </div>
          <p className={styles.bottomPragraph}>
            By entering code, you're agreeing to our Terms of Service and Privacy Policy. Thanks!
          </p>
        </Card>
      </div>
    </>
  );
}

export default StepOtp;
