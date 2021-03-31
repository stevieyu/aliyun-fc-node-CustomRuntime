// import './peer'


const api = ky.create({
	prefixUrl: 'http://36816573-1928687499779704.test.functioncompute.com',
	// prefixUrl: 'http://127.0.0.1:8000',
	timeout: 20000
});

const p = new SimplePeer({
	trickle: false,
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
	} 
})

let peerId

p.on('error', err => console.error('error', err))

p.on('signal', data => {
	console.log('SIGNAL', JSON.stringify(data))
	api.post('signal', {json: {signal: data, id: peerId}})
		.catch(err => console.log(err));
})

p.on('connect', () => {
	console.log('CONNECT')
	p.send('whatever' + Math.random())
})

p.on('data', data => {
	console.log('data: ' + data)
})

api.get('signal').json()
	.then(res => {
		const {id, signal} = res
		peerId = id;
		p.signal(signal)
	})
	.catch(err => console.dir(err));

