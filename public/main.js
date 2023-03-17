
const socket=io()

const clientsTotal=document.getElementById('clients-total');

const messageContainer=document.getElementById('message-container');
const nameInput=document.getElementById('name-input');
const messageForm=document.getElementById('message-form');
const messageInput=document.getElementById('message-input');
const messageTone=new Audio('Message-sent.mp3');

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    sendMessage()
})

socket.on('clients-total',(data)=>{
    clientsTotal.innerHTML=`Total Clients: ${data}`
})

function sendMessage(){
    console.log(messageInput.value)
    const data={
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }
    socket.emit('message',data)
    addMessageToUI(true,data)
    messageInput.value=''
}

socket.on('chat-message',(data)=>{
    console.log(data);
    addMessageToUI(false,data)
})

function addMessageToUI(isOwnMessage,data){
    clearMessage();
    messageTone.play();
    const element=` <li class="${isOwnMessage ? 'message-right':'message-left'}">
                        <p class="message">
                            ${data.message}
                            <span> ${data.name}🔘🗨️${moment(data.dateTime).fromNow()}</span>
                        </p>
                    </li>`

    messageContainer.innerHTML+=element
    scrollToBottom();
}
function scrollToBottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}
messageInput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing...`,
    })
})
messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing...`,
    })
})
messageInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback:``,
    })
})

socket.on('feedback',(data)=>{
       const element= ` <li class="message-feedback">
                            <p class="feedback" id="feedback">
                                ${data.feedback} 
                            </p>
                        </li>`
        clearMessage();
       messageContainer.innerHTML+=element
})

function clearMessage(){
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}