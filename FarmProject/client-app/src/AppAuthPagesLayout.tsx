import Popup from "reactjs-popup"
import FacilitySelect from "./main-menu/FacilitySelect"
import NotificationMenuElement from "./NotificationMenuElement"
import NavButton from "./main-menu/NavButton"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import bellImage from './images/bell-white.png'
import logoImage from './images/logo.png'
import mapImage from './images/white-map.png';
import peopleImage from './images/white-people.png'
import sensorImage from './images/white-sensor.png'
import disabledSensorImage from './images/white-disabled2.png'
import exitImage from './images/exit.png'
import { FacilityDeepMetaDto, NotificationData } from "./interfaces/DtoInterfaces"
import { useAuth } from "./AuthProvider"

interface AppAuthPagesLayoutProps{
    facilitiesMeta: FacilityDeepMetaDto[];
    onFacilitySelect: (e:React.ChangeEvent<HTMLSelectElement>) => void;
    loadNotifications: ()=>void;
    notifications: NotificationData[];
    facilitiesMetaInit:()=>void
}

export default function AppAuthPagesLayout({facilitiesMeta, onFacilitySelect, loadNotifications, notifications, facilitiesMetaInit}:AppAuthPagesLayoutProps){
    const authContext = useAuth()
    return (
        <>
            <div className='header'>
                        <div className='angle-header-element'><img src={logoImage} width="80px" height="80px"></img></div>
                        <FacilitySelect 
                            facilitiesMeta={facilitiesMeta}
                            onSelectEvent={onFacilitySelect}
                            onClick={facilitiesMetaInit}
                        />
                        <Popup 
                            trigger={<button className='bordered-accent standart-button notification-menu-button'>
                                <img src={bellImage} width="32px" height="32px"></img>
                            </button>}
                            >
                                <div className='notifications-menu'>
                                    <div className='bottom-border-main-color'>
                                        <h3>Уведомления</h3>
                                    </div>
                                    {
                                        notifications.map(n=>
                                        <NotificationMenuElement createTime={n.createdDate}>
                                            <div>
                                                <p>{n.text}</p>
                                            </div>
                                        </NotificationMenuElement>)
                                    }
                                    <button className='load-notifications-button' onClick={loadNotifications}>Ещё</button>
                                </div>
                            </Popup>
                            <button className='bordered-accent standart-button exit-button'
                            onClick={()=>authContext.logout()}>
                                <img src={exitImage} width="32px" height="32px"></img>
                            </button>
                    </div>
                <div className='middle-part'>
                        <div className='main-menu'>
                            <NavButton navPath='/monitor' image={sensorImage}/>
                            <NavButton navPath='/map' image={mapImage}/>
                            <NavButton navPath='/sensors-to-add' image={disabledSensorImage}/>
                            <NavButton navPath='/users' image={peopleImage}/>
                        </div>
                        <div className='page-window'>
                            <Outlet/>
                        </div>
                </div>
                    <ToastContainer
                    position='bottom-right'
                    autoClose={10000}
                    limit={2}/>
        </>
    )
}