const { getSSHList, addSSH, updateSSH, removeSSH, getCommand } = require('../controller/ssh')
const { getHostList, addHost, updateHost, removeHost } = require('../controller/host')
const { login, getpublicKey, updatePwd, getLoginRecord } = require('../controller/user')
const { getSupportEmailList, getUserEmailList, updateUserEmailList, removeUserEmail, pushEmail, getNotifyList, updateNotifyList } = require('../controller/notify')
const { getGroupList, addGroupList, updateGroupList, removeGroup } = require('../controller/group')

const ssh = [
  {
    method: 'get',
    path: '/get-ssh-list',
    controller: getSSHList
  },
  {
    method: 'post',
    path: '/add-ssh',
    controller: addSSH
  },
  {
    method: 'post',
    path: '/update-ssh',
    controller: updateSSH
  },
  {
    method: 'delete',
    path: '/remove-ssh/:id',
    controller: removeSSH
  },
  {
    method: 'get',
    path: '/command',
    controller: getCommand
  }
]
const host = [
  {
    method: 'get',
    path: '/host-list',
    controller: getHostList
  },
  {
    method: 'post',
    path: '/host-save',
    controller: addHost
  },
  {
    method: 'put',
    path: '/host-save',
    controller: updateHost
  },
  {
    method: 'post',
    path: '/host-remove',
    controller: removeHost
  }
  // {
  //   method: 'put',
  //   path: '/host-sort',
  //   controller: updateHostSort
  // }
]
const user = [
  {
    method: 'get',
    path: '/get-pub-pem',
    controller: getpublicKey
  },
  {
    method: 'post',
    path: '/login',
    controller: login
  },
  {
    method: 'put',
    path: '/pwd',
    controller: updatePwd
  },
  {
    method: 'get',
    path: '/get-login-record',
    controller: getLoginRecord
  }
]
const notify = [
  {
    method: 'get',
    path: '/support-email',
    controller: getSupportEmailList
  },
  {
    method: 'get',
    path: '/user-email',
    controller: getUserEmailList
  },
  {
    method: 'post',
    path: '/user-email',
    controller: updateUserEmailList
  },
  {
    method: 'post',
    path: '/push-email',
    controller: pushEmail
  },
  {
    method: 'delete',
    path: '/user-email/:email',
    controller: removeUserEmail
  },
  {
    method: 'get',
    path: '/notify',
    controller: getNotifyList
  },
  {
    method: 'put',
    path: '/notify',
    controller: updateNotifyList
  }
]

const group = [
  {
    method: 'get',
    path: '/group',
    controller: getGroupList
  },
  {
    method: 'post',
    path: '/group',
    controller: addGroupList
  },
  {
    method: 'delete',
    path: '/group/:id',
    controller: removeGroup
  },
  {
    method: 'put',
    path: '/group/:id',
    controller: updateGroupList
  }
]

module.exports = [].concat(ssh, host, user, notify, group)
