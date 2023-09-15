import { Box, CircularProgress, Skeleton } from "@mui/material";
import styles from "./OnTimeLatePunch.module.css";
import { useEffect, useState } from "react";
import moment from "moment";
import { useGetAllAttendanceByIdQuery } from "@/redux/services/attendanceApi";
import { useAppSelector } from "@/redux/store";
import {
  AttendanceDataType,
  Punch,
} from "@/views/dashboard/types/attendanceDataType";
import { AttendanceTypes } from "../../types/attendanceType";

const OnTimeLatePunch = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [onTimeCount, setOnTimeCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);

  const user = useAppSelector((state) => state.user.UserData);
  const {
    data,
    isSuccess,
    isLoading: isFetching,
  } = useGetAllAttendanceByIdQuery(user?.id);
  const formattedData = data?.map((item: AttendanceDataType) => ({
    ...item,
    date: new Date(item.date),
  }));

  useEffect(() => {
    if (isSuccess) {
      const currentDate = moment();

      if (currentDate.date() === 1) {
        // for 1 month punch-in only
        setOnTimeCount(0);
        setLateCount(0);
      }

      if (currentDate.date() <= moment().daysInMonth()) {
        const onTimeStartTime = moment().set({
          hour: 9,
          minute: 30,
          second: 0,
        });
        const onTimeEndTime = moment().set({
          hour: 10,
          minute: 15,
          second: 0,
        });
        const lateEndTime = moment().set({
          hour: 19,
          minute: 0,
          second: 0,
        });

        let onTimeCount = 0;
        let lateCount = 0;

        formattedData.forEach((item: AttendanceDataType) => {
          item.punches.forEach((punch: Punch) => {
            const punchTime = moment(punch.timestamp);
            const formattedPunchTime = punchTime.format("h:mm:ss");
            if (punch.type === AttendanceTypes.punchIn) {
              if (
                formattedPunchTime > onTimeStartTime.format("h:mm:ss") &&
                formattedPunchTime < onTimeEndTime.format("h:mm:ss")
              ) {
                onTimeCount++;
              } else if (
                formattedPunchTime > onTimeEndTime.format("h:mm:ss") &&
                formattedPunchTime < lateEndTime.format("h:mm:ss")
              ) {
                lateCount++;
              } else {
                onTimeCount++;
              }
            }
          });
        });

        setOnTimeCount(onTimeCount);
        setLateCount(lateCount);
      }
    }
    setIsLoading(false);
  }, [isSuccess, formattedData]);
  const totalPunches = onTimeCount + lateCount;

  return (
    <div className={styles.ontimeLatePunchDiv}>
      <div className={styles.onTimeMainDiv}>
        {isLoading ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Skeleton
              variant="rounded"
              animation="wave"
              width={220}
              height={65}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: "220px",
              height: "65px",
              backgroundColor: "#E3FDF0",
              padding: "5px",
              "&:hover": {
                backgroundColor: "#E3FDDF",
              },
              borderRadius: "10px",
              boxShadow: "5px 5px 5px #bdbdbd",
            }}
          >
            <div className={styles.contentMainDiv}>
              {isFetching ? (
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width={50}
                  height={50}
                />
              ) : (
                <CircularProgress
                  variant="determinate"
                  value={(onTimeCount / totalPunches) * 100}
                  size={50}
                  thickness={4}
                  color="success"
                />
              )}
              <div
                className={styles.circularDiv}
                style={{ color: "green", transform: "translate(-50px)" }}
              >
                {isFetching ? (
                  <Skeleton variant="text" animation="wave" width={30} />
                ) : (
                  `${Math.round((onTimeCount / totalPunches) * 100)}%`
                )}
              </div>
              <div>
                <h5 className={styles.headingDiv}>On Time</h5>
                {isFetching ? (
                  <Skeleton variant="text" animation="wave" width={40} />
                ) : (
                  <h6 className={styles.suHeadingOnTime}>{onTimeCount}</h6>
                )}
              </div>
            </div>
          </Box>
        )}
      </div>
      <div className={styles.lateMainDiv}>
        {isLoading ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Skeleton
              variant="rounded"
              animation="wave"
              width={220}
              height={65}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: "220px",
              height: "65px",
              backgroundColor: "#FFFFE4",
              padding: "5px",
              "&:hover": {
                backgroundColor: "#FFFFD0",
              },
              borderRadius: "10px",
              boxShadow: "5px 5px 5px #bdbdbd",
            }}
          >
            <div className={styles.contentMainDiv}>
              {isFetching ? (
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width={50}
                  height={50}
                />
              ) : (
                <CircularProgress
                  variant="determinate"
                  value={(lateCount / totalPunches) * 100}
                  size={50}
                  thickness={4}
                  color="warning"
                />
              )}
              <div
                className={styles.circularDiv}
                style={{ color: "goldenrod", transform: "translate(-38px)" }}
              >
                {isFetching ? (
                  <Skeleton variant="text" animation="wave" width={30} />
                ) : (
                  `${Math.round((lateCount / totalPunches) * 100)}%`
                )}
              </div>
              <div>
                <h5 className={styles.headingDiv}>Late</h5>
                {isFetching ? (
                  <Skeleton variant="text" animation="wave" width={40} />
                ) : (
                  <h6 className={styles.suHeadinglate}>{lateCount}</h6>
                )}
              </div>
            </div>
          </Box>
        )}
      </div>
    </div>
  );
};
export default OnTimeLatePunch;
