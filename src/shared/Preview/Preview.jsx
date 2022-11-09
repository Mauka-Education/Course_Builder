import React from 'react'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';


import { Temp1, Temp2, Temp3, Temp4, Temp5, Temp6, Temp7, Temp8, Temp9, Temp10, Temp11, Temp12 } from './Template';

const Preview = ({ type, data, allSlide }) => {
    
    function renderer() {
        switch (type) {
            case 0:
                return <Temp1 data={data} />
            case 1:
                return <Temp2 data={data} />
            case 2:
                return <Temp3 data={data} />
            case 3:
                return <Temp4 data={data} />
            case 4:
                return <Temp5 data={data} />
            case 5:
                return <Temp6 data={data} />
            case 6:
                return <Temp7 data={data} />
            case 7:
                return <Temp8 data={data} />
            case 8:
                return <Temp9 data={data} />
            case 9:
                return <Temp10 data={data} />
            case 10:
                return <Temp11 data={data} />
            case 11:
                return <Temp12 data={data} />
            default:
                break;
        }
    }

    const centerElem = (type === 1 || type === 7 || type === 2 || type === 3 || type===11 ) ? true : false
    return (
        <div className="course__builder-preview" style={{ marginTop: allSlide && 0 }}>
            {
                !allSlide && (
                    <h1>Preview</h1>
                )
            }

            <div className={`preview ${allSlide && "all"}`}>
                
                <div className={`preview__item ${centerElem ? "center" : ""} ${allSlide ? "all" : ""} `}>
                    {renderer()}
                </div>

                <div className="preview__btn">
                    <button className="prev" >
                        <BsArrowLeft size={allSlide ? 14 : 20} />
                        <p>Previous</p>
                    </button>
                    <button className="next">
                        <p>Next</p>
                        <BsArrowRight size={allSlide ? 14 : 20} />
                    </button>
                </div>
            </div>
        </div >
    )
}

export default Preview