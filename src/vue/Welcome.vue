<template>
<!-- Slider -->
<div data-hs-carousel='{
    "loadingClasses": "opacity-0",
    "isAutoPlay": true
    }' class="relative">
    <div class="hs-carousel relative overflow-hidden w-full min-h-[350px] bg-white rounded-lg">
    <div class="hs-carousel-body absolute top-0 bottom-0 start-0 flex flex-nowrap transition-transform duration-700 opacity-0">
        <div class="hs-carousel-slide">
        <div class="flex justify-center h-full p-6">
            <span class="self-center text-4xl transition duration-700">
            <img src="https://media.discordapp.net/attachments/797819882522804244/1191527890668490833/1.png?ex=65b838d2&is=65a5c3d2&hm=56514ec707dfebbb78b2ca26323c9ec3ca506969e71b7a787c9ccf5403f23b9f&=&format=webp&quality=lossless&width=1285&height=671">
            </span>
        </div>
        </div>
        <div class="hs-carousel-slide">
        <div class="flex justify-center h-full p-6">
            <span class="self-center text-4xl transition duration-700">
            <img src="https://media.discordapp.net/attachments/797819882522804244/1187933184256651344/vinci_2.png?ex=65b45f7d&is=65a1ea7d&hm=20edfcbaa316158fc3da1bc56254df6dfbd32d42eeb43f100535dc9095618b5f&=&format=webp&quality=lossless&width=1285&height=671">
            </span>
        </div>
        </div>
        <div class="hs-carousel-slide">
        <div class="flex justify-center h-full p-6">
            <span class="self-center text-4xl transition duration-700">
            <img src="https://media.discordapp.net/attachments/797819882522804244/1176678588385337485/20231110015440_1.jpg?ex=65b057d5&is=659de2d5&hm=9760317ae4884f7c5cd9f4f37aa8a349a3b7fa13b66becd938921309a71e49e5&=&format=webp&width=1297&height=671">
            </span>
        </div>
        </div>
    </div>
    </div>

    <div class="hs-carousel-pagination flex justify-center absolute bottom-3 start-0 end-0 space-x-2">
    <span class="hs-carousel-active:bg-blue-700 hs-carousel-active:border-blue-700 w-3 h-3 border border-gray-400 rounded-full cursor-pointer"></span>
    <span class="hs-carousel-active:bg-blue-700 hs-carousel-active:border-blue-700 w-3 h-3 border border-gray-400 rounded-full cursor-pointer"></span>
    <span class="hs-carousel-active:bg-blue-700 hs-carousel-active:border-blue-700 w-3 h-3 border border-gray-400 rounded-full cursor-pointer"></span>
    </div>
</div>

<div class="flex items-center justify-center h-full font-typoldRegular tracking-tight p-2">
    <div class="flex items-center justify-center mb-8">
        <button @click="dsConnect" class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-800 mr-4">
            Discord
        </button>
        <button @click="tsConnect" class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
            TeamSpeak 3
        </button>
    </div>
</div>

</template>

<script setup>

const tsConnect = async () => {
    await window.a3url.launchTs();

}
const dsConnect = async () => {
    await window.a3url.launchDiscord();

}
</script>