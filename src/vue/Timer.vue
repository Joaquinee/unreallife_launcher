<template>
    <div>
      <a href="/" class='flex items-center justify-center bg-red-400 w-32 h-16 rounded-xl font-typoldBold text-white'>
        {{ countdownLine }}
      </a>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      deadline: {
        type: String,
        required: true,
      },
      speed: {
        type: Number,
        default: 1000,
      },
    },
    data() {
      return {
        currentTime: Date.parse(this.deadline) - Date.parse(new Date()),
      };
    },
    mounted() {
      setTimeout(this.countdown, 1000);
    },
    computed: {
      seconds() {
        return Math.floor((this.currentTime / 1000) % 60);
      },
      minutes() {
        return Math.floor((this.currentTime / 1000 / 60) % 60);
      },
      hours() {
        return Math.floor((this.currentTime / (1000 * 60 * 60)) % 24);
      },
      days() {
        return Math.floor(this.currentTime / (1000 * 60 * 60 * 24));
      },
      countdownLine() {
        if (this.currentTime > 0) {
          return `${this.days} jours ${this.hours} heures ${this.minutes} minutes ${this.seconds} secondes`;
        } else {
          return "Le temps est écoulé";
        }
      },
    },
    filters: {
      formatTime(value) {
        if (value < 10) {
          return "0" + value;
        }
        return value;
      },
    },
    methods: {
      countdown() {
        this.currentTime = Date.parse(this.deadline) - Date.parse(new Date());
        if (this.currentTime > 0) {
          setTimeout(this.countdown, this.speed);
        } else {
          this.currentTime = null;
        }
      },
    },
  };
  </script>
  