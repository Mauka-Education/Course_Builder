import { useEffect, useState } from "react";
import { useInitiateSlideMutation } from "../redux/slices/slide";

const useInitateSlide = (id, type, slideno, isUpdate,order) => {
  const [mainId, setMainId] = useState(null);
  const [addedSlide, setAddedSlide] = useState(null);
  const [initiateSlide] = useInitiateSlideMutation();

  useEffect(() => {
    if (!isUpdate) {
      initiateSlide({ id, type, slideno,order })
        .unwrap()
        .then((res) => {
          setMainId(res.data.id);
          setAddedSlide(res.data.slide);
        })
        .catch((err) => {
          console.log("Failed");
        });
    }
  }, []);

  return { mainId, slide: addedSlide };
};

export default useInitateSlide;