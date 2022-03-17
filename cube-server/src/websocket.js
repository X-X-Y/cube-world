const io = require('socket.io')

module.exports = httpServer => {

    const server = io(httpServer)
    const user2socket = {} // { 昵称：id}
    const socket2user = {} // { id：昵称}
    let opts = []

    let currentGame = null

    server.on('connection', socket => {

        // 【事件】检查昵称是否已占用
        // ------------------------------------------------------------
        socket.on('check_user_exist', (nickname, callback) => {
            callback(!!user2socket[nickname])
        })

        // 【事件】用户进入游戏
        // ------------------------------------------------------------
        socket.on('enter', (nickname) => {
            const sid = socket.id

            // 添加用户信息
            user2socket[nickname] = sid
            socket2user[sid] = nickname

            // 发送用户列表给当前用户
            socket.emit('room_info', {
                nicknames: Object.keys(user2socket),
                opts: opts,
                cubes: currentGame?.cubes || []
            })

            // 发送新进用户给其他用户
            socket.broadcast.emit('user_enter', nickname)
        })

        // 【事件】用户提交添加操作
        // ------------------------------------------------------------
        socket.on('add_operate', opt => {
            let message = {}
            message.name = socket2user[socket.id]
            message.pos = opt
            message.mode = 'ADD'
            opts.push(message)
            socket.emit('user_add_operate', message)
            socket.broadcast.emit('user_add_operate', message)
        })
      
       // 【事件】用户提交删除操作
       socket.on('del_operate', opt => {
            let message = {}
            message.name = socket2user[socket.id]
            message.pos = opt
            message.mode = 'DEL'
            opts.push(message)
            socket.emit('user_del_operate', message)
            socket.broadcast.emit('user_del_operate', message)
        })

        // 【事件】用户清空历史操作即所有方块
        // ------------------------------------------------------------
        socket.on('clear_all', opt => {
            opts = []
            socket.emit('user_clear_all')
            socket.broadcast.emit('user_clear_all')
        })

        // 【事件】用户离开游戏
        // ------------------------------------------------------------
        socket.on('leave', () => {
            const sid = socket.id
            const nickname = socket2user[sid]

            // 移除用户信息
            delete user2socket[nickname]
            delete socket2user[sid]

            // 发送离开用户给其他用户
            socket.broadcast.emit('user_leave', nickname)
        })

        // 【事件】客户端断开连接
        // ------------------------------------------------------------
        socket.on('disconnect', () => {
            const sid = socket.id
            const nickname = socket2user[sid]

            delete user2socket[nickname]
            delete socket2user[sid]

            // 发送离开的用户信息给其他用户
            socket.broadcast.emit('user_leave', nickname)
        })

        // ------------------------------------------------------------
    })

}