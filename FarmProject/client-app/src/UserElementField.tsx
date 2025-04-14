interface UserElementFieldProps{
    type:string,
    value:string,
    isReadonly:boolean,
    onChange:React.ChangeEventHandler<HTMLInputElement>
}

export default function UserElementField({type, value, isReadonly, onChange}:UserElementFieldProps){
    return(
        <input type={type} value={value} readOnly={isReadonly} onChange={onChange}></input>
    )
}