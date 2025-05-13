const socket = new WebSocket("ws://localhost:8080");
const msgInput = document.getElementById("msgInput") as HTMLInputElement;
const sendBtn = document.getElementById("sendBtn") as HTMLButtonElement;
const chatBox = document.getElementById("chatBox") as HTMLDivElement;

let dataChannel: RTCDataChannel;
let pc: RTCPeerConnection;

socket.onopen = () => {
    setupPeer();
};

socket.onmessage = async (msg) => {
    const data = JSON.parse(msg.data);

    if (data.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.send(JSON.stringify({ type: "answer", answer }));
    }

    if (data.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    }
};

function setupPeer() {
    pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    dataChannel = pc.createDataChannel("chat");
    dataChannel.onopen = () => console.log("DataChannel open");
    dataChannel.onmessage = (e) => {
        const msg = document.createElement("p");
        msg.textContent = `Peer: ${e.data}`;
        chatBox.appendChild(msg);
    };

    pc.onicecandidate= (event) => {
        if (event.candidate) {
            socket.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
        }
    };

    pc.ondatachannel = (e) => {
        dataChannel = e.channel;
        dataChannel.onmessage = (event) => {
            const msg = document.createElement("p");
            msg.textContent = `Peer: ${event.data}`;
            chatBox.appendChild(msg);
        };
    };

    makeOffer();
}

async function makeOffer() {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.send(JSON.stringify({ type: "offer", offer }));
}

sendBtn.onclick = () =>{
    const msg = msgInput.value;
    dataChannel.send(msg);

    const localMsg = document.createElement("p");
    localMsg.textContent = `You: ${msg}`;
    chatBox.appendChild(localMsg);

    msgInput.value = "";
};