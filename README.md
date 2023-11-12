#  undoredo

## Install

```
npm i @lucy2/undoredo
```

## Usage

```vue

<script setup lang="ts">
import UndoRedo from "@lucy2/undoredo";
import { ref } from "vue"
const input = ref(0);

let undoredo = new UndoRedo(function change() {
  console.log("change handler")
});


undoredo.registry({
  name: "update",
  pushQueue: true,
  init(){
   //init
   return ()=>{
      //destroy
   }
  },
  execute(newValue: number, oldValue: number) {
    let state = {
      before: oldValue,
      after: newValue
    }
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

    <button @click="undoredo.state.commands.redo();">undo</button>
    <button @click="undoredo.state.commands.undo();">redo</button>
  </div>
</template>

<style scoped>


```
# undoredo
# undoredo
