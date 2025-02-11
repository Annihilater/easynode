import { io } from 'socket.io-client'
import { defineStore, acceptHMRUpdate } from 'pinia'
import $api from '@/api'
import ping from '@/utils/ping'

const useStore = defineStore({
  id: 'global',
  state: () => ({
    serviceURI: null,
    hostList: [],
    groupList: [],
    sshList: [],
    scriptList: [],
    HostStatusSocket: null,
    user: localStorage.getItem('user') || null,
    token: sessionStorage.getItem('token') || localStorage.getItem('token') || null,
    title: ''
  }),
  actions: {
    async setJwtToken(token, isSession = true) {
      if(isSession) sessionStorage.setItem('token', token)
      else localStorage.setItem('token', token)
      this.$patch({ token })
    },
    async setUser(username) {
      localStorage.setItem('user', username)
      this.$patch({ user: username })
    },
    async setTitle(title) {
      this.$patch({ title })
    },
    async clearJwtToken() {
      localStorage.clear('token')
      sessionStorage.clear('token')
      this.$patch({ token: null })
    },
    async getMainData() {
      await this.getGroupList()
      await this.getHostList()
      await this.getSSHList()
      await this.getScriptList()
    },
    async getHostList() {
      const { data: hostList } = await $api.getHostList()
      // console.log('hostList:', hostList)
      this.$patch({ hostList })
      this.wsHostStatus()
    },
    async getGroupList() {
      const { data: groupList } = await $api.getGroupList()
      // console.log('groupList:', groupList)
      this.$patch({ groupList })
    },
    async getSSHList() {
      const { data: sshList } = await $api.getSSHList()
      // console.log('sshList:', sshList)
      this.$patch({ sshList })
    },
    async getScriptList() {
      const { data: scriptList } = await $api.getScriptList()
      // console.log('scriptList:', scriptList)
      this.$patch({ scriptList })
    },
    // getHostPing() {
    //   setInterval(() => {
    //     this.hostList.forEach((item) => {
    //       const { host } = item
    //       ping(`http://${ host }:${ this.$clientPort }`)
    //         .then((res) => {
    //           item.ping = res
    //         })
    //     })
    //   }, 2000)
    // },
    async wsHostStatus() {
      if (this.HostStatusSocket) this.HostStatusSocket.close()
      let socketInstance = io(this.serviceURI, {
        path: '/clients',
        forceNew: true,
        reconnectionDelay: 5000,
        reconnectionAttempts: 3
      })
      this.HostStatusSocket = socketInstance
      socketInstance.on('connect', () => {
        console.log('clients websocket 已连接: ', socketInstance.id)
        let token = this.token
        socketInstance.emit('init_clients_data', { token })
        socketInstance.on('clients_data', (data) => {
          this.hostList.forEach(item => {
            const { host } = item
            if (data[host] === null) return { ...item }
            return Object.assign(item, data[host])
          })
        })
        socketInstance.on('token_verify_fail', (message) => {
          console.log('token 验证失败:', message)
          // $router.push('/login')
        })
      })
      socketInstance.on('disconnect', () => {
        console.error('clients websocket 连接断开')
      })
      socketInstance.on('connect_error', (message) => {
        console.error('clients websocket 连接出错: ', message)
      })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}

export default useStore
