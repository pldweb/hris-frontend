<script setup>
import {
  BellIcon,
  ChevronDownIcon,
  MessageCircleIcon,
  UserIcon,
  ClockIcon,
  ReceiptIcon,
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon,
  MenuIcon,
} from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { ref, computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import _ from "lodash";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const { logout } = authStore;

const isOpen = ref(false);
const emit = defineEmits(["toggle-sidebar"]);

const route = useRoute();

const titles = {
  "admin.dashboard": {
    title: "Ringkasan Dasbor",
    subtitle: "Pantau kinerja tim dan metrik utama",
  },
  "admin.teams": {
    title: "Tim",
    subtitle: "Kelola tim dan unit organisasi",
  },
  "admin.team.detail": {
    title: "Detail Tim",
    subtitle: "Lihat informasi tim",
  },
  "admin.team.create": { title: "Buat Tim", subtitle: "Siapkan tim baru" },
  "admin.team.edit": {
    title: "Edit Tim",
    subtitle: "Perbarui informasi tim",
  },
  "admin.employees": {
    title: "Pegawai",
    subtitle: "Kelola data pegawai",
  },
  "admin.employees.create": {
    title: "Baut Pegawai",
    subtitle: "Tambahkan pegawai baru",
  },
  "admin.employees.edit": {
    title: "Edit Pegawai",
    subtitle: "Perbarui informasi pegawai",
  },
  "admin.employees.detail": {
    title: "Detail Pegawai",
    subtitle: "Lihat profil pegawai",
  },
  "admin.employees.success": {
    title: "Pegawai Berhasil Dibuat",
    subtitle: "Pegawai telah ditambahkan",
  },
  "admin.attendances": {
    title: "Kehadiran",
    subtitle: "Tinjau catatan masuk/keluar",
  },
  "admin.projects": {
    title: "Proyek",
    subtitle: "Kelola proyek dan tugas",
  },
  "admin.projects.create": {
    title: "Buat Proyek",
    subtitle: "Siapkan proyek baru",
  },
  "admin.projects.edit": {
    title: "Edit Proyek",
    subtitle: "Perbarui informasi proyek",
  },
  "admin.projects.detail": {
    title: "Detail Proyek",
    subtitle: "Lihat informasi proyek",
  },
  "admin.payroll.dashboard": {
    title: "Penggajian",
    subtitle: "Kelola penggajian dan pembayaran",
  },
  "admin.payroll.create": {
    title: "Buat Penggajian",
    subtitle: "Buat penggajian untuk pegawai",
  },
  "admin.payroll.detail": {
    title: "Detail Penggajian",
    subtitle: "Lihat ringkasan penggajian",
  },
  "employee.profile": {
    title: "Profil Saya",
    subtitle: "Kelola informasi pribadi Anda",
  },
  "employee.profile.edit": {
    title: "Edit Profil",
    subtitle: "Perbarui informasi pribadi Anda",
  },
  "employee.team": { title: "Tim Saya", subtitle: "Lihat anggota tim Anda" },
  "employee.attendance.my-attendances": {
    title: "Kehadiran Saya",
    subtitle: "Pantau catatan kehadiran Anda",
  },
  "employee.attendance.clock": {
    title: "Presensi",
    subtitle: "Catat waktu kerja Anda",
  },
  "employee.payslips": {
    title: "Slip Gaji Saya",
    subtitle: "Lihat riwayat penggajian Anda",
  },
  "employee.payslips.detail": {
    title: "Detail Slip Gaji",
    subtitle: "Lihat rincian penggajian",
  },
};

const pageInfo = computed(() => {
  const name = route.name?.toString() || "";
  return titles[name] || titles["admin.dashboard"];
});

const pageTitle = computed(() => pageInfo.value.title);
const pageSubtitle = computed(() => pageInfo.value.subtitle);

const handleLogout = async () => {
  if (confirm("Apakah Anda yakin ingin keluar?")) {
    await logout();
  }
};
</script>

<template>
  <header
    class="page-header bg-white border-b border-[#DCDEDD] px-3 sm:px-5 py-3 sm:py-4"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3 sm:gap-4">
        <button
          class="lg:hidden w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200"
          @click="emit('toggle-sidebar')"
        >
          <MenuIcon class="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 class="text-brand-dark text-xl sm:text-2xl font-extrabold">
            {{ pageTitle }}
          </h2>
          <p class="hidden sm:block text-brand-light text-sm font-normal mt-1">
            {{ pageSubtitle }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <!-- Action Buttons -->
        <div class="hidden sm:flex items-center gap-3">
          <button
            class="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200"
          >
            <BellIcon class="w-5 h-5 text-gray-600" />
          </button>
          <button
            class="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200"
          >
            <MessageCircleIcon class="w-5 h-5 text-gray-600" />
          </button>
          <button
            class="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200"
          >
            <SettingsIcon class="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <!-- Divider -->
        <div class="hidden sm:block w-px h-8 bg-[#DCDEDD] mx-5"></div>

        <!-- User Profile -->
        <div class="relative z-[10]">
          <div
            class="flex items-center gap-2 sm:gap-3 cursor-pointer"
            @click="isOpen = !isOpen"
          >
            <img
              :src="user?.profile_photo"
              alt="User Avatar"
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
              v-if="user?.profile_photo"
            />
            <div
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-gray-100"
              v-else
            >
              <UserIcon class="w-5 h-5 text-gray-400" />
            </div>
            <div class="hidden md:block text-left">
              <p class="text-brand-dark text-sm sm:text-base font-semibold">
                {{ user?.name }}
              </p>
              <p
                class="text-brand-dark text-sm sm:text-base font-normal leading-7"
              >
                {{ _.join(user?.roles, ", ").toUpperCase() }}
              </p>
            </div>
            <ChevronDownIcon
              class="w-4 h-4 text-gray-400 hidden sm:block"
              :class="{ 'rotate-180': isOpen }"
            />
          </div>

          <!-- Dropdown Menu -->
          <div
            class="absolute right-0 top-full mt-2 w-56 bg-white border border-[#DCDEDD] rounded-lg shadow-md py-2 z-[9999]"
            :class="{ hidden: !isOpen }"
          >
            <div class="px-4 py-3 border-b border-[#DCDEDD]">
              <p class="text-sm font-semibold text-gray-900">
                {{ user?.name }}
              </p>
              <p class="text-xs text-gray-600">{{ user?.email }}</p>
              <p class="text-xs text-gray-500">
                {{ _.join(user?.roles, ", ").toUpperCase() }}
              </p>
            </div>

            <div class="py-1">
              <RouterLink
                :to="{ name: 'employee.profile.edit' }"
                class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                @click="isOpen = false"
              >
                <UserIcon class="w-4 h-4" />
                Profil Pengguna
              </RouterLink>
              <a
                href="#"
                class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <SettingsIcon class="w-4 h-4" />
                Pengaturan Sistem
              </a>
              <a
                href="#"
                class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <HelpCircleIcon class="w-4 h-4" />
                Bantuan
              </a>
            </div>

            <div class="border-t border-[#DCDEDD] py-1">
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
              >
                <LogOutIcon class="w-4 h-4" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
