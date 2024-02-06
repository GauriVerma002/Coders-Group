import { useEffect, useRef, useCallback } from 'react';
import { useStateWithCallback } from './useStateWithCallback';
import socketInit from '../socket/index'
import { ACTIONS } from '../actions';
import freeice from 'freeice';

export const useWebRTC = (roomId, user) => {
    const [clients, setClients] = useStateWithCallback([]);
    const audioElements = useRef({});
    const connections = useRef({});
    const localMediaStream = useRef(null);
    const socket = useRef(null);

    useEffect(() => {
        socket.current = socketInit()
    }, []);
    const addNewClient = useCallback(
        (newClient, cb) => {
            const lookingFor = clients.find(
                (client) => client.id === newClient.id);

            if (lookingFor === undefined) {
                setClients(
                    (exixtingClients) => [...exixtingClients, newClient],
                    cb
                );
            }
        },
        [clients, setClients],
    )
    //capture media

    useEffect(() => {
        const startCapture = async () => {
            localMediaStream.current =
                await navigator.mediaDevices.getUserMedia({
                    audio: true
                });
        };

        startCapture().then(() => {
            addNewClient({ ...user, muted: true }, () => {
                const localElement = audioElements.current[user.id];
                if (localElement) {
                    localElement.volume = 0;
                    localElement.srcObject = localMediaStream.current;
                }
    //socket emit join socket io
                socket.current.emit(ACTIONS.JOIN, { roomId, user });
            });
        });

        return () => {
    //leaving the room
            localMediaStream.current
                .getTracks()
                .forEach(track => track.stop());

            socket.current.emit(ACTIONS.LEAVE, { roomId });
        }
    }, [addNewClient, roomId, user]);

    useEffect(() => {

        const handleNewPeer = async ({
            peerId,
            createOffer,
            user: remoteUser }) => {
    // if already connected then give warning
            if (peerId in connections.current) {
                return console.warn(
                    `you are already connected with ${peerId} (${user.name})`
                );
            }
    // store it to connections
            connections.current[peerId] = new RTCPeerConnection({
                iceServers: freeice(),
            });

    // handle new ice candidate
            connections.current[peerId].onicecandidate = (event) => {
                socket.current.emit(ACTIONS.RELAY_ICE, {
                    peerId,
                    icecandidate: event.candidate,
                });
            };

            //handle on track event on this connection

            connections.current[peerId].ontrack = ({
                strems: [remoteStream],
            }) => {
                addNewClient({ ...remoteUser, muted: true }, () => {
                    if (audioElements.current[remoteUser.id]) {
                        audioElements.current[remoteUser.id].srcObject = remoteStream;
                    } else {
                        let settled = false;
                        const interval = setTimeout(() => {
                            if (audioElements.current[remoteUser.id]) {
                                audioElements.current[remoteUser.id].srcOject = remoteStream;
                                settled = true;
                            }
                            if (settled) {
                                clearInterval(interval);
                            }
                        }, 1000);
                    }
                });
            };
    // add local track to remote connections'
            localMediaStream.current.getTracks().forEach(track => {
                connections.current[peerId].addTrack(
                    track,
                    localMediaStream.current
                );
            });
    //create offer
            if (createOffer) {
                const offer = await connections.current[peerId].createOffer()
                await connections.current[peerId].setLocalDescription(offer);
    // send offer to another client
                socket.current.emit(ACTIONS.RELAY_SDP, {
                    peerId,
                    sessionDescription: offer,
                })

            }
        };
        socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

        return () => {
            socket.current.off(ACTIONS.ADD_PEER);
        };

    }, [addNewClient, connections, localMediaStream, user, roomId]);

    //handle ice candidate
    useEffect(() => {
        socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
            if (connections.current[peerId]) {
                connections.current[peerId].addIceCandidate(icecandidate);
            }
        })

        return () => {
            socket.current.off(ACTIONS.ICE_CANDIDATE);
        }
    }, [])


    // Handle sdp
    useEffect(() => {
        const handleRemoteSdp = async ({
            peerId,
            sessionDescription: remoteSessionDescription,
        }) => {

            connections.current[peerId].setRemoteDescription(
                new RTCSessionDescription(remoteSessionDescription)
            )

    // if session description is type of offer then create an answer  
            if (remoteSessionDescription.type === 'offer') {
                const connection = connections.current[peerId];
                const answer = await connection.createAnswer();

                connection.setLocalDescription(answer);

                socket.current.emit(ACTIONS.RELAY_SDP, {
                    peerId,
                    sessionDescription: answer,
                });
            }
        };
        socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp );  
            return () => {
                socket.current.off(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp );
            };
    }, [connections, socket, setClients]);

    //handle remove peer

    useEffect(() => {
        const handleRemovePeer = async ({ peerId, userId }) => {
            if (connections.current[peerId]) {
                connections.current[peerId].close();
            }

            delete connections.current[peerId];
            delete audioElements.current[peerId];
            setClients(list => list.filter(client => client.id !== userId));
        };
        socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

        return () => {
            socket.current.off(ACTIONS.REMOVE_PEER);
        };
    }, [connections, audioElements, socket, setClients])

    //Listen for MUTE/unmute

    useEffect(()=>{
        socket.current.on(ACTIONS.MUTE, ({peerId, userId})=>{
            setMute(true, userId);
        })
        
        socket.current.on(ACTIONS.UN_MUTE, ({peerId, userId})=>{
            setMute(false, userId);
        })

        const setMute =(mute, userId) => {
        //    clients.
        // setclients
        }
    },[clients]);


    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance;
    };

    //Handle mute
    const handleMute = (isMute, userId) => {
        console.log('mute', isMute);
        let settled = false;
        let interval = setInterval(()=>{
            if(localMediaStream.current){
                localMediaStream.current.getTracks()[0].enabled =!isMute;
               if(isMute){
                   socket.current.emit(ACTIONS.MUTE, {
                       roomId,
                       userId,
                   })
               } else{
                    socket.current.emit(ACTIONS.UN_MUTE, {
                        roomId,
                        userId,
                    })
               }
               settled = true;
            }
             
            if(settled) {
                clearInterval(interval);
            }
        }, 200);
        
    };


    return { clients, provideRef, handleMute };
}