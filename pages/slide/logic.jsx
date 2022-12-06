import React from 'react'
import { LogicJump } from '../../src/component'

const Logic = ({ id,isTest }) => {

    return (
        <LogicJump id={id} isTest={isTest==="true"} />
    )
}


export async function getServerSideProps(context) {
    const { id ,isTest} = context.query
    return {
        props: {
            id,isTest
        }
    }
}

export default Logic