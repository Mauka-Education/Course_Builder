
import Card from '../../shared/Card/Card'
import { BsPlusLg } from "react-icons/bs"
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { clearCourse, setCourseData } from '../../../redux/slices/util';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { confirmAlert } from 'react-confirm-alert';
import { useCreateCourseMutation, useDeleteCourseMutation } from '../../../redux/slices/course';
import { ToastContainer, toast } from 'react-toast';

const Home = ({ data, refetch }) => {
  const { initiated } = useSelector(state => state.util)
  const router = useRouter()
  const dispatch = useDispatch()
  const [deleteCourse] = useDeleteCourseMutation()
  const [initateCourse] = useCreateCourseMutation()

  function shorten(str, maxLen, separator = ' ', index, item) {
    if(!str) return ""
    if (str.length <= maxLen) return str;
    return (
      <>
        {str.substr(0, str.lastIndexOf(separator, maxLen))}<span onClick={() => readMoreHandler(index, item)}>...</span>
      </>
    )
  }

  if (!data) {
    return null
  }

  const onDeleteHandler = (id) => {
    confirmAlert({
      title: "Deleting Course",
      message: "Are you sure you want to delete this course?",
      buttons: [
        {
          label: "Yes,Sure",
          onClick: () => {
            deleteCourse(id).unwrap().then(() => {
              toast.success("Course Deleted")
              refetch()
              dispatch(clearCourse())
            }).catch(err => {
              toast.error("Try Again")
              console.log("Error Occured")
            })
          },
        },
        {
          label: "No",
          onClick: () => console.log("Not Deleted")
        },
      ]
    })
  }

  const onAddCourseHandler = () => {
    initateCourse().unwrap().then(res => {
      console.log({ data })
      dispatch(clearCourse())
      dispatch(setCourseData(res.data))
      toast.success("Course Created")
      router.push("/addcourse")
    }).catch(err => {
      console.log({ err })
    })
  }

  return (
    <>
      <ToastContainer delay={2000} position={"bottom-left"} />
      {
        initiated?.once && (
          <header className='header'>
            <div className="header__left">
              <Image src={"/logo.png"} width={60} height={50} objectFit="contain" />
              <h1>Course Builder</h1>
            </div>
            <motion.div className="header__right" whileTap={{ scale: .98 }} onClick={() => router.push("/addcourse")}>
              <h2>Continue</h2>
            </motion.div>
          </header>

        )
      }
      <div className={`mauka__builder-home ${initiated?.once && "pad"}`}>
        {
          !initiated?.once && (
            <div className="mauka__builder-home__title">

              <Image src={"/logo.png"} width={100} height={90} objectFit="contain" />
              <h1>Course Builder</h1>
            </div>
          )
        }
        <div className="astrodivider"><div className="astrodividermask"></div><span><i>&#10038;</i></span></div>
        {/* <div className="mauka__builder-home__bar">
          <motion.div className="help" whileTap={{scale:.97}}>
            <h2>How to Use</h2>
          </motion.div>
        </div> */}
        <div className="mauka__builder-home__content">

          <motion.div className="add__card" whileTap={{ scale: .97 }} onClick={onAddCourseHandler}>
            <div className="add__card-circle">
              <BsPlusLg size={40} color="white" />
            </div>
          </motion.div>
          {
            data?.map((item, index) => (
              <div key={index}>
                <Card id={item?._id} deleteHandler={onDeleteHandler} img={item?.img_url} title={item?.name} subtitle={shorten(item?.short_desc, 60, " ", index, item)} duration={item.time_to_finish} lesson={item?.lessons?.length} />
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default Home