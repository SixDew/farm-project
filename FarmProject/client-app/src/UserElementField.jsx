export default function UserElementField({type, value, isReadonly, onChange}){
    return(
        <input type={type} value={value} readOnly={isReadonly} onChange={onChange}></input>
    )
}