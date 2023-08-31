import { useNavigate } from "react-router-dom";
import BackSvg from "../lib/icons/backSvg";
import { Button } from "@mui/material";


interface Props {
  goBack?: Function;
  style?: string;
  size?: string
}

const BackButton = (props: Props) => {
  const { goBack, style } = props;
  const navigate = useNavigate();
  return (
    <Button size="small"
      // className={` leading-none  ${style ? style : ""}`}
      onClick={() => (goBack ? goBack() : navigate(-1))}
    >
      <BackSvg />
    </Button >
  );
};

export default BackButton;
