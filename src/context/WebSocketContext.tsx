import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ConexionStatus = "connecting" | "connected" | "disconnected" | "error";

export interface SocketMessage {
  type: SendType;
  payload: unknown;
}
export interface SocketResponse {
  type: ResponseType;
  payload: unknown;
}

type SendType =
  | "GET_PARTIES"
  | "ADD_PARTY"
  | "UPDATE_PARTY"
  | "DELETE_PARTY"
  | "INCREMENT_VOTES"
  | "DECREMENT_VOTES";

type ResponseType =
  | "PARTIES_LIST"
  | "PARTY_ADDED"
  | "PARTY_UPDATE"
  | "PARTY_DELETE"
  | "VOTES_UPDATED"
  | "ERROR";

interface WebSocketContextState {
  status: ConexionStatus;
  send: (message: SocketMessage) => void;
  lastMessage: SocketResponse | null
}

export const WebSocketContext = createContext({} as WebSocketContextState)

interface Props {
  children: ReactNode;
  url: string;
}

export const WebSocketProvider = ({ children, url }: Props) => {
  const [status, setStatus] = useState<ConexionStatus>("connecting");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<SocketResponse | null>(null);

  const connect = useCallback(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("socket abierto!");
      setStatus("connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLastMessage(data);
      console.log(data); // ← agregá esto
    };

    socket.onerror = () => setStatus("error");
    socket.onclose = () => setStatus("disconnected");

    return socket;
  }, [url]);

  useEffect(() => {
    const socket = connect();
    setSocket(socket);
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [connect]);

  //funcion basica de re-coneccion
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (status === "disconnected") {
      interval = setInterval(() => {
        console.log("reconecting evrery one second");
        connect();
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, connect]);

  const send = (message: SocketMessage) => {
    if (!socket) throw new Error("Socket not connected");
    if (status !== "connected") throw new Error("Socket not connected");

    const jsonMessage = JSON.stringify(message);
    socket.send(jsonMessage);
  };

  return (
    <WebSocketContext
      value={{
        status: status,
        send: send,
        lastMessage: lastMessage
      }}
    >
      {children}
    </WebSocketContext>
  );
};
