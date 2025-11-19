<template>
    <div>
      <div class="monitorhead">
        <h1 class="monitorheadh">{{ examName }}</h1>
      </div>
      <div class="video-list">
        <div v-for="(item, index) in videoList" :key="item.id" class="video-item">
          <div v-show="displayTeacher(membersRes[index])">
            <h1>{{ membersRes[index].name }}</h1>
            <video controls autoplay playsinline ref="videos" :height="cameraHeight" :muted="item.muted" :id="item.id"></video>
          </div>
        </div>
      </div>
    </div>
  </template>
<script setup>
import { ref ,onMounted} from 'vue';
import { defineProps } from 'vue';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';

const router = useRouter();

// 响应式数据
const examName = ref('');
const videoList = ref([]);
const membersRes = ref([]);
const cameraHeight = ref(/* 相机高度初始值 */);
const signalClient = ref(null);
const canvas = ref(null);
const socket = ref(null);
const type = ref("student");
const id = ref("studentId");

examName.value = router.currentRoute.value.query.examName;


const props = defineProps({
  teacherName: {
    type: String,
    default: () => String(Math.random(10)) // 在mounted里通过html href获取
  },
  roomId: {
    type: String,
    default: ''
  },
  socketURL: {
    type: String,
    default: 'https://localhost:3000'
  },
  cameraHeight: {
    type: [Number, String],
    default: 150
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  screenshotFormat: {
    type: String,
    default: 'image/jpeg'
  },
  enableAudio: {
    type: Boolean,
    default: true
  },
  enableVideo: {
    type: Boolean,
    default: true
  },
  enableLogs: {
    type: Boolean,
    default: true
  },
  peerOptions: {
    type: Object,
    default: () => ({})
  },
  ioOptions: {
    type: Object,
    default: () => ({ rejectUnauthorized: false, transports: ['polling', 'websocket'] })
  },
  deviceId: {
    type: String,
    default: null
  }
});
onMounted(() => {
  membersRes.value.push({ name: Cookies.get("teacherName"), id: props.id });
  join();
});

const displayTeacher = (teachername) => {
  log("Displayteacher");
  log(teachername);
  console.log("teachername", teachername.name, Cookies.get("teacherName"));
  return teachername.name !== Cookies.get("teacherName");
};

const leave = () => {
  videoList.value.forEach(v => v.stream.getTracks().forEach(t => t.stop()));
  videoList.value = [];
  signalClient.value.peers().forEach(peer => peer.removeAllListeners());
  signalClient.value.destroy();
  signalClient.value = null;
  socket.value.destroy();
  socket.value = null;
};

const log = (message, data) => {
  if (props.enableLogs.value) {
    console.log(message);
    if (data != null) {
      console.log(data);
    }
  }
};
const join = async () => {
  log('join');
  socket.value = io(socketURL.value, ioOptions.value);
  signalClient.value = new SimpleSignalClient(socket.value);
  let constraints = { video: enableVideo.value, audio: false };

  if (type.value === "teacher") {
    constraints = { video: false, audio: true };
  }
  if (deviceId.value && constraints.video) {
    constraints.video = { deviceId: { exact: deviceId.value } };
  }
  const localStream = await navigator.mediaDevices.getUserMedia(constraints);
  log('opened', localStream);
  joinedRoom(localStream, true); // 确保 joinedRoom 已经定义

  signalClient.value.once('discover', async (discoveryData) => {
    log('discovered', discoveryData);
    for (let peerID of discoveryData.peers) {
      if (peerID === socket.value.id) continue;
      try {
        const { peer } = await signalClient.value.connect(peerID, router.currentRoute.value.query.roomId, peerOptions.value);
        videoList.value.forEach(v => {
          if (v.isLocal) {
            onPeer(peer, v.stream); // 确保 onPeer 已经定义
          }
        });
      } catch (e) {
        log('Error connecting to peer');
      }
    }
  });

  signalClient.value.on('request', async (request) => {
    log('requested', request);
    const { peer } = await request.accept({}, peerOptions.value);
    log('accepted', peer);
    videoList.value.forEach(v => {
      if (v.isLocal) {
        onPeer(peer, v.stream); // 确保 onPeer 已经定义
      }
    });
  });

  let memberRoom = {
    roomId: String(router.currentRoute.value.query.roomId),
    member: { id: id.value, name: cookies.get("teacherName") }
  };
  signalClient.value.discover(memberRoom);
};
const joinedRoom = (stream, isLocal) => {
  let found = videoList.value.find(video => video.id === stream.id);
  if (found === undefined) {
    let video = {
      id: stream.id,
      muted: isLocal,
      stream: stream,
      isLocal: isLocal
    };
    videoList.value.push(video);
  }

  setTimeout(() => {
    const videos = document.querySelectorAll('.video-item video'); 
    for (let video of videos) {
      if (video.id === stream.id) {
        video.srcObject = stream;
        break;
      }
    }
  }, 500);

  emit('joined-room', stream.id); // 使用 emit 方法
};
const onPeer = (peer, localStream) => {
  log('onPeer');
  log(localStream);
  peer.addStream(localStream);

  peer.on('stream', (remoteStream) => {
    joinedRoom(remoteStream, false);

    axios.get('https://locahost:3000/roomMembers', { // URL 需要根据实际情况调整
      params: {
        roomId: router.currentRoute.value.query.roomId
      }
    }).then(res => {
      if (res.data != null) {
        membersRes.value = res.data;
      }
    }).catch(err => {
      console.log(err);
    });

    peer.on('close', () => {
      videoList.value = videoList.value.filter(item => item.id !== remoteStream.id);
      emit('left-room', remoteStream.id);
    });

    peer.on('error', (err) => {
      log('peer error ', err);
    });
  });
};
</script>
  




<style scoped>
.video-list {
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
}

/* 
.video-list div {
    padding: 10px;
} */

.video-item {
    margin: 40px;
    background: #fafafa;
    border-radius: 15px;
    display: inline-block;
    box-shadow: 3px 3px 3px rgb(205, 205, 205);
}
.monitorhead{
    width: 100%;

    text-align: center;
    box-shadow: 0px 3px 0px rgb(205, 205, 205);
}
.monitorheadh{
    margin-bottom: 10px;
    text-align: center;
}
</style>
