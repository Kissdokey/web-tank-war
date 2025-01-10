<template>
  <template v-for="[tankid, tank] in container" :key="tankid">
    {{ tank }}
    <div
      class="tank"
      :style="{
        width: tank.appearance.width + 'px',
        height: tank.appearance.height + 'px',
        background: 'red',
        left: originX + tank.x + 'px',
        top: originY - tank.y + 'px',
        transform: `rotate(${-tank.dir}deg)`,
      }"
    >
      <span> 👉 </span>
    </div>
  </template>
</template>
<script setup lang="ts">
import { BasicTank } from "@/core/tank/BasicTank";
import { ref } from "vue";
import { GameManager } from "./core/manager";
import { EPlayer } from "./event/keyboard";
const testTank = new BasicTank({
  id: "lijian1",
  x: -100,
});
const testTank2 = new BasicTank({
  id: "lijian2",
  x: 100,
});
const refTank = ref(testTank);
const refTank2 = ref(testTank2);
const tankContainer: Map<string, BasicTank> = new Map();
const container = ref(tankContainer);
const gameManager = new GameManager({
  tankContainer: container.value,
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
