<template>
  <div class="home">
    <div id="canvas">
      <div id="blocker">
        <div id="instructions">
          <h1>
            点击继续
          </h1>
          <p>
            移动: WASD<br />
            跳跃: SPACE<br />
            退出: ESC<br />
            全屏: F<br/>
            切换模式: M<br/>
            普通模式: 跳跃<br/>
            飞行模式: 上下移动↑↓
          </p>
        </div>
      </div>
      <svg id="cross" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        <path d="M512 512V170.666667h42.666667v341.333333h341.333333v42.666667h-341.333333v341.333333h-42.666667v-341.333333H170.666667v-42.666667h341.333333z" fill="#e6e6e6"></path>
      </svg>
      <div id="item-bar">
        <div class="item selected">
          <img src="../../assets/image/blocks/grass_block.png" alt="grass">
        </div>
        <div class="item">
          <img src="../../assets/image/blocks/dirt_block.png" alt="dirt">
        </div>
        <div class="item">
          <img src="../../assets/image/blocks/sand_block.png" alt="sand">
        </div>
        <div class="item">
          <img src="../../assets/image/blocks/tree_block.png" alt="tree">
        </div>
        <div class="item">
          <img src="../../assets/image/blocks/leaf_block.png" alt="leaf">
        </div>
        <div class="item">
          <img src="../../assets/image/blocks/stone_block.png" alt="stone">
        </div>
        <div class="item">
          <img src="../../assets/image/blocks/glass_block.png" alt="glass">
        </div>
        <div class="item">
          <img src="../../assets/image/blocks/brick_block.png" alt="brick">
        </div>
        <div class="item">
          <img src="../../assets/image/blocks/wood_block.png" alt="wood">
        </div>
        <div class="item">
          <img src="../../assets/image/blocks/tnt_block.png" alt="tnt">
        </div>
      </div>
    </div>
    <div id="right-part">
      <div class="btn-area">
        <el-button class="btn" id="command-run" type="success" round @click="applyOpt">应用指令</el-button>
        <el-tooltip class="btn" effect="dark" placement="bottom">
          <div id="tips" slot="content">
            1、增加方块  ADD(1,1,1)at(1,1,1)<br/>2、删除方块  DEL(1,1,1)<br/>3、设置相机位置  CAM(2,2,2)<br/>4、设置相机方向  LOOK(2,0,2)<br/>5、鼠标左键增加方块、右键删除方块<br/>6、鼠标滚轮切换方块材质<br/>7、按键M切换正常模式/飞行模式<br/>8、管理员可一键清空
          </div>
          <el-button round type="primary">操作指南</el-button>
        </el-tooltip>
        <el-button v-if="nickname=='管理员'" class="btn" type="danger" round @click="clearAll">清空所有</el-button>
        <el-button class="btn" type="warning" round @click="exitHandler">退出游戏</el-button>
      </div>
      <div id="record-part">
        <ul class="opt-record" ref="record">
          <li class="record-item" v-for="(item, index) in opts" :key="index">
            <span>
              {{item.name === nickname ? "我" : item.name }}
              在坐标
              <span v-if="item.mode==='ADD'">{{item.pos[0]}}
                增加了一个长宽高为 {{item.pos[1]}} 的方块</span>
              <span v-if="item.mode==='DEL'">{{item.pos}} 删除了一个方块</span>
            </span>
          </li>
        </ul>
        <ul class="user-record">
          <li class="record-item" v-for="(item, index) in nicknames" :key="index">
            <span>{{ item }} {{ item === nickname ? "（我）" : "" }}</span>
          </li>
        </ul>
      </div>
      <div id="command-part">
        <textarea id="command-input" v-model="textValue"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      textValue: 'ADD(1,1,1)at(1,1,0)', // 命令框文本
      setCube: null, // 添加方块的方法
      deleteCube: null, // 删除方块的方法
      camera: null // 相机
    }
  },
  created() {
    this.$store.dispatch('sendUserEnter')
  },
  // 初始化三维场景
  mounted() {
    const m = require('@/js/canvas.js')
    m.init()
    m.animate()
    this.setCube = m.setCube
    this.deleteCube = m.deleteCube
    this.camera = m.camera
    this.current = m.current
    this.clearScene = m.clearScene
  },
  updated() {
    this.$refs.record.scrollTop = this.$refs.record.scrollHeight
  },
  computed: {
    ...mapState(['nicknames', 'nickname', 'opts', 'color', 'clearflag'])
  },
  watch: {
    opts(newVal, oldVal) {
      if(oldVal.length === 0){
        this.opts.forEach(cube => {
          this.renderOpt(cube)
        });
        return
      }
      let cube = this.opts[this.opts.length - 1]
      this.renderOpt(cube)
    },
    clearflag(){
      this.clearScene()
    }
  },
  methods: {
    // 退出游戏
    exitHandler() {
      this.$confirm('是否退出游戏', '温馨提示')
        .then(() => {
          this.$store.dispatch('sendUserLeave')
          this.$router.replace('/login')
          this.$router.go(0)
        })
        .catch(e => {
          console.log(e)
        })
    },
    // 渲染单个操作
    renderOpt(cube){
      if(!cube) return
      if (cube.mode === 'ADD') {
        this.setCube(cube.pos[0], cube.pos[1], cube.pos[2])
      } else {
        this.deleteCube(cube.pos)
      }
    },
    // 应用指令
    applyOpt() {
      let str = this.textValue
      if (str.length === 0) {
        this.$message('命令行不能为空或者为空格!')
      }

      //以换行符为标志划分命令框输入数据
      const command = str.split('\n')
      for (const [index, line] of command.entries()) {
        //检测添加方块代码是否符合语法
        if (/^ADD\([1-9]\d*,[1-9]\d*,[1-9]\d*\)at\(([-+])?\d+,\d+,([-+])?\d+\)$/.test(line)) {
          let addNum = line.match(/([-+])?\d+/g).map(item => ~~item)
          let size = addNum.splice(0, 3)
          let pos = [addNum, size, this.color]
          this.$store.dispatch('AddOperate', pos)
        } else if (/^DEL\(([-+])?\d+,\d+,([-+])?\d+\)$/.test(line)) {
          let delNum = line.match(/([-+])?\d+/g).map(item => ~~item)
          let isDel = this.opts.some(item => Array.from(item.pos[0]).join() === delNum.join())
          if (!isDel) {
            this.$message('方块不存在!')
            return
          }
          console.log(delNum)
          this.$store.dispatch('DelOperate', delNum)
        } else if (/^CAM\(\d+,\d+,\d+\)$/.test(line)) {
          // 设置相机位置
          let camNum = line.match(/\d+/g).map(item => ~~item)
          this.camera.position.set(...camNum)
        } else if (/^LOOK\(\d+,\d+,\d+\)$/.test(line)){
          // 设置相机方向
          let lookNum = line.match(/\d+/g).map(item => ~~item)
          this.camera.lookAt(...lookNum)
        } else {
          this.$message(`第${index + 1}行出错了！`)
        }
      }
    },
    // 清空历史记录并重新渲染界面
    clearAll(){
      this.$confirm('确定要清空界面吗？清空后无法恢复')
        .then(() => {
          this.$store.dispatch("clearAll")
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>

<style scoped>
.home {
  margin: 0;
  box-sizing: border-box;
  display: flex;
  height: 100vh;
  background-color: #999;
}

#canvas {
  width: 60%;
  background-color: darkslategray;
  height: 100%;
  border-radius: 10px;
  margin-right: 4px;
}

#blocker {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  color: rgb(101, 182, 229);
  z-index: 99;
}

#instructions {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  color: #fff;
}

#canvas {
  position: relative;
  width: 70vw;
  height: 100vh;
  overflow: hidden;
}

#cross {
  display: none;
  position: absolute;
  top: calc(50% - 32px);
  left: calc(50% - 32px);
}

#item-bar {
  position: absolute;
  display: flex;
  left: 50%;
  bottom: 2px;
  transform: translateX(-50%);
  background-color: rgba(36, 36, 36, 0.5);
}

.item {
  width: 48px;
  height: 48px;
  border: 2px solid rgb(36, 36, 36);
  padding: 2px;
}

.selected {
  border-color: #e6e6e6;
  box-shadow: 0 0 2px #e6e6e6;
}

#right-part {
  flex: 1;
  height: 100%;
}

.btn-area {
  height: 6%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3%;
}

.btn {
  width: 100px;
  height: 80%;
  padding: 0px 16px;
}

#tips{
  font-size: 16px;
  line-height: 22px;
}

#record-part {
  height: calc(47% - 4px);
  margin-bottom: 4px;
  display: flex;
  flex-direction: row;
}

#record-part ul {
  margin-top: 0;
  margin-bottom: 0;
  padding: 10px 10px 10px 30px;
  background-color: dimgray;
  border-radius: 10px;
  font-size: 20px;
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: -ms-autohiding-scrollbar;
}
#record-part ul::-webkit-scrollbar {
  display: none;
}
.opt-record {
  width: 60%;
  margin-right: 4px;
}
.user-record {
  width: calc(40% - 4px);
}

.record-item{
  background-color: rgba(0, 0, 0, 0.1);
  padding: 2px;
  border-radius: 4px;
  color: rgb(243, 170, 182);
}

.record-item+.record-item{
  margin-top: 4px;
}

#command-part {
  height: 47%;
  background-color: #000;
  border-radius: 10px;
}

#command-input {
  width: 100%;
  height: 100%;
  border: 0;
  outline: none;
  background-color: #000;
  color: #fff;
  font-size: 18px;
  line-height: 24px;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
  resize: none;
}
</style>
