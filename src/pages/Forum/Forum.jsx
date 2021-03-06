/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Forum.css";
import Notification from "../../components/notification/notification";
import Stack from "@mui/material/Stack";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import StudentSidebar from "../../components/studentsidebar/StudentSidebar";
// import StudentService from "../../services/student.service";
import AuthService from "../../services/auth.service";
import NotificationService from "../../services/notification.service";
import ForumService from "../../services/forum.service";

export default function Forum() {
  const [isManager, setIsManager] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (!AuthService.isUser()) {
      history.push("/login");
    } else {
      const fetchData = async () => {
        if (AuthService.isManager()) {
          setIsManager(true);
          const data = await NotificationService.listformanager();
          setNotifications(data);
        } else {
          setIsManager(false);
          const data = await NotificationService.listforstudent();
          setNotifications(data);
        }
      };
      fetchData();
    }
  }, []);

  const toAddNotification = () => {
    const path = "/notification/add";
    history.push(path);
  };

  return (
    <div>
      <Topbar />
      <div className="container">
        {isManager ? <Sidebar /> : <StudentSidebar />}
        <div className="forum">
          <h1>Thông báo</h1>
          {isManager ? (
            <div>
              <Stack direction="row" spacing={2} className="stack">
                <button className="button" onClick={toAddNotification}>
                  THÊM ĐỀ TÀI MỚI
                </button>
              </Stack>
            </div>
          ) : null}
          {notifications.map((e) => (
            <Notification
              noti_id={e._id}
              title={e.title}
              class={e.class}
              content={e.content}
              key={e._id}
              isManager={isManager}
            ></Notification>
          ))}
        </div>
      </div>
    </div>
  );
}
