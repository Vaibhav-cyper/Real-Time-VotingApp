import { createContext, useContext, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { VoteResult} from "@/types/api"
import Cookies from "js-cookie";


// Define your socket type

interface SocketContextType {
  socket: Socket | null;
  votes: { A: number; B: number; C: number };
  total: number;
  percentages : { A: number; B: number; C: number };
  castVote: (option: "A" | "B" | "C") => void;
  connect: () => void; // 
  disconnect: () => void; // 
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);



export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [votes, setVotes] = useState({ A: 0, B: 0, C: 0 });
  const [percentages, setPercentages] = useState({ A: 0, B: 0, C: 0 });
  const [total, setTotal] = useState(0);

  function calculatePercentages(votes:{ A: number; B: number; C: number }) {
    if (total === 0) {
      return { A: 0, B: 0, C: 0 };
    }
  
    return {
      A: Math.round((votes.A / total) * 100),
      B: Math.round((votes.B / total) * 100),
      C: Math.round((votes.C / total) * 100),
    };
  }


 const connect = () => {
    if (socket) return; // already connected
    const username = Cookies.get("username");
    if (!username) return; // only connect if session exists

    const newSocket = io("https://voticast-websocket.onrender.com");

    setSocket(newSocket);

    newSocket.on("vote-update", (data: VoteResult) => {
      setVotes(data.votes);
      setTotal(data.total);
      setPercentages(calculatePercentages(data.votes));
    });

    newSocket.on("disconnect", () => {
      setSocket(null);
    });
  };

  const disconnect = () => {
    socket?.disconnect();
    setSocket(null);
  };

  const castVote = (option: "A" | "B" | "C") => {
    socket?.emit("vote", option);
  };

  return (
    <SocketContext.Provider value={{ socket, votes, total, percentages,castVote ,connect ,disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook for easy use
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
