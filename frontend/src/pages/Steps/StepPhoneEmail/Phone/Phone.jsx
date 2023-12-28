import React, {useState} from 'react'
import Card from '../../../../components/shared/Card/Card.jsx';
import Button from '../../../../components/shared/Button/Button.jsx';
import TextInput from '../../../../components/shared/TextInput/TextInput.jsx'
import styles from '../StepPhoneEmail.module.css';
const Phone = ({onClick}) => {
  const[phoneNumber, setPhoneNumber] = useState('');

  return (
    
    <Card title="Enter your phone number" icon="">
      <TextInput
       value={phoneNumber}
       onChange={(e)=> setPhoneNumber(e.target.value)}/>
          <div className={styles.actionButtonWrap}>
            <Button text="Next" onClick={onClick}/>
            </div>
            <p className={styles.bottomPragraph}>
            By entering your number, you're agreeing to our Terms of Service and Privacy Policy. Thanks!
            </p>

    </Card>
  );
};

export default Phone;
