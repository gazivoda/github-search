import { Avatar, Card } from "@material-ui/core";
import React, { ReactNode, useEffect, useState } from "react";
import { animated, useSpring } from 'react-spring';

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
    const [show, setShow] = useState(false);

    const { opacity } = useSpring(
        {
            opacity: show ? 1 : 0,
            from: { opacity: 0 },
            config: { mass: 5, tension: 950, friction: 40 }
        }
    );

    useEffect(() => {
        setShow(true);
    }, [])

    return (
        <animated.div
            className="profile-card"
            style={{ opacity }}
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