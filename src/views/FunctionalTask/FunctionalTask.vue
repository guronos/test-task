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
/**
 * @vue-data {array} players - Входные данные, константа
 * @vue-data {string} sortedBy - Ключ объекта из players по которому осуществляется сортировка, либо обратная сортировка. Возможные значения переменной - if, idReverse,
 surname, surnameReverse, birthday, birthdayReverse.
 * @vue-data {array} playersList - Массив сформированный при монтировании компонента  на основании players с объединением полей surname + name
 * @vue-data {boolean} visible - Переменная определяющая видимость диалогового окна с предупреждением об уходе со страницы без сохранения данных
 * @vue-data {boolean} observeСhanges - Переменная определяющая несохраненные изменения на странице
 * @vue-data {array} groups - Счетчики кол-ва игроков в каждой группе
 * @vue-data {object} dataPlayers - Итоговый массив отправляемый на сервер
 */
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
  /**
   * @vue-mounted - Формирует массив на основании массива players с объединением полей surname + name
   */
  mounted () {
    this.playersList = this.players.map(({ id, surname, name, birthday }) => ({
      id,
      surname: `${surname} ${name}`,
      birthday,
      groupId: 0
    })
    )
  },
  /**
   * @vue-beforeRouteLeave - Запрещает покидание страницы при observeСhanges = true
   */
  beforeRouteLeave (to, from) {
    if (this.observeСhanges) {
      this.visible = true
      return false
    } else {
      return true
    }
  },
  computed: {
    /**
     * Вычисляет список игроков с идентификатором группы 0
     */
    showLst () {
      return this.playersList.filter(x => x.groupId === 0)
    },
    /**
     * Вычисляет список игроков с идентификатором группы 1
     */
    showGroup1 () {
      return this.playersList.filter(x => x.groupId === 1)
    },
    /**
     * Вычисляет список игроков с идентификатором группы 2
     */
    showGroup2 () {
      return this.playersList.filter(x => x.groupId === 2)
    },
    /**
     * Вычисляет список игроков с идентификатором группы 3
     */
    showGroup3 () {
      return this.playersList.filter(x => x.groupId === 3)
    },
    /**
     * Сортирует список игроков с идентификатором группы 0 в зависимости от значения переменной sortedBy
     */
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
    /**
     * Изменение идентификатора группы у игрока двойным кликом (распределение игроков по группам)
     * @param {array} player - массив данных по игроку (sortedBy[i])
     */
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
    /**
     * Изменение идентификатора группы у игрока по клику на начальное значение (0), освобождение "места" в группе
     * @param {array} event - массив данных по игроку (sortedBy[i])
     */
    backToPlayerList (event) {
      this.groups[`group_${event.groupId}`] -= 1
      event.groupId = 0
    },
    /**
     * Захват сущности ЛКМ и передача id игрока в событии (dataTransfer)
     * @param {event} event - событие
     * @param {array} item - массив данных по игроку (sortedBy[i])
     */
    onDragStart (event, item) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('idPlayer', item.id.toString())
    },
    /**
     * Помещение перенесенной сущности в одну из групп
     * @param {event} event - событие
     * @param {number} group - номер группы в которую помещается сущность при перетаскивании
     */
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
    /**
     * Отправка данных на сервер
     */
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
    /**
     * Скрывает модальное окно, вызывается кликом на кнопку 'Отменить' при предупреждении о несохраненных изменениях
     */
    noSaveData () {
      this.visible = false
    },
    /**
     * Скрывает модальное окно, разрешает переход на другую страницу и программно осуществляет переход на гласную страницу, вызывается кликом на кнопку 'Сохранить' при предупреждении о несохраненных изменениях
     */
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
