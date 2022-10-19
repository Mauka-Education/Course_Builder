import dynamic from "next/dynamic"


const Temp3 = ({ data }) => {
    const dummyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. A cum, blanditiis aspernatur quibusdam fugit enim omnis nostrum amet"
    console.log({data})
    return (
        <div className="temp2">
            <div className="question">
                <h4 dangerouslySetInnerHTML={{__html:data?.question  ?? dummyText}} />
                <span>(You can only choose one)</span>
            </div>
            <div className="pre__option">
                {data?.option?.map((item,i)=>(
                    <div className={`pre__option-item ${item?.val === data?.correct?.val ? "correct" : ""} ` } key={i}>
                        <h4>{item?.val!=="" ? item?.val : `Option ${i+1} ` } </h4>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Temp3