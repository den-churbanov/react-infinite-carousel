import React from 'react'

interface IIconParams{
    name: string,
    className?: string,
    file: string
}

export const Icon = ({name, className, file}: IIconParams) => {
    return (
        <svg className={`${className ? className : ''}`}>
            <use xlinkHref={`${file}#${name}-icon`}/>
        </svg>
    )
}
