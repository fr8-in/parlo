import Avatar from "@mui/material/Avatar";
import util from "../lib/utils";
import { blueGrey, common } from "@mui/material/colors";

const ProfileHeader = (props: any) => {
    const { company_name } = props

    return (
        <div className="animation">
            <div className="flex flex-col justify-center items-center pb-2">
                <Avatar sx={{ bgcolor: common.white, fontWeight: 700, color: blueGrey[900] }}>{util.avatar(company_name)}</Avatar>
                <h3 className="text-white">{company_name}</h3>
            </div>
            <div className="flex w-full">
                <svg
                    className=" h-10 w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 24 150 28"
                    preserveAspectRatio="none"
                    shapeRendering="auto"
                >
                    <defs>
                        <path
                            id="gentle-wave"
                            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                        />
                    </defs>
                    <g className="parallax">
                        <use
                            xlinkHref="#gentle-wave"
                            x="48"
                            y="0"
                            fill="rgba(255,255,255,0.7"
                        />
                        <use
                            xlinkHref="#gentle-wave"
                            x="48"
                            y="3"
                            fill="rgba(255,255,255,0.5)"
                        />
                        <use
                            xlinkHref="#gentle-wave"
                            x="48"
                            y="5"
                            fill="rgba(255,255,255,0.3)"
                        />
                        <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
                    </g>
                </svg>
            </div>
        </div>
    );
}

export default ProfileHeader