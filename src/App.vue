<script setup lang="ts">
// import UndoRedo from "@lucy2/undoredo";
import UndoRedo from "./index";
import { ref } from "vue"
const input = ref(0);

let undoredo = new UndoRedo(() => {

})


// undoredo.state = {
//   current: 1,
//   queue: [],
//   commands: {},
//   commandArray: [],
//   destroyList: [],
// }
undoredo.registry({
  name: "update",
  pushQueue: true,
  execute(newBlock: number, oldBlock: number) {
    let state = {
      before: oldBlock,
      after: newBlock
    }
    console.log("state", state)
    return {
      undo() {
        input.value = state.after
      },
      redo() {
        input.value = state.before;
      },
      oldBlock,
      newBlock

    }
  }
})
const descrease = () => {
  undoredo.state.commands.update(Number(input.value) - 1, Number(input.value))
  console.log(" undoredo.state", undoredo.state)
}
const increase = () => {
  undoredo.state.commands.update(Number(input.value) + 1, Number(input.value))
  
}
const redo=()=>{
undoredo.state.commands.redo();
 console.log("change redo .state", undoredo.state.queue)
}
const undo=()=>{
  undoredo.state.commands.undo();
  console.log("change undo .state", undoredo.state.queue)
}
</script>

<template>
  <div>
    <input placeholder="input" :value="input" disabled>
    <button @click="descrease">--</button>
    <button @click="increase">++</button>

    <button @click="redo">redo</button>
    <button @click="undo">undo</button>

  </div>
</template>

