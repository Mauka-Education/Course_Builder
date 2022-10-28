import React, { useEffect, useState } from 'react'


const initialValue = [
  {
    id: 0,
    val: "",
    isCorrect: false
  },
  {
    id: 1,
    val: "",
    isCorrect: false
  },
  {
    id: 2,
    val: "",
    isCorrect: false
  },
  {
    id: 3,
    val: "",
    isCorrect: false
  },
]
const MCQ = ({ isMulti = false, setQuestion, setAnswer, setMark, isTest = false, update }) => {
  const [questArray, setQuestArray] = useState( !update?.is ? initialValue : [])

  const onChangeHandler = (id, value) => {
    setQuestArray(item => item.map(p => p.id === id ? { ...p, val: value } : p))

  }

  useEffect(() => {
    if (update?.is) {
      update.data.options.forEach((item,i)=>{
        if(isMulti){
          const isCorrect= update.data.correct_options.find(ans=>ans.val===item.val)
          setQuestArray(prev=>[...prev,{id:i,val: item.val,_id:item._id,isCorrect: isCorrect ? true : false}])
        }else{
          setQuestArray(prev=>[...prev,{id:i,val: item.val,_id:item._id,isCorrect: update.data.correct_options[0]?.val===item.val ? true :false}])
        }
      })
    } else {
      setQuestion((questArray.map((item, i) => {
        return `Option ${i + 1}`
      })))
    }
  }, [])

  console.log({questArray})
  useEffect(() => {

    setAnswer(questArray.map((item) => {
      if (item.isCorrect) {
        return { val: item.val }
      }
    }))
    setQuestion(questArray.map(({ id, isCorrect, val }) => {
      return { val }
    }))

  }, [questArray])
  const onAnsSelectHandler = (id, value) => {
    if (isMulti) {
      setQuestArray(item => item.map(obj => obj.id === id ? { ...obj, isCorrect: value } : obj))
    } else {
      setQuestArray(item => item.map(obj => obj.id === id ? { ...obj, isCorrect: value } : { ...obj, isCorrect: false }))
    }
  }
  return (
    <div className="course__builder-template__option">
      <div className="upper">
        {
          questArray.map((item, i) => (
            <div className="upper__item" key={item.id}>
              <p>Option {item.id + 1}</p>
              <input type="text" placeholder='Lorem Ipsum' onChange={(e) => onChangeHandler(i, e.target.value)} defaultValue={item.val} />
            </div>
          ))
        }
      </div>
      <div className="lower">
        {
          isTest && (
            <div className="lower__left">
              <p>Marks</p>
              <input type="number" defaultValue={1} onChange={(e) => setMark(e.target.value)} />
            </div>

          )
        }
        <div className="lower__right">
          <p>Correct Option</p>
          <div className="lower__answer">
            {questArray.map((item) => (
              <h3 key={item.id} className={item.isCorrect ? "corr" : ""} onClick={() => onAnsSelectHandler(item.id, item.isCorrect ? false : true)}>Option {item.id + 1}</h3>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MCQ