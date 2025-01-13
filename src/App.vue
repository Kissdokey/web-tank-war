<template>
  <template v-for="[barrierid, barrier] in bContainer" :key="barrierid">
    <div
      class="barrier"
      :style="{
        position: 'absolute',
        width: barrier.width + 'px',
        height: barrier.height + 'px',
        background: 'red',
        left: barrier.x + 'px',
        top:  barrier.y + 'px',
        backgroundColor: 'gray'
      }"
    >
    </div>
  </template>
  <template v-for="[tankid, tank] in container" :key="tankid">
    {{ tank }}
    <div
      class="tank"
      :style="{
        width: tank.appearance.width + 'px',
        height: tank.appearance.height + 'px',
        background: 'red',
        left: tank.x + 'px',
        top:  tank.y + 'px',
        transform: `rotate(${-tank.dir}deg)`,
      }"
    >
      <span> 👉 </span>
    </div>
  </template>
</template>
<script setup lang="ts">
import { BasicTank, EpTank } from "@/core/tank/BasicTank";
import { ref } from "vue";
import { GameManager } from "./core/manager";
import { EPlayer } from "@/event/keyboad/constans";
import { BasicBarrier } from "./core/barrier/BasicBarrier";
const testTank = new BasicTank({
  x: 250,
  y:500
});
const testTank2 = new EpTank({
  x: 500,
  y:500
});
const refTank = ref(testTank);
const refTank2 = ref(testTank2);
const tankContainer: Map<string, BasicTank> = new Map();
const barrierContainer: Map<string, BasicBarrier> = new Map()
const container = ref(tankContainer);
const bContainer = ref(barrierContainer)
const gameManager = new GameManager({
  tankContainer: container.value,
  barrierContainer: bContainer.value
});
gameManager.addTank(refTank.value, EPlayer.PLAYER1);
gameManager.addTank(refTank2.value, EPlayer.PLAYER2);

const originX = window.innerWidth / 2;
const originY = window.innerHeight / 2;
</script>
<style scoped>
.tank {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
}
</style>
