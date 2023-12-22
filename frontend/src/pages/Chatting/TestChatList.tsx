import { useEffect, useState } from "react";

function TestChatList(socket: any) {
    const [data, setData] = useState<any>();

    useEffect(() => {
        socket.on("INFO_CH_LIST", function (responseData:any) { 
            console.log(responseData);
            setData(responseData);
        });
    }, [])

    return data;
}

export default TestChatList;
