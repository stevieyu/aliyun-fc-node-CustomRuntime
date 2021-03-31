let peerId = null
const connId = new URLSearchParams(location.search.replace('?', '')).get('id')

const peer = new Peer(peerId, {
    host: 'peerjs.d.flyyweb.com',
    path: '/myapp',
    secure: true,
    config: {
		iceServers: [
			{
                'urls': [
                    'stun:stun.yy.com:3478',
                    'stun:stun.yy.com:4578', 
                    'stun:stun.yy.com:4078', 
                    'stun:stun.mob.yy.com:3478',
                    'stun:webcs.agora.io:3478',
                    'stun:dapp.umnet.cn:3478',
                    'stun:open.umnet.cn:3478',
                    'stun:stun.l.google.com:19302',
                    'stun:stun.stunprotocol.org:3478',
                    'stun:stun.iptel.org:3478'
                ]
            }, {
                'urls': [
                    'turn:dapp.umnet.cn:3478?transport=udp',
                    'turn:dapp.umnet.cn:3478?transport=tcp',
                    'turn:open.umnet.cn:3478?transport=udp',
                    'turn:open.umnet.cn:3478?transport=tcp',
                ],
                'username': '1554543468:ninefingers',
                'credential': 'J67AC6Wbh9M6x3VR615mTcqMVu0='
            }, {
                'urls': 'turn:numb.viagenie.ca:3478',
                'credential': 'muazkh',
                'username': 'webrtc@live.com'
            },
		]
    },
});

peer.on('open', (id) => {
    console.log('open', id)
    if(peerId !== id && !connId){
        history.replaceState(null, null, `?id=${id}`)
        // sessionStorage.setItem('id', id)
    }
});

peer.on('connection', (conn) => {
    conn.on('data', (data) => {
        // Will print 'hi!'
        console.log('connection data', data);
    });
    conn.on('open', () => {
        conn.send('hello!');
    });
});

console.log('connId', connId)
if(connId){
    const conn = peer.connect(connId);
    conn.on('open', () => {
        console.log('conn open');
        // Receive messages
        conn.on('data', (data) => {
          console.log('Received', data);
        });
      
        // Send messages
        conn.send('Hello!');
      });
}