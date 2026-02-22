<script setup lang="ts">
import {
  UserPlusIcon,
  UsersIcon,
  BanknoteIcon,
  CalendarPlusIcon,
} from "lucide-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();
const showAlert = () => alert('Fitur akan segera hadir');
</script>

<template>
  <!-- Quick Actions Card (spans 2 rows on the right) -->
  <div
    class="lg:row-span-2 bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5"
  >
    <h3 class="text-brand-dark text-lg font-bold mb-4">Aksi Cepat</h3>
    <div class="space-y-3">
      <button
        @click="router.push({ name: 'admin.employees.create' })"
        class="btn-secondary w-full text-left rounded-[12px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-3"
      >
        <UserPlusIcon class="w-4 h-4 text-white" />
        <span class="text-brand-white text-sm font-semibold"
          >Tambah Pegawai</span
        >
      </button>

      <button
        @click="router.push({ name: 'admin.team.create' })"
        class="btn-secondary w-full text-left border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 hover:rounded-[12px] focus:border-[#0C51D9] focus:border-2 focus:rounded-[12px] focus:bg-white transition-all duration-300 px-4 py-3"
      >
        <UsersIcon class="w-4 h-4 text-gray-600" />
        <span class="text-brand-dark text-sm font-medium"
          >Buat Tim Baru</span
        >
      </button>

      <button
        @click="router.push({ name: 'admin.payroll.dashboard' })"
        class="btn-secondary w-full text-left border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 hover:rounded-[12px] focus:border-[#0C51D9] focus:border-2 focus:rounded-[12px] focus:bg-white transition-all duration-300 px-4 py-3"
      >
        <BanknoteIcon class="w-4 h-4 text-gray-600" />
        <span class="text-brand-dark text-sm font-medium"
          >Proses Penggajian</span
        >
      </button>

      <button
        @click="showAlert"
        class="btn-secondary w-full text-left border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 hover:rounded-[12px] focus:border-[#0C51D9] focus:border-2 focus:rounded-[12px] focus:bg-white transition-all duration-300 px-4 py-3"
      >
        <CalendarPlusIcon class="w-4 h-4 text-gray-600" />
        <span class="text-brand-dark text-sm font-medium"
          >Jadwalkan Rapat</span
        >
      </button>
    </div>
  </div>
</template>
