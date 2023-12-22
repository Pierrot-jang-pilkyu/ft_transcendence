import Header from "../../components/Header";
import styles from "./Chatting.module.css";
import msgimg from "../../assets/ChattingInputButton.svg"
import Avatar from "./Avatar";
import {
  useContext,
  useRef,
  useEffect,
  useState,
  KeyboardEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RoomAddModal from "./RoomAddModal";
import EnterPW from "./EnterPW";
import AlertModal from "./AlertModal";
import axios from "axios";
import socket from "./Socket";
import ModalAccept from "../../components/AddAndAccept";
import { LoginContext, dmContext } from "../../App";
import { freshSocket } from "../../Utils";

interface User {
  name: string;
  img: string;
  state: string;
  id: string;
  op: boolean;
}

interface BackLog {
  name: string;
  img: string;
  date: string;
  chat: string;
}

interface ChattingRoom {
  start: number;
  chatId: number;
  title: string;
  private: boolean;
  users: User[];
  limits: number;
  backLogList: BackLog[];
  chatLogList: any;
}

let chatListNum = 0;

let socketOnNum = 0;

let logDay: string = "";

// Current Chatting Room
let currentCR: ChattingRoom = {
  start: 0,
  chatId: 0,
  title: "Lobby",
  private: false,
  users: [],
  limits: 0,
  backLogList: [],
  chatLogList: [],
};
// chat list
let publicChatList: ChattingRoom[] = [];
let clientChatList: ChattingRoom[] = [];
let dmChatList: ChattingRoom[] = [];

// Cookie
import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name: string, value: string, options?: any) => {
  return cookies.set(name, value, { ...options });
};

export const getCookie = (name: string) => {
  return cookies.get(name);
};

let thisUser:User = { id: "", name: "", img: "", state: "", op: false };
let userId:number = 0;

let dmFlag:boolean = true;

function Chatting(props: any) {
  // const userId:number = parseInt(getCookie("user.id"));
  // const [userId, setUserId] = useState<number>(0);
  const { state } = useLocation();
  const navigate = useNavigate();
  // const userId = state;
  const [login, setLogin] = useContext(LoginContext);
  const [dm, setDm] = useContext(dmContext);
  const [openRoomAddModal, setOpenRoomAddModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(
    null
  );

  const handleOpenRoomModal = () => {
    setOpenRoomAddModal(true);
  };

  const handleCloseRoomModal = () => {
    setOpenRoomAddModal(false);
  };

  const [openPWAddModal, setOpenPWAddModal] = useState(false);

  const handleOpenPWModal = () => {
    setOpenPWAddModal(true);
  };

  const handleClosePWModal = () => {
    setOpenPWAddModal(false);
  };

  const [openAlertAddModal, setOpenAlertAddModal] = useState(false);

  const handleOpenAlertModal = () => {
    setOpenAlertAddModal(true);
  };

  const handleCloseAlertModal = () => {
    setOpenAlertAddModal(false);
  };

  // const [thisUser, setThisUser] = useState<any>();

  // time
  let today: any = new Date();

  const timeStamp = (flag: any) => {
    let res: string = " ";

    if (flag === 1) {
      res += today.getFullYear() + ".";
      if (today.getMonth() + 1 < 10) res += "0" + (today.getMonth() + 1) + ".";
      else res += today.getMonth() + 1 + ".";

      if (today.getDate() < 10) res += "0" + today.getDate() + " ";
      else res += today.getDate() + " ";

      const day: string[] = [
        "",
        "Mon.",
        "Tue.",
        "Wed.",
        "Thu.",
        "Fri.",
        "Sat.",
        "Sun.",
      ];

      res += day[today.getDay()] + " ";

      return res;
    }

    if (today.getHours() < 10) res += "0" + today.getHours() + ":";
    else res += today.getHours() + ":";

    if (today.getMinutes() < 10) res += "0" + today.getMinutes();
    else res += today.getMinutes();

    return res;
  };

  const timeStamp_this = (flag:any, date:string) => {
    let res: string = " ";

    let thisDay: any = new Date(
      parseInt(date.substring(0, 4)), // year
      parseInt(date.substring(5, 7)) - 1, // month
      parseInt(date.substring(8, 10)), // day
      parseInt(date.substring(11, 13)), // hours
      parseInt(date.substring(14, 16)), // minute
      parseInt(date.substring(17, 19)), // seconds
      parseInt(date.substring(20, 23)) // milliseconds
    );

    if (flag === 1) {
      res += thisDay.getFullYear() + ".";
      if (thisDay.getMonth() + 1 < 10)
        res += "0" + (thisDay.getMonth() + 1) + ".";
      else res += thisDay.getMonth() + 1 + ".";

      if (thisDay.getDate() + 1 < 10) res += "0" + thisDay.getDate() + " ";
      else res += thisDay.getDate() + " ";

      const day: string[] = [
        "",
        "Mon.",
        "Tue.",
        "Wed.",
        "Thu.",
        "Fri.",
        "Sat.",
        "Sun.",
      ];

      res += day[thisDay.getDay()] + " ";

      return res;
    }

    if (thisDay.getHours() < 10) res += "0" + thisDay.getHours() + ":";
    else res += thisDay.getHours() + ":";

    if (thisDay.getMinutes() < 10) res += "0" + thisDay.getMinutes();
    else res += thisDay.getMinutes();

    return res;
  };

  const announce: string = "명령어(대/소문자 구분 없음)\n"
    + "전체 유저 명령어\n\n"
    + "친구 요청 : /REQUEST_FRIEND Nick_Name\n"
    + "게임 초대 : /INVITE Nick_Name\n"
    + "친구 차단 : /BLOCK Nick_Name\n"
    + "친구 차단 해제 : /UNBLOCK Nick_Name\n"
    + "\n"
    + "방장 권한\n\n"
    + "강퇴 : /KICK Nick_Name\n"
    + "입장 불가 명단 등재 : /BAN Nick_Name\n"
    + "상위 항목 해제 : /UNBAN Nick_Name\n"
    + "1분간 채팅 금지 : /MUTE Nick_Name\n"
    + "방장 권한 부여 : /OP Nick_Name\n"
    + "방 비밀번호 변경 : /PASS New_Password";

  const [menuChecked, setMenuChecked] = useState(false);

  const [chat, setChat] = useState("");
  const [chatId, setChatId] = useState<number>(0);
  const [chatTitle, setChatTitle] = useState("Lobby");
  const [chatAvatar, setChatAvatar] = useState<any>([
    <li>
      <div className={styles.profile_font}>{' " Carpe Diem ! " '}</div>
    </li>,
  ]);
  const [chatLog, setChatLog] = useState<any>([
    <li>
      <div className={styles.chatting_start}>
        <div className={styles.chatting_start_font}>Looby</div>
      </div>
    </li>,
    <li>
      <div className={`${styles.chat} ${styles.chat_start}`}>
        <div className={`${styles.chat_image}`}>
          <div className="w-10 rounded-full">
            <img
              className={styles.rounded_avatar}
              src={"./src/assets/img_Profile.png"}
            />
          </div>
        </div>
        <div className={`${styles.chat_header}`}>
          {"Admin"}
          <time className={`${styles.text_xs} ${styles.opacity_50}`}>
            {timeStamp(0)}
          </time>
        </div>
        <div className={`${styles.chat_bubble}`}><pre><pre>{announce}</pre></pre></div>
        <div className={`${styles.chat_footer} ${styles.opacity_50}`}></div>
      </div>
    </li>,
  ]);

  let lobby: ChattingRoom;

  lobby = {
    start: -1,
    chatId: 0,
    title: "Lobby",
    private: false,
    users: [],
    limits: 0,
    backLogList: [],
    chatLogList: [],
  };

  const [me, setMe] = useState();
  const [other, setOther] = useState();
  const [roomListMe, setRoomListMe] = useState<ChattingRoom[]>([lobby]);
  const [roomListOther, setRoomListOther] = useState<ChattingRoom[]>([]);
  const [dmList, setDMList] = useState<ChattingRoom[]>([]);

  clientChatList = roomListMe;
  publicChatList = roomListOther;
  dmChatList = dmList;

  currentCR.chatId = chatId;
  currentCR.title = chatTitle;
  currentCR.chatLogList = chatLog;

  const viewAvatar = () => {
    const res: any = [];

    if (currentCR.chatId === 0 || currentCR.users.length === 0) {
      res.push(
        <li>
          <div className={styles.profile_font}>{' " Carpe Diem ! " '}</div>
        </li>
      );
      return res;
    }

    for (let i = 0; i < currentCR.users.length; ++i) {
      // 이미지, 방장여부, 상태(온라인, 게임중, 오프라인) 받기
      // if (props.name === currentCR.users[i].name)
      if (thisUser.name === currentCR.users[i].name) {
        res.push(
          <li>
            <Avatar
              name={currentCR.users[i].name}
              img={currentCR.users[i].img}
              state={currentCR.users[i].state}
              op={currentCR.users[i].op}
              id={currentCR.users[i].id}
              flag={true}
            />
          </li>
        );
      } else {
        res.push(
          <li>
            <Avatar
              name={currentCR.users[i].name}
              img={currentCR.users[i].img}
              state={currentCR.users[i].state}
              op={currentCR.users[i].op}
              id={currentCR.users[i].id}
              flag={false}
            />
          </li>
        );
      }
    }

    return res;
  };

  const thisDayStamp = (log: any, date: string) => {
    if (currentCR.backLogList.length === 0) return;
    if (logDay === date.substring(0, 10)) return;
    else {
      logDay = date.substring(0, 10);
      log.push(
        <li>
          <div className={styles.chatting_start}>
            <div className={styles.chatting_start_font}>
              {timeStamp_this(1, date)}
            </div>
          </div>
        </li>
      );
    }
  };

  const onChatting = (cr: ChattingRoom) => {
    const res: any = [];

    if (cr.backLogList.length === 0 && cr.start === 0) {
      cr.start = 1;
      // cr.chatLogList = chatLog;
      res.push(
        <li>
          <div className={styles.chatting_start}>
            <div className={styles.chatting_start_font}>{timeStamp(1)}</div>
          </div>
        </li>
      );
    } else if (cr.start === -1) {
      res.push(
        <li>
          <div className={styles.chatting_start}>
            <div className={styles.chatting_start_font}>Looby</div>
          </div>
        </li>
      );
      res.push(
        <li>
          <div className={`${styles.chat} ${styles.chat_start}`}>
            <div className={`${styles.chat_image}`}>
              <div className="w-10 rounded-full">
                <img
                  className={styles.rounded_avatar}
                  src={"./src/assets/img_Profile.png"}
                />
              </div>
            </div>
            <div className={`${styles.chat_header}`}>
              {"Admin"}
              <time className={`${styles.text_xs} ${styles.opacity_50}`}>
                {timeStamp(0)}
              </time>
            </div>
            <div className={`${styles.chat_bubble}`}><pre>{announce}</pre></div>
            <div className={`${styles.chat_footer} ${styles.opacity_50}`}></div>
          </div>
        </li>
      );
    }

    logDay = "";

    for (let i = 0; i < cr.backLogList.length; ++i) {
      // if (cr.backLogList[i].name === props.name)
      if (cr.backLogList[i].name === thisUser.name) {
        thisDayStamp(res, cr.backLogList[i].date);
        res.push(
          <li>
            <div className={`${styles.chat} ${styles.chat_end}`}>
              <div className={`${styles.chat_image}`}>
                <div className="w-10 rounded-full">
                  <img
                    className={styles.rounded_avatar}
                    src={cr.backLogList[i].img}
                  />
                </div>
              </div>
              <div className={`${styles.chat_header}`}>
                {cr.backLogList[i].name}
                <time className={`${styles.text_xs} ${styles.opacity_50}`}>
                  {timeStamp_this(0, cr.backLogList[i].date)}
                </time>
              </div>
              <div className={`${styles.chat_bubble}`}>
                {cr.backLogList[i].chat}
              </div>
              <div
                className={`${styles.chat_footer} ${styles.opacity_50}`}
              ></div>
            </div>
          </li>
        );
      } else {
        thisDayStamp(res, cr.backLogList[i].date);
        res.push(
          <li>
            <div className={`${styles.chat} ${styles.chat_start}`}>
              <div className={`${styles.chat_image}`}>
                <div className="w-10 rounded-full">
                  <img
                    className={styles.rounded_avatar}
                    src={cr.backLogList[i].img}
                  />
                </div>
              </div>
              <div className={`${styles.chat_header}`}>
                {cr.backLogList[i].name}
                <time className={`${styles.text_xs} ${styles.opacity_50}`}>
                  {timeStamp_this(0, cr.backLogList[i].date)}
                </time>
              </div>
              <div className={`${styles.chat_bubble}`}>
                {cr.backLogList[i].chat}
              </div>
              <div
                className={`${styles.chat_footer} ${styles.opacity_50}`}
              ></div>
            </div>
          </li>
        );
      }
    }

    currentCR.chatLogList = res;

    return res;
  };

  const [viewRoomList, setViewRoomList] = useState<any>([]);
  const [viewDMList, setViewDMList] = useState<any>([]);
  const [index, setIndex] = useState<number>(-1);
  const [content, setContent] = useState("");
  const [pwFlag, setPWFlag] = useState<boolean>(false);

  let pwFlag2: boolean = false;
  let index2: number = -1;

  const viewChattingRoomList = () => {
    let res: any = [];

    if (chatListNum === 0) {
      chatListNum++;

      return;
    }

    for (let i = 0; i < clientChatList.length; ++i) {
      res.push(
        <li>
          {/* <div id={ clientChatList[i].title } className={styles.chatlist_font} onClick={handleOpenPWModal} >{ clientChatList[i].title }</div> */}
          <div id={clientChatList[i].title} className={styles.chatlist_font}>
            {clientChatList[i].title}
          </div>
        </li>
      );
    }

    for (let i = 0; i < publicChatList.length; ++i) {
      res.push(
        <li>
          <div
            id={publicChatList[i].title}
            className={styles.chatlist_font_other}
          >
            {publicChatList[i].title}
          </div>
        </li>
      );
    }

    return res;
  };

  const viewChattingDMList = () => {
    let res: any = [];

    for (let i = 0; i < dmChatList.length; ++i) {
      res.push(
        <li>
          <div id={dmChatList[i].title} className={styles.dmlist_font}>
            {dmChatList[i].title}
          </div>
        </li>
      );
    }

    return res;
  };

  function roomAdd(name: string, limits: string, pw: string) {
    if (2 <= parseInt(limits) && parseInt(limits) <= 10) {

      // socket.emit("HOST", {
      //   userId: userId,
      //   title: name,
      //   password: pw,
      //   limit: parseInt(limits),
      // });
      freshSocket(socket, "HOST",
      {
        userId: userId,
        title: name,
        password: pw,
        limit: parseInt(limits),
      },
      () => { setLogin(false) });
    }
  }

  function freshAxios(axObj: any, resFunc: any, errFunc: any) {
    axios(axObj)
      .then((res) => {
        resFunc(res)
      })
      .catch((error) => {
        if (error.response.data.message === "Unauthorized") {
          axios.get("http://" + import.meta.env.VITE_BACKEND + "/auth/refresh/2fa")
            .then(() => {
              axios(axObj).then((res) => { resFunc(res) })
              .catch((error) => {
                console.log(error);
              })
            })
            .catch(() => {
              errFunc();
            })
        }
      })
  }

  useEffect(() => {

    function getUserRes(Response:any) {
      // setThisUser(Response.data);
      // setUserId(parseInt(Response.data.id));
      thisUser.id = Response.data.id;
      thisUser.name = Response.data.name;
      thisUser.img = Response.data.avatar;
      thisUser.state = Response.data.status;
      userId = parseInt(Response.data.id);
    }

    freshAxios("http://" + import.meta.env.VITE_BACKEND + "/users/players/me",
            getUserRes, () => { setLogin(false); } );
    
    if (clientChatList.length === 1) {

      function getChatListMe(Response:any) {
        setMe(Response.data);

        for (let i = 0; i < Response.data.length; ++i) {
          {
            Response.data[i].public &&
              clientChatList.push({
                start: 1,
                chatId: Response.data[i].id,
                title: Response.data[i].title,
                private: false,
                users: [],
                limits: Response.data[i].limit,
                backLogList: [],
                chatLogList: [],
              });
          }
          {
            !Response.data[i].public &&
              clientChatList.push({
                start: 1,
                chatId: Response.data[i].id,
                title: Response.data[i].title,
                private: true,
                users: [],
                limits: Response.data[i].limit,
                backLogList: [],
                chatLogList: [],
              });
          }
        }
        setRoomListMe(clientChatList);
        clientChatList = roomListMe;
        setViewRoomList(viewChattingRoomList());
      }

      freshAxios("http://" + import.meta.env.VITE_BACKEND + "/users/channels/me/in",
            getChatListMe, () => { setLogin(false); } );

    }
    if (publicChatList.length === 0) {

      function getChatListPublic(Response:any) {
        setOther(Response.data);

          for (let i = 0; i < Response.data.length; ++i) {
            {
              Response.data[i].public &&
                publicChatList.push({
                  start: 0,
                  chatId: Response.data[i].id,
                  title: Response.data[i].title,
                  private: false,
                  users: [],
                  limits: Response.data[i].limit,
                  backLogList: [],
                  chatLogList: [],
                });
            }
            {
              !Response.data[i].public &&
                publicChatList.push({
                  start: 0,
                  chatId: Response.data[i].id,
                  title: Response.data[i].title,
                  private: true,
                  users: [],
                  limits: Response.data[i].limit,
                  backLogList: [],
                  chatLogList: [],
                });
            }
          }
          setRoomListOther(publicChatList);
          publicChatList = roomListOther;
          setViewRoomList(viewChattingRoomList());
      }

      freshAxios("http://" + import.meta.env.VITE_BACKEND + "/users/channels/me/out",
            getChatListPublic, () => { setLogin(false); } );
    
    }
    if (dmChatList.length === 0) {
      function getChatListDM(Response:any) {
        setOther(Response.data);
          for (let i = 0; i < Response.data.length; ++i) {
            dmChatList.push({
              start: 0,
              chatId: Response.data[i].id,
              title: Response.data[i].title,
              private: false,
              users: [],
              limits: Response.data[i].limit,
              backLogList: [],
              chatLogList: [],
            });
          }
          setDMList(dmChatList);
          setViewDMList(viewChattingDMList());
          // dmChatList = dmList;
      }

      freshAxios("http://" + import.meta.env.VITE_BACKEND + "/users/channels/me/dm",
            getChatListDM, () => { setLogin(false); } );

    }

    socket.connect();

    if (dm)
    {
      setDm(false);
      freshSocket(socket, "DM",
      state.data,
      () => { setLogin(false) });
    }

    async function onLoadChat(responseData: any) {
      for (let i = responseData.length - 1; i > -1; --i) {
        currentCR.backLogList.push({
          name: responseData[i].user.name,
          img: responseData[i].user.avatar,
          date: responseData[i].date,
          chat: responseData[i].content,
        });
      }

      if (currentCR.backLogList.length === 0) currentCR.start = 0;

      // onChatting(currentCR);
      await setChatLog(onChatting(currentCR));
      currentCR.chatLogList = chatLog;
    }

    function onInfoChList(responseData: any) {
      clientChatList.splice(0, clientChatList.length);
      clientChatList.push(lobby);
      publicChatList.splice(0, publicChatList.length);
      dmChatList.splice(0, dmChatList.length);

      for (let i = 0; i < responseData.me.length; ++i) {
        {
          responseData.me[i].public &&
            clientChatList.push({
              start: 1,
              chatId: responseData.me[i].id,
              title: responseData.me[i].title,
              private: false,
              users: [],
              limits: responseData.me[i].limit,
              backLogList: [],
              chatLogList: [],
            });
        }
        {
          !responseData.me[i].public &&
            clientChatList.push({
              start: 1,
              chatId: responseData.me[i].id,
              title: responseData.me[i].title,
              private: true,
              users: [],
              limits: responseData.me[i].limit,
              backLogList: [],
              chatLogList: [],
            });
        }
      }

      for (let i = 0; i < responseData.other.length; ++i) {
        {
          responseData.other[i].public &&
            publicChatList.push({
              start: 1,
              chatId: responseData.other[i].id,
              title: responseData.other[i].title,
              private: false,
              users: [],
              limits: responseData.other[i].limit,
              backLogList: [],
              chatLogList: [],
            });
        }
        {
          !responseData.other[i].public &&
            publicChatList.push({
              start: 1,
              chatId: responseData.other[i].id,
              title: responseData.other[i].title,
              private: true,
              users: [],
              limits: responseData.other[i].limit,
              backLogList: [],
              chatLogList: [],
            });
        }
      }

      for (let i = 0; i < responseData.dm.length; ++i) {
        {
          responseData.dm[i].public &&
            dmChatList.push({
              start: 1,
              chatId: responseData.dm[i].id,
              title: responseData.dm[i].title,
              private: false,
              users: [],
              limits: responseData.dm[i].limit,
              backLogList: [],
              chatLogList: [],
            });
        }
        {
          !responseData.dm[i].public &&
            dmChatList.push({
              start: 1,
              chatId: responseData.dm[i].id,
              title: responseData.dm[i].title,
              private: true,
              users: [],
              limits: responseData.dm[i].limit,
              backLogList: [],
              chatLogList: [],
            });
        }
      }

      setViewRoomList(viewChattingRoomList());
      setViewDMList(viewChattingDMList());
    }

    function onInfoChMem(responseData: any) {
      // code
      currentCR.users.splice(0, currentCR.users.length);
      for (let i = 0; i < responseData.length; ++i) {
        currentCR.users.push({
          name: responseData[i].user.name,
          img: responseData[i].user.avatar,
          state: responseData[i].user.status,
          id: responseData[i].user.id,
          op: responseData[i].op,
        });
        // console.log(currentCR.users[i]);
      }
      // currentCR.chatId = responseData[0].channel.id;

      setChatAvatar(viewAvatar());
    }

    function addChatLog(responseData: any, flag: number) {
      const res: any = [currentCR.chatLogList];

      if (flag === 0) {
        // if (cr.backLogList[i].name === props.name)
        if (responseData.user.name === thisUser.name) {
          thisDayStamp(res, responseData.date);
          res.push(
            <li>
              <div className={`${styles.chat} ${styles.chat_end}`}>
                <div className={`${styles.chat_image}`}>
                  <div className="w-10 rounded-full">
                    <img
                      className={styles.rounded_avatar}
                      src={responseData.user.avatar}
                    />
                  </div>
                </div>
                <div className={`${styles.chat_header}`}>
                  {responseData.user.name}
                  <time className={`${styles.text_xs} ${styles.opacity_50}`}>
                    {timeStamp_this(0, responseData.date)}
                  </time>
                </div>
                {/* <div className={ `${styles.chat_bubble}` }><pre>{responseData.content}</pre></div> */}
                <div className={`${styles.chat_bubble}`}>
                  {responseData.content}
                </div>
                <div
                  className={`${styles.chat_footer} ${styles.opacity_50}`}
                ></div>
              </div>
            </li>
          );
        } else {
          thisDayStamp(res, responseData.date);
          res.push(
            <li>
              <div className={`${styles.chat} ${styles.chat_start}`}>
                <div className={`${styles.chat_image}`}>
                  <div className="w-10 rounded-full">
                    <img
                      className={styles.rounded_avatar}
                      src={responseData.user.avatar}
                    />
                  </div>
                </div>
                <div className={`${styles.chat_header}`}>
                  {responseData.user.name}
                  <time className={`${styles.text_xs} ${styles.opacity_50}`}>
                    {timeStamp_this(0, responseData.date)}
                  </time>
                </div>
                {/* <div className={ `${styles.chat_bubble}` }><pre>{responseData.content}</pre></div> */}
                <div className={`${styles.chat_bubble}`}>
                  {responseData.content}
                </div>
                <div
                  className={`${styles.chat_footer} ${styles.opacity_50}`}
                ></div>
              </div>
            </li>
          );
        }
      } else if (flag === 1) {
        // if (cr.backLogList[i].name === props.name)
        if (responseData.user.name === thisUser.name) {
          thisDayStamp(res, responseData.date);
          res.push(
            <li>
              <div className={`${styles.chat} ${styles.chat_end}`}>
                <div className={`${styles.chat_image}`}>
                  <div className="w-10 rounded-full">
                    <img
                      className={styles.rounded_avatar}
                      src={responseData.user.avatar}
                    />
                  </div>
                </div>
                <div className={`${styles.chat_header}`}>
                  {responseData.user.name}
                  <time className={`${styles.text_xs} ${styles.opacity_50}`}>
                    {timeStamp_this(0, responseData.date)}
                  </time>
                </div>
                <div className={`${styles.chat_bubble}`}>
                  <pre>{responseData.content}</pre>
                </div>
                <div
                  className={`${styles.chat_footer} ${styles.opacity_50}`}
                ></div>
              </div>
            </li>
          );
        } else {
          thisDayStamp(res, responseData.date);
          res.push(
            <li>
              <div className={`${styles.chat} ${styles.chat_start}`}>
                <div className={`${styles.chat_image}`}>
                  <div className="w-10 rounded-full">
                    <img
                      className={styles.rounded_avatar}
                      src={responseData.user.avatar}
                    />
                  </div>
                </div>
                <div className={`${styles.chat_header}`}>
                  {responseData.user.name}
                  <time className={`${styles.text_xs} ${styles.opacity_50}`}>
                    {timeStamp_this(0, responseData.date)}
                  </time>
                </div>
                <div className={`${styles.chat_bubble}`}>
                  <pre>{responseData.content}</pre>
                </div>
                <div
                  className={`${styles.chat_footer} ${styles.opacity_50}`}
                ></div>
              </div>
            </li>
          );
        }
      }

      currentCR.chatLogList = res;

      return res;
    }

    function onMSG(responseData: any) {
      setChatLog(addChatLog(responseData, 0));
    }

    function onList(responseData: any) {
      setChatLog(addChatLog(responseData, 1));
    }

    function onKick(responseData: any) {
      socket.emit("EXIT", { channelId: currentCR.chatId, userId: userId });
      logDay = "";
      currentCR.start = clientChatList[0].start;
      setChatTitle(clientChatList[0].title);
      setChatId(clientChatList[0].chatId);
      currentCR.backLogList = clientChatList[0].backLogList;
      currentCR.users = clientChatList[0].users;
      setChatAvatar(viewAvatar());
      setChatLog(onChatting(currentCR));
    }

    function onBan(responseData: any) {
      const thisTime: string =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate() +
        "T" +
        today.getHours() +
        ":" +
        today.getMinutes() +
        ":" +
        today.getSeconds() +
        "." +
        today.getMilliseconds() +
        "Z";

      let content: string = "  BAN LIST\n------------\n   ";

      for (let i = 0; i < responseData.length; ++i) {
        content += responseData[i].user.name + "\n   ";
      }

      onList({
        id: 1,
        user: {
          id: userId,
          name: thisUser.name,
          avatar: thisUser.img,
          status: 0,
          date: thisTime,
        },
        content: content,
      });
    }

    function onBlock(responseData:any) {
      const thisTime:string =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate() +
        "T" +
        today.getHours() +
        ":" +
        today.getMinutes() +
        ":" +
        today.getSeconds() +
        "." +
        today.getMilliseconds() +
        "Z";

      let content: string = "  BLOCK LIST\n--------------\n    ";

      for (let i = 0; i < responseData.length; ++i) {
        content += responseData[i].target.name + "\n    ";
      }

      onList({
        id: 1,
        user: {
          id: userId,
          name: thisUser.name,
          avatar: thisUser.img,
          status: 0,
          date: thisTime,
        },
        content: content,
      });
    }

    // -------------------------------------------------------------------
    // -------------------------------------------------------------------
    // -------------------------------------------------------------------
    // -------------------------------------------------------------------
    // ------------------------------notice-------------------------------
    // -------------------------------------------------------------------
    // -------------------------------------------------------------------
    // -------------------------------------------------------------------
    // -------------------------------------------------------------------

    function onNoticeChatMSG(content: string) {
      const res: any = [currentCR.chatLogList];

      res.push(
        <li>
          <div className={styles.chatting_start}>
            <div className={styles.chatting_notice_font}>{content}</div>
          </div>
        </li>
      );

      currentCR.chatLogList = res;

      return res;
    }

    function onNotice(responseData: any) {

      const thisTime: string =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate() +
        "T" +
        today.getHours() +
        ":" +
        today.getMinutes() +
        ":" +
        today.getSeconds() +
        "." +
        today.getMilliseconds() +
        "Z";

      switch (responseData.code) {
        case 1: // 1	JOIN	DB에 channel id 가 없을 경우	존재하지 않는 channel입니다.
          setContent(responseData.content);
          handleOpenAlertModal();
          setTimeout(() => {
            handleCloseAlertModal();
          }, 1000);
          break;
        case 2: // 2	JOIN	유저가 해당 채팅방에 밴리스트에 등록 되었을 경우	해당 channel의 ban list에 등록 되어있어 입장이 불가합니다.
          setContent(responseData.content);
          handleOpenAlertModal();
          setTimeout(() => {
            handleCloseAlertModal();
          }, 1000);
          break;
        case 3: // 3	JOIN	채팅방 비밀번호가 일치하지 않을 경우	비밀번호가 일치하지 않습니다.
          setContent(responseData.content);
          handleOpenAlertModal();
          setTimeout(() => {
            handleCloseAlertModal();
          }, 1000);
          break;
        case 4: // 4	JOIN	채팅방 인원이 가득 찼을 경우	방이 가득 찼습니다.
          setContent(responseData.content);
          handleOpenAlertModal();
          setTimeout(() => {
            handleCloseAlertModal();
          }, 1000);
          logDay = "";
          currentCR.start = clientChatList[0].start;
          setChatTitle(clientChatList[0].title);
          setChatId(clientChatList[0].chatId);
          currentCR.backLogList = clientChatList[0].backLogList;
          currentCR.users = clientChatList[0].users;
          setChatAvatar(viewAvatar());
          setChatLog(onChatting(currentCR));
          break;
        case 5: // 5	JOIN	채팅방 입장	유저님이 채팅방에 입장하셨습니다.
          if (pwFlag2) {
            pwFlag2 = false;
            handleClosePWModal();
            logDay = "";
            currentCR.start = publicChatList[index2].start;
            setChatTitle(publicChatList[index2].title);
            setChatId(publicChatList[index2].chatId);
            currentCR.backLogList = publicChatList[index2].backLogList;
            currentCR.users = publicChatList[index2].users;
            setTimeout(() => {
              setChatLog(
                <li>
                  <div className={styles.chatting_start}>
                    <div className={styles.chatting_notice_font}>
                      {responseData.content}
                    </div>
                  </div>
                </li>
              );
            }, 100);
          } else setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 6: // 6	QUIT	채팅방 퇴장	유저님이 채팅방에서 퇴장하였습니다.
          if (currentCR.chatId === 0)
            break ;
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 7: // 7	EXIT	채팅방 강퇴	유저님이 채팅방에서 강퇴되었습니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 8: // 8	KICK, BAN, UNBAN, MUTE, PASS, OP	OP 권한이 없을 경우	OP 권한이 필요합니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 9: // 9	KICK, OP	유저가 채널 맴버가 아닌경우	채널 맴버가 아닙니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 10: // 10	KICK	강퇴 명령어 성공	성공적으로 강퇴하였습니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 11: // 11	BAN, UNBAN, BLOCK, UNBLOCK, MUTE, INVITE, REQUEST_FRIEND	유저가 존재하지 않을 경우	존재하지 않는 유저입니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 12: // 12	BAN	유저가 이미 밴 리스트에 존재 할 경우	이미 밴 목록에 추가된 유저입니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 13: // 13	BAN	밴 명령어 성공	성공적으로 밴 리스트에 추가하였습니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 14: // 14	UNBAN	유저가 밴 리스트에 존재 하지 않을 경우	밴 목록에 해당하는 유저가 없습니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 15: // 15	UNBAN	언밴 명령어 성공	밴 목록에서 제거하였습니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 16: // 16	BLOCK	유저가 이미 차단 리스트에 존재 할 경우	이미 차단 목록에 추가된 유저입니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 17: // 17	BLOCK	블락 명령어 성공	차단 목록에 추가하였습니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 18: // 18	UNBLOCK	유저가 차단 리스트에 존재 하지 않을 경우	차단 목록에 해당하는 유저가 없습니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 19: // 19	UNBLOCK	언블락 명령어 성공	차단 목록에서 제거하였습니다
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 20: // 20	MUTE	유저가 이미 뮤트 상태 인 경우	이미 채팅 금지된 유저입니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 21: // 21	MUTE	뮤트 명령어 성공	해당 유저를 1분간 채팅 금지합니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 22: // 22	PASS	PASS 명령어 성공	비밀번호가 성공적으로 변경되었습니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 23: // 23	INVITE, ACCEPT_GAME	유저가 게임 중 인 경우	해당 유저는 이미 게임중 입니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 24: // 24	INVITE, ACCEPT_GAME	유저가 오프라인 인 경우	해당 유저는 접속중이 아닙니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 25: // 25	INViTE	INVITE 명령어 성공	게임초대 메시지를 전송하였습니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 26: // 26	ACCEPT_GAME	ACCEPT_GAME 명령어 성공	요청을 수락 하였습니다.
          setContent(responseData.content);
          handleOpenAlertModal();
          setTimeout(() => {
            handleCloseAlertModal();
          }, 1000);
          break;
        case 27: // 27	REFUSE_GAME	REFUSE_GAME 명령어 성공	요청을 거절 하였습니다.
          setContent(responseData.content);
          handleOpenAlertModal();
          setTimeout(() => {
            handleCloseAlertModal();
          }, 1000);
          break;
        case 28: // 28	REFUSE_GAME	게임 초대를 거절 당했을 경우	유저님이 게임초대를 거절 하였습니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 29: // 29	REQUEST_FRIEND	이미 친구 요청한 유저 일 경우	이미 친구 요청한 유저입니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 30: // 30	REQUEST_FRIEND	이미 친구 관계일 경우	이미 친구 관계입니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 31: // 31	REQUEST_FRIEND	REQUEST_FRIEND 명령어 성공	유저님에게 친구 요청하였습니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 32: // 32	ACCEPT_FRIEND	친구 관계가 되었을 경우	유저님과 친구가 되었습니다.
          setContent(responseData.content);
          handleOpenAlertModal();
          setTimeout(() => {
            handleCloseAlertModal();
          }, 1000);
          break;
        case 33: // 33	REFUSE_FRIEND	REFUSE_FRIEND 명령어 성공	요청을 거절 하였습니다.
          setContent(responseData.content);
          handleOpenAlertModal();
          setTimeout(() => {
            handleCloseAlertModal();
          }, 1000);
          break;
        case 34: // 34	REFUSE_FRIEND	친구 요청잉 거절 당했을 경우	유저님이 친구요청을 거절 하였습니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 35: // 35	MSG	내가 뮤트 상태 일 경우	채팅 금지로 인하여 일정 시간동안 채팅이 금지됩니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 36: // 36	OP	OP 명령어 성공	유저님에게 OP 권한을 부여 하였습니다.
          setChatLog(onNoticeChatMSG(responseData.content));
          break;
        case 37: // 37	KICK	KICK당한 쪽	chat_title에서 강퇴 되었습니다.
          setContent(responseData.content);
          handleOpenAlertModal();
          setTimeout(() => {
            handleCloseAlertModal();
          }, 1000);
          break;
        case 38: // 38	UPDATE	update 성공	성공적으로 변경 되었습니다.
          setContent(responseData.content);
          handleOpenAlertModal();
          setTimeout(() => {
            handleCloseAlertModal();
          }, 1000);
          break;
        case 39: // 39	UPDATE, HOST	이름이 중복 될 경우	중복된 이름입니다.
          setContent(responseData.content);
          handleOpenAlertModal();
          setTimeout(() => {
            handleCloseAlertModal();
          }, 1000);
          break;
        case 200: // 200	DB로 접근하는 모든 프로토콜	예기치 못한 DB 오류	DB Error
          setContent(responseData.content);
          handleOpenAlertModal();
          setTimeout(() => {
            handleCloseAlertModal();
          }, 1000);
          break;
        case 201:
          axios.defaults.withCredentials = true;
          axios
            .post("http://" + import.meta.env.VITE_BACKEND + "/auth/logout")
            .then((response) => {
              setLogin(false);
              navigate("/");
            })
            .catch((error) => {
              if (error.response.data.message === "Unauthorized") {
                axios.get(
                  "http://" +
                    import.meta.env.VITE_BACKEND +
                    "/auth/refresh/login"
                );
              }
            });
          break;
        default: // 그 외
          break;
      }
      if (currentCR.chatId === 0) {
        logDay = "";
        currentCR.start = clientChatList[0].start;
        setChatTitle(clientChatList[0].title);
        setChatId(clientChatList[0].chatId);
        currentCR.backLogList = clientChatList[0].backLogList;
        currentCR.users = clientChatList[0].users;
        setChatAvatar(viewAvatar());
        setChatLog(onChatting(currentCR));
      }
    }

    // -------------------------------------------------------------------
    // -------------------------------------------------------------------
    // -------------------------------------------------------------------
    // -------------------------------------------------------------------
    // -------------------------------------------------------------------
    // -------------------------------------------------------------------
    // -------------------------------------------------------------------
    // -------------------------------------------------------------------
    // -------------------------------------------------------------------

    function onHost(responseData: any) {
      currentCR.chatId = responseData.channelId;
      setChatId(responseData.channelId);
      setChatTitle(responseData.title);
      currentCR.backLogList.splice(0, currentCR.backLogList.length);
      handleCloseRoomModal();
    }

    async function onDM(responseData: any) {
      currentCR.chatId = responseData.channelId;
      await setChatId(responseData.channelId);
      await setChatTitle(responseData.title);
      await setChatLog([]);
      currentCR.backLogList = [];
      currentCR.chatLogList = [];
    }

    function onDM_QUIT() {
      freshSocket(socket, "QUIT",
        { channelId: currentCR.chatId, userId: userId },
        () => { setLogin(false) });

      setMenuChecked(false);

      logDay = "";
      setChatTitle(clientChatList[0].title);
      setChatId(clientChatList[0].chatId);
      currentCR.start = clientChatList[0].start;
      currentCR.backLogList = clientChatList[0].backLogList;
      currentCR.users = clientChatList[0].users;
      setChatAvatar(viewAvatar());
      setChatLog(onChatting(currentCR));
      // socket.emit("JOIN", { channelId: -1, userId: userId, password: "" });
      freshSocket(socket, "JOIN",
        { channelId: -1, userId: userId, password: "" },
        () => { setLogin(false) });
    }

    function onRequestFriend(responseData: any) {
      // data.avatar를 사용하여 원하는 동작 수행
      setModalContent(
        <ModalAccept
          type={"REQUEST_FRIEND"}
          data={responseData}
          onClose={() => setModalOpen(false)}
          socket={socket}
        />
      );
      setModalOpen(true);
    }

    function onInvite(responseData: any) {
      // data.avatar를 사용하여 원하는 동작 수행
      setModalContent(
        <ModalAccept
          type={"INVITE"}
          data={responseData}
          onClose={() => setModalOpen(false)}
          socket={socket}
        />
      );
      setModalOpen(true);
    }

    function onJoinGame(responseData: any) {
      navigate("/Game", {
        state: {
          userId: userId,
          invite: {
            roomId: responseData.roomId,
            gameRequest: responseData.gameRequest,
          },
        },
      });
    }

    // notice
    socket.on("NOTICE", onNotice);

    socket.on("HOST", onHost);
    socket.on("DM", onDM);
    socket.on("DM_QUIT", onDM_QUIT);

    socket.on("LOADCHAT", onLoadChat);
    socket.on("INFO_CH_LIST", onInfoChList);
    socket.on("INFO_CH_MEMBER", onInfoChMem);
    socket.on("MSG", onMSG);

    // cmd protocol
    socket.on("KICK", onKick);
    socket.on("BAN", onBan);
    socket.on("BLOCK", onBlock);

    // // cmd invite game, friend
    socket.on("REQUEST_FRIEND", onRequestFriend);
    socket.on("INVITE", onInvite);

    // join game
    socket.on("JOIN_GAME", onJoinGame);

    return () => {
      socket.disconnect();
      // notice
      socket.off("NOTICE", onNotice);

      socket.off("HOST", onHost);
      socket.off("DM", onDM);

      socket.off("LOADCHAT", onLoadChat);
      socket.off("INFO_CH_LIST", onInfoChList);
      socket.off("INFO_CH_MEMBER", onInfoChMem);
      socket.off("MSG", onMSG);

      // cmd protocol
      socket.off("KICK", onKick);
      socket.off("BAN", onBan);
      socket.off("BLOCK", onBlock);

      // // cmd invite game, friend
      socket.off("REQUEST_FRIEND", onRequestFriend);
      socket.off("INVITE", onInvite);

      // join game
      socket.off("JOIN_GAME", onJoinGame);
    };
  }, []);

  function enter(chatId: number, userId: number, password: string) {
    // userId: userId
    if (chatId === 0) return;
    // socket.emit("JOIN", {
    //   channelId: chatId,
    //   userId: userId,
    //   password: password,
    // });
    freshSocket(socket, "JOIN",
    {
      channelId: chatId,
      userId: userId,
      password: password,
    },
    () => { setLogin(false) });
  }

  function enterRoom(pw: string) {
    enter(publicChatList[index].chatId, userId, pw);
  }

  useEffect(() => {
    const clickEvent = (e: any) => {
      if (e.target.id !== "main_nav" && e.target.id !== "menu") {
        setMenuChecked(false);
      }

      for (let i = 0; i < clientChatList.length; ++i) {
        if (e.target.id === clientChatList[i].title) {
          logDay = "";
          setChatTitle(clientChatList[i].title);
          setChatId(clientChatList[i].chatId);
          currentCR.start = clientChatList[i].start;
          currentCR.backLogList = clientChatList[i].backLogList;
          currentCR.users = clientChatList[i].users;
          if (e.target.id !== "Lobby") {
            enter(clientChatList[i].chatId, userId, "");
          } else {
            setChatAvatar(viewAvatar());
            setChatLog(onChatting(currentCR));
            // socket.emit("JOIN", {
            //   channelId: -1,
            //   userId: userId,
            //   password: "",
            // });
            freshSocket(socket, "JOIN",
              { channelId: -1, userId: userId, password: "" },
              () => { setLogin(false) });
          }
        }
      }

      for (let i = 0; i < publicChatList.length; ++i) {
        if (e.target.id === publicChatList[i].title) {
          if (publicChatList[i].private) {
            logDay = "";
            setIndex(i);
            index2 = i;
            setPWFlag(true);
            pwFlag2 = true;
            handleOpenPWModal();
          } else {
            logDay = "";
            currentCR.start = publicChatList[i].start;
            setChatTitle(publicChatList[i].title);
            setChatId(publicChatList[i].chatId);
            currentCR.backLogList = publicChatList[i].backLogList;
            currentCR.users = publicChatList[i].users;
            enter(publicChatList[i].chatId, userId, "");
          }
        }
      }

      for (let i = 0; i < dmChatList.length; ++i) {
        if (e.target.id === dmChatList[i].title) {
          logDay = "";
          currentCR.start = dmChatList[i].start;
          setChatTitle(dmChatList[i].title);
          setChatId(dmChatList[i].chatId);
          currentCR.backLogList = dmChatList[i].backLogList;
          currentCR.users = dmChatList[i].users;
          enter(dmChatList[i].chatId, userId, "");
        }
      }
    };

    document.addEventListener("click", clickEvent);

    return () => {
      document.removeEventListener("click", clickEvent);
    };
  }, []);

  function clickQuit() {
    // socket.emit("QUIT", { channelId: chatId, userId: userId });
    freshSocket(socket, "QUIT",
    { channelId: currentCR.chatId, userId: userId },
    () => { setLogin(false) } );

    setMenuChecked(false);

    logDay = "";
    setChatTitle(clientChatList[0].title);
    setChatId(clientChatList[0].chatId);
    currentCR.start = clientChatList[0].start;
    currentCR.backLogList = clientChatList[0].backLogList;
    currentCR.users = clientChatList[0].users;
    setChatAvatar(viewAvatar());
    setChatLog(onChatting(currentCR));
    // socket.emit("JOIN", { channelId: -1, userId: userId, password: "" });
    freshSocket(socket, "JOIN",
    { channelId: -1, userId: userId, password: "" },
    () => { setLogin(false) });
  }

  function checkInput(input: string) {
    if (input[0] === "/") {
      const cmdLine: string = chat.substring(1).toLowerCase();
      const cmdList: string[] = cmdLine.split(" ");

      switch (cmdList[0]) {
        case "kick":
          return 1;
        case "ban":
          return 1;
        case "unban":
          return 1;
        case "mute":
          return 1;
        case "op":
          return 1;
        case "block":
          return 1;
        case "unblock":
          return 1;
        case "pass":
          return 1;
        case "pass":
          return 1;
        case "request_friend":
          return 1;
        case "invite":
          return 1;
        default:
          return 0;
      }
    } else return 0;
  }

  const onChange = (e: any) => {
    setChat(e.target.value);

    // test();
  };

  const onAddButton = () => {
    if (chat === "") {
      return "";
    }

    let i = 0;
    if ((i = checkInput(chat)) !== 0) {
      const cmdLine: string = chat.substring(1).toLowerCase();
      const cmdList: string[] = cmdLine.split(" ");

      // console.log(currentCR.chatId);

      switch (cmdList[0]) {
        case "kick":
          // socket.emit("KICK", {
          //   channelId: currentCR.chatId,
          //   userId: userId,
          //   target: cmdList[1],
          // });
          freshSocket(socket, "KICK",
            {
              channelId: currentCR.chatId,
              userId: userId,
              target: cmdList[1],
            },
            () => { setLogin(false) });
          break;
        case "ban":
          if (cmdList.length === 2) {
            // socket.emit("BAN", {
            //   channelId: currentCR.chatId,
            //   userId: userId,
            //   target: cmdList[1],
            // });
            freshSocket(socket, "BAN",
            {
              channelId: currentCR.chatId,
              userId: userId,
              target: cmdList[1],
            },
            () => { setLogin(false) });
          } else {
            // socket.emit("BAN", {
            //   channelId: currentCR.chatId,
            //   userId: userId,
            //   target: "",
            // });
            freshSocket(socket, "BAN",
            {
              channelId: currentCR.chatId,
              userId: userId,
              target: "",
            },
            () => { setLogin(false) });
          }
          break;
        case "unban":
          // socket.emit("UNBAN", {
          //   channelId: currentCR.chatId,
          //   userId: userId,
          //   target: cmdList[1],
          // });
          freshSocket(socket, "UNBAN",
            {
              channelId: currentCR.chatId,
              userId: userId,
              target: cmdList[1],
            },
            () => { setLogin(false) });
          break;
        case "mute":
          // socket.emit("MUTE", {
          //   channelId: currentCR.chatId,
          //   userId: userId,
          //   target: cmdList[1],
          // });
          freshSocket(socket, "MUTE",
            {
              channelId: currentCR.chatId,
              userId: userId,
              target: cmdList[1],
            },
            () => { setLogin(false) });
          break;
        case "op":
          // socket.emit("OP", {
          //   channelId: currentCR.chatId,
          //   userId: userId,
          //   target: cmdList[1],
          // });
          freshSocket(socket, "OP",
            {
              channelId: currentCR.chatId,
              userId: userId,
              target: cmdList[1],
            },
            () => { setLogin(false) });
          break;
        case "block":
          if (cmdList.length === 2) {
            // socket.emit("BLOCK", {
            //   channelId: currentCR.chatId,
            //   userId: userId,
            //   target: cmdList[1],
            // });
            freshSocket(socket, "BLOCK",
            {
              channelId: currentCR.chatId,
              userId: userId,
              target: cmdList[1],
            },
            () => { setLogin(false) });
          } else {
            // socket.emit("BLOCK", {
            //   channelId: currentCR.chatId,
            //   userId: userId,
            //   target: "",
            // });
            freshSocket(socket, "BLOCK",
            {
              channelId: currentCR.chatId,
              userId: userId,
              target: "",
            },
            () => { setLogin(false) });
          }
          break;
        case "unblock":
          // socket.emit("UNBLOCK", {
          //   channelId: currentCR.chatId,
          //   userId: userId,
          //   target: cmdList[1],
          // });
          freshSocket(socket, "UNBLOCK",
            {
              channelId: currentCR.chatId,
              userId: userId,
              target: cmdList[1],
            },
            () => { setLogin(false) });
          break;
        case "pass":
          if (cmdList.length === 2) {
            // socket.emit("PASS", {
            //   channelId: currentCR.chatId,
            //   userId: userId,
            //   target: cmdList[1],
            // });
            freshSocket(socket, "PASS",
            {
              channelId: currentCR.chatId,
              userId: userId,
              target: cmdList[1],
            },
            () => { setLogin(false) });
          } else {
            // socket.emit("PASS", {
            //   channelId: currentCR.chatId,
            //   userId: userId,
            //   target: null,
            // });
            freshSocket(socket, "PASS",
            {
              channelId: currentCR.chatId,
              userId: userId,
              target: null,
            },
            () => { setLogin(false) });
          }
          break;
        case "request_friend":
          if (cmdList.length === 1) {
            break;
          }
          // socket.emit("REQUEST_FRIEND", { userId: userId, target: cmdList[1] });
          freshSocket(socket, "REQUEST_FRIEND",
            {
              channelId: currentCR.chatId,
              userId: userId,
              target: cmdList[1],
            },
            () => { setLogin(false) });
          break;
        case "invite":
          if (cmdList.length === 1) {
            break;
          }
          // socket.emit("INVITE", { userId: userId, target: cmdList[1] });
          freshSocket(socket, "INVITE",
            {
              channelId: currentCR.chatId,
              userId: userId,
              target: cmdList[1],
            },
            () => { setLogin(false) });
          break;
        default:
          break;
      }
    } else {
      socket.emit("MSG", {
        channelId: currentCR.chatId,
        userId: userId,
        content: chat,
      });
      // socket.emit("MSG", { channelId: currentCR.chatId, userId: 2, content: chat });
    }

    setChat("");
  };

  const activeEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.nativeEvent.isComposing === false) {
      onAddButton();
    }
  };

  const checkHandler = ({ target }: any) => {
    setMenuChecked(!menuChecked);
  };

  const viewRoomMenu = () => {
    const res: any = [];

    if (currentCR.chatId === 0) {
      res.push(
        <label
          className={`${styles.chattingroom_menu_button}`}
          htmlFor="menu111"
        >
          <img
            className={styles.chattingroom_menu_button_img}
            src="./src/assets/Chattingroommenu.svg"
          />
        </label>
      );
    } else {
      res.push(
        <label className={`${styles.chattingroom_menu_button}`} htmlFor="menu">
          <img
            className={styles.chattingroom_menu_button_img}
            src="./src/assets/Chattingroommenu.svg"
          />
        </label>
      );
    }

    return res;
  };

  const viewInput = () => {
    const res: any = [];

    if (currentCR.chatId === 0) {
      res.push(<div className={`${styles.lobby_input_container}`}></div>);
    } else {
      res.push(
        <div className={`${styles.input_container}`}>
          <div className="input-group">
            <input
              type="text"
              placeholder=""
              className={`${styles.input}`}
              value={chat}
              onChange={onChange}
              onKeyDown={activeEnter}
            />
            <img
              className={styles.send_container}
              src={msgimg}
              onClick={onAddButton}
            ></img>
          </div>
        </div>
      );
    }

    return res;
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (scrollRef.current?.scrollTop != null) {
      scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
    }
  });

  return (
    <div className={`${styles.background}`}>
      <Header pageFlag={2}/>
      <div className={styles.container}>
        <div className={styles.item}>
          <div className={styles.chatlist_title}>
            <div className={styles.chatlist_title_font}>Room List</div>
          </div>
          <div className={styles.chatlist}>
            <ul>{viewRoomList}</ul>
          </div>
          <div className={styles.room_add} onClick={handleOpenRoomModal}>
            +
          </div>
          <div className={styles.line}></div>
          <div className={styles.dmlist_title}>
            <div className={styles.dmlist_title_font}>DM List</div>
          </div>
          <div className={styles.dmlist}>
            <ul>{viewDMList}</ul>
          </div>
        </div>
        <div className={styles.item}>
          <div id="profile" className={styles.profiles}>
            {chatAvatar}
          </div>
          <div className={styles.chattingroom}>
            <div className={styles.chattingroom_title}>
              <div className={styles.chattingroom_title_font}>
                {currentCR.title}
              </div>
            </div>
            {viewRoomMenu()}
            <input
              id="menu"
              type="checkbox"
              checked={menuChecked}
              onChange={checkHandler}
            />
            <nav id="main_nav">
              <div className={`${styles.chattingroom_menu}`}>
                <ul>
                  <li>
                    <div
                      className={styles.chattingroom_menu_font2}
                      onClick={clickQuit}
                    >
                      채팅방 나가기
                    </div>
                  </li>
                </ul>
              </div>
            </nav>
            <div className={styles.line1}></div>
            <div className={styles.chatting} ref={scrollRef}>
              <ul>{chatLog}</ul>
            </div>
            <div className={styles.line2}></div>
            {viewInput()}
          </div>
        </div>
      </div>
      {openRoomAddModal && (
        <RoomAddModal
          onClose={handleCloseRoomModal}
          roomAdd={roomAdd}
          id={userId}
        />
      )}
      {openPWAddModal && (
        <EnterPW onClose={handleClosePWModal} onEnter={enterRoom} id={userId} />
      )}
      {openAlertAddModal && (
        <AlertModal onClose={handleCloseAlertModal} content={content} />
      )}
      {modalOpen && modalContent}
    </div>
  );
}

export default Chatting;
