<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useEmployeeStore } from "@/stores/employee";
import { storeToRefs } from "pinia";
import { getStatusColor, getLevelColor } from "@/utils/styleHelpers.js";
import { formatDateLong as formatDate } from "@/utils/dateUtils.js";
import {
  formatRupiah as formatCurrency,
  capitalize,
} from "@/utils/formatUtils.js";
import {
  Edit,
  CheckCircle,
  CalendarCheck,
  Folder,
  TrendingUp,
  Contact,
  Briefcase,
  MapPin,
  Phone,
  Users,
  ListChecks,
  Calendar,
  Code,
  Star,
  Building,
  User,
  Clock,
} from "lucide-vue-next";

const employeeStore = useEmployeeStore();
const { loading, performanceStatistics } = storeToRefs(employeeStore);

const profile = ref<any>(null);

const loadProfile = async () => {
  try {
    profile.value = await employeeStore.fetchMyProfile();
    if (profile.value?.id) {
      await employeeStore.fetchPerformanceStatistics(profile.value.id);
    }
  } catch (error) {}
};

const statusBadgeClass = computed(() => {
  return getStatusColor(profile.value?.job_information?.status);
});

const skillLevelBadgeClass = computed(() => {
  return getLevelColor(capitalize(profile.value?.job_information?.skill_level));
});

// Dummy tasks
const latestTasks = ref([
  {
    id: 1,
    title: "API Integration for User Dashboard",
    description: "Integrate REST APIs for the new user dashboard features...",
    status: "Sedang Berjalan",
    statusClass: "bg-[#FEF3C7] text-[#D97706]",
    dueDate: "Jan 30, 2024",
    project: "Dashboard Project",
  },
  {
    id: 2,
    title: "Database Schema Optimization",
    description: "Review and optimize database queries for improved...",
    status: "Menunggu",
    statusClass: "bg-[#EBF8FF] text-[#1E40AF]",
    dueDate: "Feb 5, 2024",
    project: "Performance Project",
  },
  {
    id: 3,
    title: "Code Review for Payment Module",
    description: "Review payment processing code and provide feedback on...",
    status: "Selesai",
    statusClass: "bg-[#F0FDF4] text-[#166534]",
    dueDate: "Completed: Jan 25, 2024",
    project: "Payment Project",
  },
  {
    id: 4,
    title: "Unit Tests for Authentication",
    description: "Write comprehensive unit tests for the new authentication...",
    status: "Sedang Berjalan",
    statusClass: "bg-[#FEF3C7] text-[#D97706]",
    dueDate: "Feb 1, 2024",
    project: "Security Project",
  },
  {
    id: 5,
    title: "Documentation Update",
    description: "Update technical documentation for the new feature...",
    status: "Menunggu",
    statusClass: "bg-[#EBF8FF] text-[#1E40AF]",
    dueDate: "Feb 8, 2024",
    project: "Documentation Project",
  },
]);

onMounted(() => {
  loadProfile();
});
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center h-64">
    <p class="text-gray-500">Memuat...</p>
  </div>

  <div v-else-if="profile">
    <!-- Employee Header -->
    <div class="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-6">
      <div class="flex items-center gap-6">
        <div class="relative">
          <img
            :src="
              profile?.user?.profile_photo ||
              'https://ui-avatars.com/api/?name=' + profile?.user?.name
            "
            :alt="profile?.user?.name"
            class="w-32 h-32 rounded-full object-cover"
          />
          <span
            :class="statusBadgeClass"
            class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap"
          >
            {{ capitalize(profile?.job_information?.status) }}
          </span>
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-4 mb-2">
            <h1 class="text-brand-dark text-3xl font-extrabold">
              {{ profile?.user?.name }}
            </h1>
            <span
              :class="skillLevelBadgeClass"
              class="px-3 py-1 rounded-md text-sm font-semibold"
            >
              {{ capitalize(profile?.job_information?.skill_level) }}
            </span>
          </div>
          <p class="text-brand-light text-lg mb-3">
            {{ capitalize(profile?.job_information?.job_title) }}
          </p>
          <div class="flex items-center gap-6 text-base text-gray-600">
            <div class="flex items-center gap-2">
              <Building class="w-4 h-4" />
              <span>{{
                capitalize(profile?.job_information?.work_location)
              }}</span>
            </div>
            <div class="flex items-center gap-2">
              <User class="w-4 h-4" />
              <span>{{ profile?.code }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Calendar class="w-4 h-4" />
              <span
                >Bergabung
                {{ formatDate(profile?.job_information?.start_date) }}</span
              >
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <button
            class="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-6 py-3 flex items-center gap-2"
          >
            <Edit class="w-4 h-4 text-white" />
            <span class="text-brand-white text-sm font-semibold"
              >Minta Perubahan pada Manajer</span
            >
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Tasks Completed Card -->
      <div
        class="bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-brand-dark text-sm font-medium">Tugas Selesai</p>
            <p
              class="text-brand-dark text-3xl font-extrabold leading-none my-2"
            >
              {{ performanceStatistics?.tasks_completed || 0 }}
            </p>
            <p class="text-success text-sm font-medium">Bulan ini</p>
          </div>
          <div
            class="w-14 h-14 bg-blue-50 rounded-[16px] flex items-center justify-center"
          >
            <CheckCircle class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <!-- Attendance Rate Card -->
      <div
        class="bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-brand-dark text-sm font-medium">Tingkat Kehadiran</p>
            <p
              class="text-brand-dark text-3xl font-extrabold leading-none my-2"
            >
              {{ performanceStatistics?.attendance_rate || 0 }}%
            </p>
            <p class="text-success text-sm font-medium">Di atas rata-rata</p>
          </div>
          <div
            class="w-14 h-14 bg-green-50 rounded-[16px] flex items-center justify-center"
          >
            <CalendarCheck class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <!-- Active Projects Card -->
      <div
        class="bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-brand-dark text-sm font-medium">Proyek Aktif</p>
            <p
              class="text-brand-dark text-3xl font-extrabold leading-none my-2"
            >
              {{ performanceStatistics?.projects_count || 0 }}
            </p>
            <p class="text-success text-sm font-medium">Proyek saat ini</p>
          </div>
          <div
            class="w-14 h-14 bg-purple-50 rounded-[16px] flex items-center justify-center"
          >
            <Folder class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <!-- Performance Rating Card -->
      <div
        class="bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-brand-dark text-sm font-medium">Kinerja</p>
            <p
              class="text-brand-dark text-3xl font-extrabold leading-none my-2"
            >
              {{ performanceStatistics?.performance_score || 0 }}%
            </p>
            <p class="text-success text-sm font-medium">Peringkat sangat baik</p>
          </div>
          <div
            class="w-14 h-14 bg-orange-50 rounded-[16px] flex items-center justify-center"
          >
            <TrendingUp class="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-start">
      <!-- Left Column -->
      <div class="space-y-6">
        <!-- Personal Information -->
        <div class="bg-white border border-[#DCDEDD] rounded-[20px] p-5">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-12 h-12 bg-teal-50 rounded-[12px] flex items-center justify-center"
            >
              <Contact class="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 class="text-brand-dark text-lg font-bold">
                Informasi Pribadi
              </h3>
              <p class="text-brand-light text-base">
                Detail kontak dan profil Anda
              </p>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Email</span>
              <span class="text-brand-dark text-base font-medium">{{
                profile?.user?.email
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Telepon</span>
              <span class="text-brand-dark text-base font-medium">{{
                profile?.phone || "-"
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Tanggal Lahir</span>
              <span class="text-brand-dark text-base font-medium">{{
                formatDate(profile?.date_of_birth)
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">ID Pegawai</span>
              <span class="text-brand-dark text-base font-medium">{{
                profile?.code
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Lokasi Kantor</span>
              <span class="text-brand-dark text-base font-medium">{{
                capitalize(profile?.job_information?.work_location)
              }}</span>
            </div>
            <div class="flex justify-between items-start">
              <span class="text-brand-light text-base">Hobi</span>
              <span
                class="text-brand-dark text-base font-medium text-right max-w-[60%]"
                >{{ profile?.hobby || "-" }}</span
              >
            </div>
          </div>
        </div>

        <!-- Employment Details -->
        <div class="bg-white border border-[#DCDEDD] rounded-[20px] p-5">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center"
            >
              <Briefcase class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 class="text-brand-dark text-lg font-bold">
                Detail Pekerjaan
              </h3>
              <p class="text-brand-light text-base">
                Informasi pekerjaan dan kompensasi
              </p>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Jabatan</span>
              <span class="text-brand-dark text-base font-medium">{{
                capitalize(profile?.job_information?.job_title)
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Tanggal Mulai</span>
              <span class="text-brand-dark text-base font-medium">{{
                formatDate(profile?.job_information?.start_date)
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Jenis Pekerjaan</span>
              <span class="text-brand-dark text-base font-medium">{{
                capitalize(profile?.job_information?.employment_type)
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Gaji Bulanan</span>
              <span class="text-brand-dark text-base font-medium">{{
                formatCurrency(profile?.job_information?.monthly_salary)
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Tingkat Keahlian</span>
              <span
                :class="skillLevelBadgeClass"
                class="px-2 py-1 rounded-md text-sm font-semibold"
                >{{ capitalize(profile?.job_information?.skill_level) }}</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Lokasi Kerja</span>
              <span class="text-brand-dark text-base font-medium">{{
                capitalize(profile?.job_information?.work_location)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Location Details -->
        <div class="bg-white border border-[#DCDEDD] rounded-[20px] p-5">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-12 h-12 bg-purple-50 rounded-[12px] flex items-center justify-center"
            >
              <MapPin class="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 class="text-brand-dark text-lg font-bold">
                Detail Lokasi
              </h3>
              <p class="text-brand-light text-base">
                Alamat dan informasi lokasi
              </p>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Jenis Kelamin</span>
              <span class="text-brand-dark text-base font-medium">{{
                capitalize(profile?.gender)
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Tempat Lahir</span>
              <span class="text-brand-dark text-base font-medium">{{
                profile?.place_of_birth || "-"
              }}</span>
            </div>
            <div class="flex justify-between items-start">
              <span class="text-brand-light text-base">Alamat</span>
              <span
                class="text-brand-dark text-base font-medium text-right max-w-[60%]"
                >{{ profile?.address || "-" }}</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Kota</span>
              <span class="text-brand-dark text-base font-medium">{{
                profile?.city || "-"
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Kode Pos</span>
              <span class="text-brand-dark text-base font-medium">{{
                profile?.postal_code || "-"
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Negara</span>
              <span class="text-brand-dark text-base font-medium"
                >Indonesia</span
              >
            </div>
          </div>
        </div>

        <!-- Emergency Contact -->
        <div class="bg-white border border-[#DCDEDD] rounded-[20px] p-5">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-12 h-12 bg-red-50 rounded-[12px] flex items-center justify-center"
            >
              <Phone class="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 class="text-brand-dark text-lg font-bold">
                Kontak Darurat
              </h3>
              <p class="text-brand-light text-base">
                Orang yang dihubungi jika keadaan darurat
              </p>
            </div>
          </div>
          <div
            class="space-y-4"
            v-if="
              profile?.emergency_contacts &&
              profile.emergency_contacts.length > 0
            "
          >
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Nama Kontak</span>
              <span class="text-brand-dark text-base font-medium">{{
                profile.emergency_contacts[0]?.name || "-"
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Hubungan</span>
              <span class="text-brand-dark text-base font-medium">{{
                capitalize(profile.emergency_contacts[0]?.relationship)
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Nomor Telepon</span>
              <span class="text-brand-dark text-base font-medium">{{
                profile.emergency_contacts[0]?.phone || "-"
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Email</span>
              <span class="text-brand-dark text-base font-medium">{{
                profile.emergency_contacts[0]?.email || "-"
              }}</span>
            </div>
          </div>
          <div v-else class="text-center text-gray-500 py-4">
            Belum ada kontak darurat yang ditambahkan
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Team Information -->
        <div
          class="bg-white border border-[#DCDEDD] rounded-[20px] p-5 h-fit"
          v-if="profile?.team"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 bg-indigo-50 rounded-[12px] flex items-center justify-center"
              >
                <Users class="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 class="text-brand-dark text-lg font-bold">Tim Saya</h3>
                <p class="text-brand-light text-base">Informasi tim</p>
              </div>
            </div>
            <button
              class="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-2 flex items-center gap-2"
            >
              <Users class="w-4 h-4 text-gray-600" />
              <span class="text-brand-dark text-sm font-semibold"
                >Lihat Tim</span
              >
            </button>
          </div>

          <!-- Team Header -->
          <div
            class="flex items-center gap-4 mb-4 p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-[16px]"
          >
            <div
              class="w-16 h-16 relative flex items-center justify-center rounded-[12px] overflow-hidden"
            >
              <div
                class="w-full h-full absolute bg-white/20 rounded-[12px]"
              ></div>
              <Code class="w-8 h-8 text-white relative z-10" />
            </div>
            <div class="flex-1">
              <h4 class="text-white text-xl font-bold">
                {{ profile.team.name }}
              </h4>
              <p class="text-white/80 text-base font-normal">
                {{ profile.team.team_size }} anggota •
                {{ capitalize(profile.team.status) }}
              </p>
            </div>
            <div class="flex items-center gap-1">
              <Star class="w-4 h-4 text-white fill-white" />
              <Star class="w-4 h-4 text-white fill-white" />
              <Star class="w-4 h-4 text-white fill-white" />
              <Star class="w-4 h-4 text-white fill-white" />
              <Star class="w-4 h-4 text-white fill-white" />
            </div>
          </div>

          <!-- Team Details -->
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Ketua Tim</span>
              <div class="flex items-center gap-2">
                <span class="text-brand-dark text-base font-medium">{{
                  profile.team.leader_name || "-"
                }}</span>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Departemen</span>
              <span class="text-brand-dark text-base font-medium">{{
                capitalize(profile.team.department)
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-light text-base">Jumlah Anggota</span>
              <span class="text-brand-dark text-base font-medium"
                >{{ profile.team.team_size }} anggota</span
              >
            </div>
          </div>
        </div>

        <!-- Latest 5 Tasks Assigned -->
        <div class="bg-white border border-[#DCDEDD] rounded-[20px] p-5">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 bg-orange-50 rounded-[12px] flex items-center justify-center"
              >
                <ListChecks class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 class="text-brand-dark text-lg font-bold">Tugas Terbaru</h3>
                <p class="text-brand-light text-sm">Tugas yang baru saja diberikan</p>
              </div>
            </div>
            <button class="text-[#0C51D9] text-sm font-medium hover:underline">
              Lihat Semua
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="task in latestTasks"
              :key="task.id"
              class="border border-[#DCDEDD] rounded-[12px] p-4 hover:border-[#0C51D9] hover:border-2 transition-all duration-300"
            >
              <div class="flex items-start justify-between mb-2">
                <h4 class="text-brand-dark text-base font-semibold">
                  {{ task.title }}
                </h4>
                <span
                  :class="task.statusClass"
                  class="px-2 py-1 rounded-md text-xs font-semibold flex-shrink-0"
                  >{{ task.status }}</span
                >
              </div>
              <p class="text-brand-light text-sm mb-3">
                {{ task.description }}
              </p>
              <div class="flex items-center gap-4 text-xs text-gray-600">
                <div class="flex items-center gap-1">
                  <Calendar class="w-3 h-3" />
                  <span>{{ task.dueDate }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Folder class="w-3 h-3" />
                  <span>{{ task.project }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
