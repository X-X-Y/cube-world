import io from 'socket.io-client'
import store from '@/store'
import { Notification } from 'element-ui'

const socket = io()

socket.on('connect', () => {
  console.log('>>>>>>> 和服务器已建立连接！')
})

// 有用户提交添加操作了，监听user_add_operate事件，获取操作记录
socket.on('user_add_operate', mes => {
  store.commit('addOpts', mes)
})

// 有用户提交删除操作了，监听user_del_operate事件，获取操作记录
socket.on('user_del_operate', mes => {
  store.commit('delOpts', mes)
})

// 管理员提交清空
socket.on('user_clear_all', mes => {
  store.commit('updateOpts', [])
  Notification({ message: "管理员清空了操作记录和方块", duration: 2000 })
})

// 进入房间, 监听room_info事件, 获取房间信息
socket.on('room_info', ({ nicknames, opts }) => {
  store.commit('updateNicknames', nicknames)
  store.commit('updateOpts', opts)
})

// 监听user_enter, 通知：有新人进房间了
socket.on('user_enter', (nickname) => {
  store.commit('addToNicknames', nickname)
  if (nickname) {
    Notification({ message: `${nickname} 进入了房间...`, duration: 1000 })
  }
})

// 监听user_leave, 通知：有人离开房间了
socket.on('user_leave', (nickname) => {
  store.commit('delFromNicknames', nickname)
  if (nickname) {
    Notification({ message: `${nickname} 离开了房间...`, duration: 1000 })
  }
})

export default socket
