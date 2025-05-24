import './UserElementField.css'

interface UserElementFieldProps{
    type:string,
    value:string,
    isReadonly:boolean,
    onChange:React.ChangeEventHandler<HTMLInputElement>
}

export default function UserElementField({type, value, isReadonly, onChange}:UserElementFieldProps){
    return(
        <>
            {
                isReadonly? 
                <>
                    {
                        type == "password"?<p>-</p>:<p>{value}</p>
                    }
                </> : <input className='user-element-field' type={type} value={value} readOnly={isReadonly} onChange={onChange}></input>
            }
        </>
    )
}