
import Card from '../../shared/Card'
import { BsPlusLg } from "react-icons/bs"
import { motion } from 'framer-motion';
import Link from 'next/link';

const Home = ({ data }) => {

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
    <div className="mauka__builder-home">
      <div className="mauka__builder-home__title">
        <h1>Course Builder</h1>
      </div>
      <div className="astrodivider"><div className="astrodividermask"></div><span><i>&#10038;</i></span></div>
      <div className="mauka__builder-home__content">
        <Link href={"/addcourse"} passHref>
          <motion.div className="add__card" whileTap={{ scale: .97 }}>
            <div className="add__card-circle">
              <BsPlusLg size={40} color="white" />
            </div>
          </motion.div>
        </Link>
        {
          data?.map((item, index) => (
            <div key={index}>
              <Card img={item?.img_url ?? item?.image_url} title={item?.name} subtitle={shorten(item?.short_desc, 60, " ", index, item)} duration={item.time_to_finish} lesson={item?.lessons?.length} />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Home