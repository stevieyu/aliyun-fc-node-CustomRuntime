const SimplePeer = require('simple-peer')
const wrtc = require('wrtc')

module.exports = () => {
    const peers = new Map()
    const config = {
        'iceServers': [
            {
                'urls': [
                    'stun:stun.yy.com:3478',
                    'stun:stun.yy.com:4578',
                    'stun:stun.yy.com:4078',
                    'stun:stun.mob.yy.com:3478',
                    'stun:webcs.agora.io:3478',
                    'stun:stun.hitv.com:3478',
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
    };
    const channelConfig = {
        maxRetransmits: 3
    }

    const events = new Map()

    const eventNames = [
        'signal',
        'connect',
        'data',
        'stream',
        'track',
        'close',
        'error'
    ]

    return {
        add(id, initiator = false){
            if(peers.has(id)) this.remove(id);

            const peer = new SimplePeer({
                trickle: false,
                wrtc,
                initiator,
                config,
                channelConfig
            })

            for (let eventName of eventNames) {
                if(!events.has(eventName)) continue
                peer.on(eventName, (...args) => {
                    events.get(eventName)(...args, peer, id, this)
                })
            }

            peers.set(id, peer)
            return peer;
        },
        remove(id){
            if(peers.has(id)) {
                peers.get(id).destroy();
                peers.delete(id)
            }

            return this;
        },
        get(id){
            if(!peers.has(id)) throw '不存在ID';
            return peers.get(id)
        },
        on(eventName, cb){
            if(events.has('eventName')) throw '重复添加事件';
            events.set(eventName, cb)
            return this;
        },
    }
}