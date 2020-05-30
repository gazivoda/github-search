import { Avatar, Card, Dialog, useTheme, useMediaQuery, DialogTitle, DialogContent, Button, DialogActions, DialogContentText } from "@material-ui/core";
import React, { useEffect, useState, ReactNode } from "react";
import { animated, useSpring } from 'react-spring';
import FormDialog from "../repositories-modal";

const Profile = (props: {
    id: string,
    name: string,
    login: string,
    email: string,
    url: string,
    avatarUrl: string,
    children: ReactNode,
    onClick: any
}) => {
    const [flipped, setFlipped] = useState(false);

    const theme = useTheme();

    const { transform, opacity } = useSpring({
        opacity: flipped ? 1 : 0,
        transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
        config: { mass: 5, tension: 950, friction: 80 }
    });

    useEffect(() => {
        setFlipped(true);
    }, [])

    return (
        <animated.div
            className="profile-card"
            style={{ opacity, transform: transform.interpolate(t => `${t} rotateX(180deg)`) }}
        >
            <Card className="profile-card__container" onClick={props.onClick} title={props.login}>
                <div className="profile-card__container__first-item">
                    <Avatar
                        alt={props.login}
                        src={props.avatarUrl} />
                    <h4>{props.name}</h4>
                </div>
                <div className="profile-card__container__second-item">
                    {!!props.email && <span>✉️<a target="_blank" href={`mailto:${props.email}`}>{props.email}</a></span>}
                    {!!props.url && <span>👨🏻‍💻<a target="_blank" href={props.url}>{props.login}</a></span>}
                </div>
            </Card>
            {props.children}
        </animated.div >
    )
}

export default Profile;