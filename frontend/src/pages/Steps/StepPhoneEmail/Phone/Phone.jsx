import React, { useState } from 'react'
import Card from '../../../../components/shared/Card/Card.jsx';
import Button from '../../../../components/shared/Button/Button.jsx';
import TextInput from '../../../../components/shared/TextInput/TextInput.jsx'
import styles from '../StepPhoneEmail.module.css';
import {sendOtp} from '../../../../http/index.js';
import {useDispatch} from 'react-redux'; 
import {setOtp} from '../../../../store/authSlice.js'

const Phone = ({ onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const dispatch = useDispatch();

  async function submit(){
    try {
      const { data } = await sendOtp({ phone: phoneNumber });
      console.log(data);
      dispatch(setOtp({ phone: data.phone, hash: data.hash }));
      onNext();
    } catch (error) {
      console.error("Error while sending OTP:", error.message);
    }
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
