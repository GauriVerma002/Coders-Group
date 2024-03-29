import React, { useState, useEffect } from 'react';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Room.module.css';
import { getRoom } from '../../http/index';

const Room = () => {
  const { id: roomId } = useParams();
  const user = useSelector(state => state.auth.user);
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [isMute, setMute] = useState(true);

  useEffect(() => {
      handleMute(isMute, user.id);
  }, [isMute]);

  const handleManualLeave = () => {
    navigate('/rooms');
  }

  useEffect(() => {
    const fetchRoom = async () => {
      const { data } = await getRoom(roomId);
      setRoom((prev) => data);
    };

    fetchRoom();
  }, [roomId]);

  return (
    <div>
      <div className="container">
        <button onClick={handleManualLeave} className={styles.goBack}>
          <img src="/images/arrow-left.png" alt="arrow-left" />
          <span>All voice rooms</span>
        </button>
      </div>
      <div className={styles.clientsWrap}>
        <div className={styles.header}>
          <h2 className={styles.topic}>{room?.topic}</h2>
          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              <img src="/images/palm.png" alt="palm-icon" />
            </button>
            <button onClick={handleManualLeave} className={styles.actionBtn}>
              <img src="/images/win.png" alt="win-icon" />
              <span>Leave quietly </span>
            </button>
          </div>
        </div>
        <h1> All connected clients</h1>
        <div className={styles.clientList}>
          {
            Array.isArray(clients) ? (
              clients.map((client) => {
                return (
                  <div className={styles.client} key={client.id}>
                    <div className={styles.userHead}>
                      <audio
                        ref={(instance) =>
                          provideRef(instance, client.id)
                        }
                        autoPlay
                      ></audio>
                      <img
                        className={styles.userAvatar}
                        src={client.avatar}
                        alt="avatar"
                      />

                      <button className={styles.micBtn}>
                        {
                          client.muted ? (
                            <img
                              src="/images/mic-mute.png"
                              alt="mic-mute-icon"  
                            />
                          ) : (
                            <img
                            src="/images/mic.png"
                            alt="mic-icon"
                            />
                          )
                        }
                      </button>
                    </div>
                    <h4>{client.name}</h4>
                  </div>
                )
              })
            ) : (
              <p>No connected clients</p>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Room;
