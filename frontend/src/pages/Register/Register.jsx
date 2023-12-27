import React, {useState} from 'react'
import styles from './Register.module.css'
import StepPhoneEmail from '../Steps/StepPhoneEmail/StepPhoneEmail.jsx'
import StepOtp from '../Steps/StepOtp/StepOtp.jsx'
import StepName from '../Steps/StepName/StepName.jsx'
import StepAvatar from '../Steps/StepAvatar/StepAvatar.jsx'
import StepUsername from '../Steps/StepUsername/StepUsername.jsx'

const steps ={ 
    1: StepPhoneEmail,
    2: StepOtp,
    3: StepName,
    4: StepAvatar,
    5: StepUsername,   
};


const Register =() => {
    const [step, setStep] = useState(1);
    const Step = steps[step];

    function onClick(){
        setStep(step+1)
    }
    return (
        <div>
            <Step onClick={onClick} />
        </div>
    )
};

export default Register