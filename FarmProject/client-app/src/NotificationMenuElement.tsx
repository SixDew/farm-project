import { ReactNode, useEffect, useState } from "react";
import './NotificationMenuElement.css'

interface NotificationMenuElementProps{
    children?:ReactNode,
    createTime:string
}

export default function NotificationMenuElement({children, createTime}:NotificationMenuElementProps){
    const [timeSpan, setTimeSpan] = useState<string>('')

    const updateTime = ()=>{
        var currentTime:Date = new Date()
        var timeBuff = currentTime.getTime() - new Date(createTime).getTime()

        const seconds = Math.floor(timeBuff / 1000);
        if (seconds < 60) return setTimeSpan(`${seconds} сек назад`);

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return setTimeSpan(`${minutes} мин назад`);

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return setTimeSpan(`${hours} ч назад`);

        const days = Math.floor(hours / 24);
        setTimeSpan(`${days} дн назад`);
    }

    useEffect(()=>{
        updateTime()
    }, [])

    return (
        <div className="notification-menu-element">
            {children}
            <div className="notification-time-span-element">
                {timeSpan}
            </div>
        </div>
    )
}