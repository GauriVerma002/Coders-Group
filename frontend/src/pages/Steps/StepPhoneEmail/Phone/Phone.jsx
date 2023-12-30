import React, { useState } from 'react'
import Card from '../../../../components/shared/Card/Card.jsx';
import Button from '../../../../components/shared/Button/Button.jsx';
import TextInput from '../../../../components/shared/TextInput/TextInput.jsx'
import styles from '../StepPhoneEmail.module.css';
import {sendOtp} from '../../../../http/index.js';

const Phone = ({ onClick }) => {
  const [phoneNumber, setPhoneNumber] = useState('');


  async function submit(){
       
    const res = await sendOtp();
    console.log(res);
    // onclick();
  }
  return (

    <Card title="Enter your phone number" icon="">
      <TextInput
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <div className={styles.actionButtonWrap}>
        <Button text="Next" onClick={submit} />
      </div>
      <p className={styles.bottomPragraph}>
        By entering your number, you're agreeing to our
        Terms of Service and Privacy Policy. Thanks!
      </p>

    </Card>
  );
};

export default Phone;
