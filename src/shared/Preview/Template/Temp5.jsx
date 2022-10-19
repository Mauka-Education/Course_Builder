import React from 'react'

const Temp5 = ({ data }) => {
    return (
        <div className="temp5">
            <div className="title" >
                <div className='title__text' dangerouslySetInnerHTML={{ __html: data?.title ?? "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed facilis voluptates temporibus at quaerat quos, dignissimos aut asperiores, consequatur perspiciatis ab quisquam odio unde vitae quae! Possimus placeat totam excepturi!" }} />
                <span>(Choose an option from 1 - 10)</span>
            </div>
            <div className="scale">
                {Array.from(Array(10).keys()).map((item) => (
                    <div className="scale__item" key={item}>
                        <div className="inner">
                            <p>{item + 1}</p>
                        </div>
                        {item === 0 && (
                            <p className='lower'> {data?.lowLabel ?? "Lower Label"}</p>
                        )}
                        {item === 9 && (
                            <p className='lower__end'>{data?.highLabel ?? "Upper Label"}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Temp5