<template>
  <div class="server_group_container">
    <div class="server_group_header">
      <el-button type="primary" @click="hostFormVisible = true">添加实例</el-button>
      <el-button type="primary" @click="handleHiddenIP">
        {{ hiddenIp ? '显示IP' : '隐藏IP' }}
      </el-button>
      <el-button type="primary" @click="importVisible = true">导入实例</el-button>
    </div>
    <div class="server_group_collapse">
      <div v-if="isNoHost">
        <el-empty description="暂无实例">
          <el-button type="primary" @click="hostFormVisible = true">添加实例配置</el-button>
          <span class="or">或</span>
          <el-button type="primary" @click="importVisible = true">批量导入实例</el-button>
        </el-empty>
      </div>
      <el-collapse v-else v-model="activeGroup">
        <el-collapse-item v-for="(servers, groupName) in groupHostList" :key="groupName" :name="groupName">
          <template #title>
            <div class="group_title">
              {{ groupName }}
            </div>
          </template>
          <div class="host_card_container">
            <HostCard
              v-for="(item, index) in servers"
              :key="index"
              :host-info="item"
              :hidden-ip="hiddenIp"
              @update-host="handleUpdateHost"
              @update-list="handleUpdateList"
            />
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <HostForm
      v-model:show="hostFormVisible"
      :default-data="updateHostData"
      @update-list="handleUpdateList"
      @closed="updateHostData = null"
    />
    <ImportHost
      v-model:show="importVisible"
      @update-list="handleUpdateList"
    />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, computed, watch } from 'vue'
import HostCard from './components/host-card.vue'
import HostForm from './components/host-form.vue'
import ImportHost from './components/import-host.vue'

const { proxy: { $store, $message } } = getCurrentInstance()

let updateHostData = ref(null)
let hostFormVisible = ref(false)
let importVisible = ref(false)

let hiddenIp = ref(Number(localStorage.getItem('hiddenIp') || 0))
let activeGroup = ref([])

let handleUpdateList = async () => {
  try {
    await $store.getHostList()
  } catch (err) {
    $message.error('获取实例列表失败')
    console.error('获取实例列表失败: ', err)
  }
}

let handleUpdateHost = (defaultData) => {
  hostFormVisible.value = true
  updateHostData.value = defaultData
}

let handleHiddenIP = () => {
  hiddenIp.value = hiddenIp.value ? 0 : 1
  localStorage.setItem('hiddenIp', String(hiddenIp.value))
}

let groupHostList = computed(() => {
  let res = {}
  let hostList = $store.hostList
  let groupList = $store.groupList
  groupList.forEach(group => {
    res[group.name] = []
  })
  hostList.forEach(item => {
    const group = groupList.find(group => group.id === item.group)
    if (group) {
      res[group.name].push(item)
    } else {
      res['默认分组'].push(item)
    }
  })
  Object.keys(res).map(groupName => {
    if (res[groupName].length === 0) delete res[groupName]
  })
  return res
})

watch(groupHostList, () => {
  activeGroup.value = [...Object.keys(groupHostList.value),]
}, {
  immediate: true,
  deep: false
})

let isNoHost = computed(() => Object.keys(groupHostList.value).length === 0)

</script>

<style lang="scss" scoped>
.server_group_container {
  .server_group_header {
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: end;
  }

  .server_group_collapse {
    .group_title {
      margin: 0 15px;
      font-size: 14px;
      font-weight: 600;
      line-height: 22px;
    }

    .host_card_container {
      padding-top: 25px;
    }
    .or {
      color: var(--el-text-color-secondary);
      font-size: var(--el-font-size-base);
      margin: 0 25px;
    }
  }
}
</style>
