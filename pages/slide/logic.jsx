import React from 'react'
import { LogicJump } from '../../src/component'

const Logic = ({ id }) => {

    return (
        <LogicJump id={id} />
    )
}


export async function getServerSideProps(context) {
    const { id } = context.query
    return {
        props: {
            id
        }
    }
}

export default Logic