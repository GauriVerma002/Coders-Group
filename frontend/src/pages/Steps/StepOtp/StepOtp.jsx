import React, { useState } from 'react'
import Card from '../../../components/shared/Card/Card.jsx';
import Button from '../../../components/shared/Button/Button.jsx';
import TextInput from '../../../components/shared/TextInput/TextInput.jsx'
import styles from './StepOtp.module.css';


const StepOtp = ({ onClick }) => {
  const [otp, setotp] = useState('');
  return (
    <>
      <div className={styles.cardWrapper}>
        <Card title="Enter the code we just texted you" icon="">
          <TextInput
            value={otp}
            onChange={(e) => setotp(e.target.value)}
          />
          <div className={styles.actionButtonWrap}>
            <Button  text="Next" />
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
