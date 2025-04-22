import { Children, ReactElement, ReactNode, useEffect, useState } from "react"
import "./MultiplyAccordion.css"

interface MultiplyAccordionProps{
    children?:ReactElement<AccordingSectorProps>[] | ReactElement<AccordingSectorProps>
}

interface AccordingSectorProps{
    children?:ReactNode
    className?:string
    title:string
    selected?:boolean
}

export function AccordingSector({children, className, title}:AccordingSectorProps){
    return(
        <div>
            {children}
        </div>
    )
}

export default function MultiplyAccordion({children}:MultiplyAccordionProps){
    const [activeSectorIndexes, setActiveSectorIndexes] = useState<number[]>([])

    useEffect(()=>{
        children && Children.map(children, (child, index)=>{
            if(child.props.selected && !activeSectorIndexes.includes(index)){
                activeSectorIndexes.push(index)
            }
        })
    }, [children])

    return (
        <>
            {
                children && Children.map(children,(child, index)=>{
                    const isSelected:boolean = activeSectorIndexes.includes(index)
                    return (
                        <div
                            className={child.props.className}
                        >
                            <span
                                 onClick={()=>{
                                    if(isSelected){
                                        setActiveSectorIndexes([...activeSectorIndexes.filter(i=>i != index)])
                                    }
                                    else{
                                        activeSectorIndexes.push(index)
                                        setActiveSectorIndexes([...activeSectorIndexes])
                                    }
                                }}
                            >
                                <span className="accordion-sector-title">{child.props.title}{
                                    isSelected? <>▼</> : <>▶</>
                                }</span>
                            </span>
                            {
                                isSelected && child
                            }
                        </div>
                    )
                })
            }
        </>
    )
}
