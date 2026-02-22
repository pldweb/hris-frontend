<script setup lang="ts">
import { Lightbulb, Check } from "lucide-vue-next";
import { ref, onMounted, onUnmounted } from "vue";

const sidebarRef = ref<HTMLElement | null>(null);
const isSticky = ref(false);
const sidebarTop = ref(0);
const sidebarWidth = ref(0);

const handleScroll = () => {
  if (!sidebarRef.value) return;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const offset = 20; // 20px from top when sticky

  if (scrollTop > sidebarTop.value - offset) {
    isSticky.value = true;
  } else {
    isSticky.value = false;
  }
};

const handleResize = () => {
  if (sidebarRef.value) {
    sidebarWidth.value = sidebarRef.value.offsetWidth;
  }
};

onMounted(() => {
  if (sidebarRef.value) {
    sidebarTop.value = sidebarRef.value.offsetTop;
    sidebarWidth.value = sidebarRef.value.offsetWidth;
  }
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div class="w-100 flex-shrink-0">
    <div
      ref="sidebarRef"
      :class="[
        'bg-white border border-[#DCDEDD] rounded-[20px] p-6 transition-all duration-300 ease-in-out',
        isSticky ? 'fixed top-5 z-10' : 'relative'
      ]"
      :style="isSticky ? { width: `${sidebarWidth}px` } : {}"
    >
      <div class="flex items-center gap-3 mb-6">
        <div
          class="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center"
        >
          <Lightbulb class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 class="text-brand-dark text-xl font-bold">Tips Formulir</h3>
          <p class="text-brand-light text-sm font-normal">
            Panduan Kontak Darurat
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-start gap-3">
          <div
            class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          >
            <Check class="w-3 h-3 text-green-600" />
          </div>
          <div>
            <p class="text-brand-dark text-base font-semibold">
              Pilih kontak yang dapat diandalkan
            </p>
            <p class="text-brand-light text-xs font-normal">
              Pilih seseorang yang mudah dihubungi
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div
            class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          >
            <Check class="w-3 h-3 text-green-600" />
          </div>
          <div>
            <p class="text-brand-dark text-base font-semibold">
              Verifikasi informasi kontak
            </p>
            <p class="text-brand-light text-xs font-normal">
              Periksa kembali nomor telepon dan email
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div
            class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          >
            <Check class="w-3 h-3 text-green-600" />
          </div>
          <div>
            <p class="text-brand-dark text-base font-semibold">
              Sertakan detail hubungan
            </p>
            <p class="text-brand-light text-xs font-normal">
              Tetapkan bagaimana mereka berhubungan dengan pegawai
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div
            class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          >
            <Check class="w-3 h-3 text-green-600" />
          </div>
          <div>
            <p class="text-brand-dark text-base font-semibold">
              Pertimbangkan beberapa kontak
            </p>
            <p class="text-brand-light text-xs font-normal">
              Kontak darurat utama dan sekunder
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div
            class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          >
            <Check class="w-3 h-3 text-green-600" />
          </div>
          <div>
            <p class="text-brand-dark text-base font-semibold">
              Tinjau semua data formulir
            </p>
            <p class="text-brand-light text-xs font-normal">
              Pemeriksaan terakhir sebelum mengirimkan formulir
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
