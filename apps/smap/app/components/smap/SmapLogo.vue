<template>
  <svg
    class="smap-logo"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect width="64" height="64" rx="18" fill="url(#smap-logo-bg)" />
    <path
      d="M15 39.5c10.8 9.4 27.2 8.7 37-1.6"
      stroke="url(#smap-logo-orbit)"
      stroke-width="4"
      stroke-linecap="round"
      stroke-dasharray="3 7"
    />
    <path
      d="M13 25.5c11.6-10.2 29.3-9.4 39.5 1.8"
      stroke="#8AF7F2"
      stroke-opacity=".55"
      stroke-width="3"
      stroke-linecap="round"
    />
    <path
      d="m34.3 11.5 12.2 35.2-13.2-8.4-14.7 6.5 15.7-33.3Z"
      fill="url(#smap-logo-arrow)"
      stroke="#F4FFFF"
      stroke-width="2.4"
      stroke-linejoin="round"
    />
    <circle cx="18" cy="20" r="2.5" fill="#FFC45F" />
    <circle cx="48" cy="42" r="2" fill="#F4FFFF" />
    <defs>
      <linearGradient id="smap-logo-bg" x1="8" y1="5" x2="58" y2="62" gradientUnits="userSpaceOnUse">
        <stop stop-color="#061B2B" />
        <stop offset=".52" stop-color="#073C46" />
        <stop offset="1" stop-color="#0A1524" />
      </linearGradient>
      <linearGradient id="smap-logo-arrow" x1="26" y1="14" x2="43" y2="48" gradientUnits="userSpaceOnUse">
        <stop stop-color="#4C9BFF" />
        <stop offset=".52" stop-color="#21F3E9" />
        <stop offset="1" stop-color="#35D982" />
      </linearGradient>
      <linearGradient id="smap-logo-orbit" x1="15" y1="42" x2="52" y2="39" gradientUnits="userSpaceOnUse">
        <stop stop-color="#35D982" />
        <stop offset="1" stop-color="#21F3E9" />
      </linearGradient>
    </defs>
  </svg>
</template>

<style scoped>
.smap-logo {
  display: block;
  flex: 0 0 auto;
}
</style>
