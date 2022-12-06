

const Temp2 = ({ data,style }) => {
    const dummyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. A cum, blanditiis aspernatur quibusdam fugit enim omnis nostrum amet, numquam tempore possimus officia obcaecati veritatis. Alias dignissimos deserunt reiciendis?"
    
    return (
        <div className="temp2" style={{...style}} >
            <div className="question">
                <div dangerouslySetInnerHTML={{__html:data?.question  ?? dummyText}} />
                <span className="question__info">(Answer in 100-200 words)</span>
            </div>
            <div className="input_large">
                <textarea placeholder="Start Typing here.." rows="5" />  
            </div>
        </div>
    )
}

export default Temp2