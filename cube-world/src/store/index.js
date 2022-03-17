import { resolve } from 'path'
import Vue from 'vue'
import Vuex from 'vuex'
import socket from '../socket'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nickname: '', // 当前用户昵称
    nicknames: [], // 房间用户列表
    opts:[], // 操作记录
    color: 0, // 方块颜色
    clearflag: 0 // 管理员清空标志位
  },
  mutations: {
    // 更新自己昵称
    updateNickname(state, nickname) {
      state.nickname = nickname || ''
    },
    // 更新用户列表
    updateNicknames(state, nicknames) {
      state.nicknames = nicknames || []
    },
    // 添加操作
    addOpts(state, mes) {
      state.opts = [...state.opts, mes]
      state.delCube = mes.pos
      localStorage.setItem('opts', state.opts)
    },
    // 删除操作
    delOpts(state, mes) {
      state.opts = [...state.opts,mes]
      localStorage.setItem('opts', state.opts)
    },
    // 更新方块信息
    updateOpts(state, opts) {
      state.opts = opts || []
      if(!opts.length) state.clearflag = !state.clearflag
    },
    // 添加用户
    addToNicknames(state, nickname) {
      if (!state.nicknames.includes(nickname)) {
        state.nicknames.push(nickname)
      }
    },
    // 删除离开用户
    delFromNicknames(state, nickname) {
      state.nicknames = state.nicknames.filter(item => item !== nickname)
    },
    // 更新方块颜色
    updateColor(state,color){
      state.color = color
    }
  },
  actions: {
    // 确认用户名是否存在
    checkUserExist(context, nickname) {
      return new Promise((resolve, reject) => {
        socket.emit('check_user_exist', nickname, isExist => {
          resolve(isExist)
        })
      })
    },
    // 进入房间
    sendUserEnter(context) {
      const nickname = localStorage.getItem('nickname')
      socket.emit('enter', nickname)
      context.commit('updateNickname', nickname)
    },
    // 离开房间
    sendUserLeave(context) {
      socket.emit('leave')
      context.commit('updateNickname', '')
      localStorage.removeItem('nickname')
      context.commit('updateOpts', [])
    },
    // 向服务器提交 添加 操作
    AddOperate(context, opt){
      socket.emit('add_operate', opt)
    },
     // 向服务器提交 删除 操作
    DelOperate(context, opt){
      socket.emit('del_operate', opt)
    },
    // 向服务器提交清空操作
    clearAll(context){
      socket.emit('clear_all')
    }
  },
  modules: {
  }
})
