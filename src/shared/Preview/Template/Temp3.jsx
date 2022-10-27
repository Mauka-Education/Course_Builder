import { TiTick } from "react-icons/ti"
import { FaTimes } from "react-icons/fa"

const initialValue = [
    {
        val: "Option 1",
    },
    {
        val: "Option 2",
    },
    {
        val: "Option 3",
    },
    {
        val: "Option 4",
    },
]

const Temp3 = ({ data }) => {
    const dummyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. A cum, blanditiis aspernatur quibusdam fugit enim omnis nostrum amet"

    function marker(val) {
        const isElem = data?.option?.findIndex((item) => item?.val === val)
        if (isElem > -1) {
            if (data?.isTest) {

                return { ans: true, id: isElem }
            } else {
                return { ans: true }
            }
        } else {
            return { ans: false }
        }
    }
    const option=data?.option?.length!==0 ? data?.option  : initialValue
    return (
        <div className="temp2">
            <div className="question">
                <h4 dangerouslySetInnerHTML={{ __html: data?.question ?? dummyText }} />
                <span>(You can only choose one)</span>
            </div>
            {
                data?.isTest ? (
                    <div className="pre__option">
                        {option?.map((item, i) => (
                            <div className={`pre__option-item ${marker(data?.correct?.val, i)?.id === i ? "correct" : (marker(data?.correct?.val, i)?.id - 1 < 0 ? marker(data?.correct?.val, i)?.id + 1 === i : marker(data?.correct?.val, i)?.id - 1 === i) ? "incorrect" : ""} `} key={i}>
                                <h4>{item?.val !== "" ? item?.val : `Option ${i + 1} `} </h4>
                                <div className="icon">
                                    {(marker(data?.correct?.val, i)?.id - 1 < 0 ? marker(data?.correct?.val, i)?.id + 1 === i : marker(data?.correct?.val, i)?.id - 1 === i) && < FaTimes />}
                                    {marker(data?.correct?.val, i)?.id === i && <TiTick size={20} />}

                                </div>
                            </div>
                        ))}
                    </div>

                ) : (
                    <div className="pre__option">
                        {option?.map((item, i) => (
                            <div className={`pre__option-item ${item?.val === data?.correct?.val ? "correct" : ""} `} key={i}>
                                <h4>{item?.val !== "" ? item?.val : `Option ${i + 1} `} </h4>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}

export default Temp3