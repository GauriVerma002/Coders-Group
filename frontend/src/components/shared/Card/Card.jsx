import React from 'react'
import styles from './Card.module.css';


const Card = ({title,children}) => {
  return (
    <div>
      <div className={styles.card}>
            <div className={styles.headingWrapper}>
                 {/* <img src="/images/Emoji" alt=""/> */}
                 <h1 className={styles.heading}>{title}</h1>
            </div> 
           {children}
        </div>
    </div>
  )
}

export default Card
