import { FaTimes } from "react-icons/fa"
import { TiTick } from "react-icons/ti"


const Temp4 = ({ data }) => {
    const dummyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. A cum, blanditiis aspernatur quibusdam fugit enim omnis nostrum amet, numquam tempore possimus officia obcaecati veritatis. Alias dignissimos deserunt reiciendis?"

    const isItemExist = (val, i) => {
        const isValExists = data?.correct?.filter((item) => item?.val === val)

        if (isValExists !== []) {
            return isValExists[0]?.val
        } else {
            return null

        }
    }



    return (
        <div className="temp2">
            <div className="question">
                <h4 dangerouslySetInnerHTML={{ __html: data?.question ?? dummyText }} />
                <span>(You can choose as many as you like)</span>
            </div>
            {
                data?.isTest ? (
                    <div className="pre__option">
                        {data?.option?.map((item, i) => (
                            <div className={`pre__option-item ${isItemExist(item?.val) === item.val ? "correct" : data?.correct.length !== 0 ? "incorrect" : ""}  `} key={i}>
                                <h4>{item?.val !== "" ? item?.val : `Option ${i + 1} `} </h4>
                                <div className="icon">
                                    {isItemExist(item?.val) === item.val ? <TiTick /> : data?.correct.length !== 0 ? <FaTimes /> : ""}
                                </div>
                            </div>

                        ))}
                    </div>

                ) : (
                    <div className="pre__option">
                        {data?.option?.map((item, i) => (
                            <div className={`pre__option-item ${isItemExist(item?.val) === item.val ? "correct" : ""} `} key={i}>
                                <h4>{item?.val !== "" ? item?.val : `Option ${i + 1} `} </h4>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}

export default Temp4