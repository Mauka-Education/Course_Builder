
import Card from '../../shared/Card'
import { BsPlusLg } from "react-icons/bs"
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { clearCourse } from '../../../redux/slices/util';

const Home = ({ data }) => {
  const { initiated } = useSelector(state => state.util)
  const router = useRouter()
  const dispatch = useDispatch()

  function shorten(str, maxLen, separator = ' ', index, item) {
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

  return (
    <>
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
        <div className="mauka__builder-home__content">
          <Link href={"/addcourse"} passHref>
            <motion.div className="add__card" whileTap={{ scale: .97 }} onClick={() => dispatch(clearCourse())}>
              <div className="add__card-circle">
                <BsPlusLg size={40} color="white" />
              </div>
            </motion.div>
          </Link>
          {
            data?.map((item, index) => (
              <div key={index}>
                <Card id={item?._id} img={item?.img_url ?? item?.image_url} title={item?.name} subtitle={shorten(item?.short_desc, 60, " ", index, item)} duration={item.time_to_finish} lesson={item?.lessons?.length} />
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default Home