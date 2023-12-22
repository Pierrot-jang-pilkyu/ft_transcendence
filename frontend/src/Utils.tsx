import axios from "axios"
import { Socket } from "socket.io-client"


export function freshAxios(axObj:object, resFunc:any, errFunc:any) {
    axios(axObj)
    .then((res)=>{
        resFunc(res)
    })
    .catch((error)=>{
        if (error.response.data.message === "Unauthorized") {
            axios.get("http://" + import.meta.env.VITE_BACKEND + "/auth/refresh/login")
            .then(()=>{
                axios(axObj).then((res)=>{resFunc(res)})
            })
            .catch(()=>{errFunc()})
        }
    })
}

export function freshSocket(socket:Socket, protocol:string, data:object, errFunc:any)
{
    axios.get("http://" + import.meta.env.VITE_BACKEND + "/auth/check/socket")
    .then(()=>{socket.emit(protocol, data)})
    .catch(()=>{ errFunc();})
}