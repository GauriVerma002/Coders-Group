import React, { useState } from 'react'
import Card from '../../../../components/shared/Card/Card.jsx';
import Button from '../../../../components/shared/Button/Button.jsx';
import TextInput from '../../../../components/shared/TextInput/TextInput.jsx'
import styles from '../StepPhoneEmail.module.css';

const Email = ({onNext}) => {
  const [email, setEmail] = useState('');
  return (
    <Card title="Enter your email id" icon="">
      <TextInput
        value={email}
        onChange={(e) => setEmail(e.target.value)} />
      <div className={styles.actionButtonWrap}>
        <Button text="Next" onClick={onNext} />
      </div>
      <p className={styles.bottomPragraph}>
        By entering your Email, you're agreeing to our Terms of Service and Privacy Policy. Thanks!
      </p>
    </Card>
  )
}

export default Email;
