import React from 'react'

const LogicJump = ({handler,idArr,arr}) => {
    return (
        <div className="item logic_jump">
            <p>Select where to add this slide in Logic Jump Option </p>
            <div className="logic_jump-option">
                {arr.map((item) => (
                    <h3 key={item._id} onClick={() => handler(item._id)} className={idArr.includes(item._id) ? "corr" : ""} >{item.val.slice(0, 15)}...</h3>
                ))}
            </div>
        </div>
    )
}

export default LogicJump