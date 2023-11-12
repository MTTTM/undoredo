<script setup lang="ts">
import UndoRedo from "./index";
import { ref } from "vue"
const input = ref(0);

let undoredo = new UndoRedo(function change() {
  console.log("change")
});


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
      }

    }
  }
})
const descrease = () => undoredo.state.commands.update(Number(input.value) - 1, Number(input.value))
const increase = () => undoredo.state.commands.update(Number(input.value) + 1, Number(input.value))
</script>

<template>
  <div>
    <input placeholder="input" :value="input" disabled>
    <button @click="descrease">--</button>
    <button @click="increase">++</button>

    <button @click="undoredo.state.commands.redo();">redo</button>
    <button @click="undoredo.state.commands.undo();">undo</button>

  </div>
</template>

