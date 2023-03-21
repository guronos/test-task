<template>
  <div>
  <div class="container">
    <div class="player-list">
<table class="player-list-table">
    <tr>
        <th @click="sortedBy=sortedBy !=='id' ? 'id' : 'idReverse'">№</th>
        <th @click="sortedBy=sortedBy !=='surname' ? 'surname' : 'surnameReverse'">Участник</th>
        <th @click="sortedBy=sortedBy !=='birthday' ? 'birthday' : 'birthdayReverse'">Дата рождения</th>
    </tr>
    <tr v-for="(player, ind) in sortArr" :key="ind" @dblclick="transferToGroup(player)" >
        <td>{{ player.id }}</td>
        <td draggable="true" @dragstart="onDragStart($event, player)">{{ player.surname }}</td>
        <td>{{ player.birthday }}</td>
    </tr>
</table>
</div>
<div class="group-list">
    <table class="table-group" @drop="onDrop($event, 1)" @dragover.prevent @dragenter.prevent>
        <tr><th>Группа 1</th></tr>
       <tbody>
        <tr v-for="player, idx in showGroup1" :key="idx">
        <td @click="backToPlayerList(player)">{{ player.surname }}</td></tr>
    </tbody>
    </table>
    <table class="table-group" @drop="onDrop($event, 2)" @dragover.prevent @dragenter.prevent>
        <tr><th>Группа 2</th></tr>
        <tbody>
        <tr v-for="player, idx in showGroup2" :key="idx">
        <td @click="backToPlayerList(player)" @dragover.prevent @dragenter.prevent>{{ player.surname }}</td></tr>
    </tbody>
    </table>
    <table class="table-group" @drop="onDrop($event, 3)" @dragover.prevent @dragenter.prevent>
        <tr><th>Группа 3</th></tr>
        <tbody>
        <tr v-for="player, idx in showGroup3" :key="idx">
        <td @click="backToPlayerList(player)" @dragover.prevent @dragenter.prevent>{{ player.surname }}</td></tr>
    </tbody>
    </table>
</div>
</div>
<div class="btnWrap"><Button label="Сохранить" severity="success" @click="submit" /></div>
        <Dialog v-model:visible="visible" modal header="Предупреждение" :style="{ width: '50vw' }">
            <p>
            Вы совершаете переход на другую страницу без сохранения изменений.
            Желаете сохранить изменения?
            </p>
            <template #footer>
                <Button label="Отменить" icon="pi pi-times" @click="noSaveData" text />
                <Button label="Сохранить" icon="pi pi-check" @click="save" autofocus />
            </template>
        </Dialog>
</div>
</template>
<script>
import { players } from './const/const.js'
export default {
  data () {
    return {
      players,
      sortedBy: 'surname',
      playersList: [],
      visible: false,
      observeСhanges: false,
      groups: {
        group_1: 0,
        group_2: 0,
        group_3: 0
      },
      dataPlayers: {}
    }
  },
  mounted () {
    this.playersList = this.players.map(({ id, surname, name, birthday }) => ({
      id,
      surname: `${surname} ${name}`,
      birthday,
      groupId: 0
    })
    )
  },
  beforeRouteLeave (to, from) {
    if (this.observeСhanges) {
      this.visible = true
      return false
    } else {
      return true
    }
  },
  computed: {
    showLst () {
      return this.playersList.filter(x => x.groupId === 0)
    },
    showGroup1 () {
      return this.playersList.filter(x => x.groupId === 1)
    },
    showGroup2 () {
      return this.playersList.filter(x => x.groupId === 2)
    },
    showGroup3 () {
      return this.playersList.filter(x => x.groupId === 3)
    },
    sortArr () {
      if (this.sortedBy === 'id' || this.sortedBy === 'idReverse') {
        const lstSort = this.playersList.filter(x => x.groupId === 0).sort((a, b) => a.id > b.id ? 1 : -1)
        return this.sortedBy === 'id' ? lstSort : lstSort.reverse()
      } else if (this.sortedBy === 'surname' || this.sortedBy === 'surnameReverse') {
        const lstSort = this.playersList.filter(x => x.groupId === 0).sort((a, b) => a.surname > b.surname ? 1 : -1)
        return this.sortedBy === 'surname' ? lstSort : lstSort.reverse()
      } else if (this.sortedBy === 'birthday' || this.sortedBy === 'birthdayReverse') {
        const lstSort = this.playersList.filter(x => x.groupId === 0).sort((a, b) => a.birthday > b.birthday ? 1 : -1)
        return this.sortedBy === 'birthday' ? lstSort : lstSort.reverse()
      }
    }
  },
  methods: {
    transferToGroup (player) {
      this.observeСhanges = true
      if (this.groups.group_1 < 3) {
        this.groups.group_1 += 1
        this.showLst[this.showLst.indexOf(player)].groupId = 1
      } else if (this.groups.group_2 < 3) {
        this.groups.group_2 += 1
        this.showLst[this.showLst.indexOf(player)].groupId = 2
      } else if (this.groups.group_3 < 3) {
        this.groups.group_3 += 1
        this.showLst[this.showLst.indexOf(player)].groupId = 3
      }
    },
    backToPlayerList (event) {
      this.groups[`group_${event.groupId}`] -= 1
      event.groupId = 0
    },
    onDragStart (event, item) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('idPlayer', item.id.toString())
    },
    onDrop (event, group) {
      this.observeСhanges = true
      if (this.groups[`group_${group}`] >= 3) {
        return
      } else {
        this.groups[`group_${group}`] += 1
      }
      const itemId = parseInt(event.dataTransfer.getData('idPlayer'))
      this.showLst.forEach(x => {
        if (x.id === itemId) {
          x.groupId = group
        }
      })
    },
    async submit () {
      this.visible = false
      this.observeСhanges = false
      this.dataPlayers.data = this.playersList.filter((x) => x.groupId !== 0).map(({ id, groupId }) => ({
        player_id: id,
        group_id: groupId
      }))
      if (this.dataPlayers.data.length) {
        try {
          const postDataPlayers = await fetch('localhost:8080/endpoint', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(this.dataPlayers)
          })
          const getResponse = await postDataPlayers.json()
          console.log(getResponse)
          this.playersList.forEach((x) => (x.groupId = 0))
        } catch (e) {
        // console.log(e)
          console.log(this.dataPlayers.data)
        }
      }
    },
    noSaveData () {
      this.observeСhanges = false
      this.visible = false
    },
    save () {
      this.observeСhanges = false
      this.visible = false
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

<style scoped>
.container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.player-list {
    max-width: 40vw;
}
.group-list {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
   height: 300px;
}
.table-group {
    margin: 0 10px;
    width: 20rem;
    border: 1px solid grey;
    border-collapse: collapse;
    background:#83a9f5;
}
.table-group tr {
    display: block;
}
.table-group th {
background: white;
    max-height: 60px;
    color:#039;
    padding: 10px;
    font-weight: normal;
    display: block;
    width: 100%;
}
.table-group td {
    background:#ccddff;
    height: 100px;
}
.table-group tbody {
    background:#ccddff;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.player-list-table {
    width: 40rem;
    border: 1px solid #69c;
    border-collapse: collapse;
    text-align: left;
    border-radius: 8px;
}
.player-list-table th {
    color:#039;
    padding: 10px;
    font-weight: normal;
}
.player-list-table td {
    color: #669;
    border-top: 1px dashed white;
    padding: 10px;
    background:#ccddff;
}
.player-list-table tr:hover td {
  background: #99bcff;
}
.player-list-table tr {
    border-radius: 8px;
}
.btnWrap {
margin-top: 8rem;
}
</style>
