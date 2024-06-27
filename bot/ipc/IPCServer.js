import ipc from 'node-ipc';


function IPCServer(bot) {
    ipc.config.id = 'server';
    ipc.config.retry= 15000;
    ipc.config.silent= true;
    ipc.serve(
        function() {
            ipc.server.on(
                'message',
                async function(data, socket) {
                    console.log('Received message from client: ', data);


                    if(data == 'hello'){    
                        //转发
                     
                        ipc.server.emit(
                            socket,
                            'error',
                            'error,data format error'
                        );
                        //发送关闭连接
                        
                    }else{
                        //data = JSON.parse(data);//ipc传送过来直接就变成javascript类型了
                        //查看data的类型
                        console.log('Received data from client -data type =  '+typeof(data));

                        console.log(data);
                        let sendcontent =""
                        if(1 ==data.message.type ){
                            //文本消息
                            if(data.message.content){
                                //文本消息
                                console.log(data.message.content);
                                //发送消息
                                sendcontent = data.message.content
                            }
                        }
                        
                            

                            


                        try{
                            if(data.name){
                                //用户昵称
                                const contactName = data.name;
                                const targetContact = await bot.Contact.find({ name: contactName });
                                if (targetContact) {
                                    const message = await targetContact.say(sendcontent);
                                    console.log('Contact Message sent:', message);
                                } else {
                                    console.log('Contact not found:', contactName);
                                    ipc.server.emit(
                                        socket,
                                        'error',
                                        'error,Contact not found'
                                    );
                                    return;
                                }
                            }
                            if(data.alias){
                                //用户别名
                                const alias = data.alias;
                                const targetContact1 = await bot.Contact.find({ alias: alias });
                                if (targetContact1) {
                                    const message = await targetContact1.say(sendcontent);
                                    console.log('Contact alias Message sent:', message);
                                } else {
                                    console.log('Contact alias not found:', alias);
                                    ipc.server.emit(
                                        socket,
                                        'error',
                                        'error,Contact alias not found'
                                    );
                                    return;
                                }
                            }
                            if(data.roomName){
                                //群聊名称
                                const roomName = data.roomName;
                                const room = await bot.Room.find({ topic: roomName });
                                if (room) {
                                    const message = await room.say(sendcontent);
                                    console.log('Room sent:', message);
                                } else {
                                    console.log('Room not found:', roomName);
                                    ipc.server.emit(
                                        socket,
                                        'error',
                                        'error,Room not found'
                                    );
                                    return;
                                }
                            }
    
                        }catch(e){
                            console.log(e);
                            ipc.server.emit(
                                socket,
                                'error',
                                'error'
                            );
                            return;
                        }
                        ipc.server.emit(
                            socket,
                            'success',
                            'ok'
                        );
                        
                    }
                }
            );
            ipc.server.on("socket.disconnected", function (socket, destroyedSocketID) {
                console.log("destroyedSocketID",destroyedSocketID);
                ipc.log("client " + destroyedSocketID + " has disconnected!");
            });
            
        }
    );
    ipc.server.start();

}

export default IPCServer;