<script setup>
import { Input, Select, TextArea } from "@/components/common/form";
import RightSidebar from "@/components/admin/employee/create/RightSidebar.vue";
import {
  Briefcase,
  Image,
  Upload,
  ImagePlus,
  Eye,
  X,
  Calendar,
  Tag,
  FileText,
  Crown,
  UserCheck,
  ChevronDown,
  Users,
  Code,
  Check,
  Settings,
  PlayCircle,
  ClipboardList,
  PauseCircle,
  Plus,
  Minus,
  Flag,
  Zap,
  Search,
  SearchX,
} from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";
import { debounce } from "lodash";
import { useProjectStore } from "@/stores/project";
import { useTeamStore } from "@/stores/team";
import { useEmployeeStore } from "@/stores/employee";
import { storeToRefs } from "pinia";
import router from "@/router";
import { useRoute } from "vue-router";

const route = useRoute();
const id = route.params.id;

const projectStore = useProjectStore();
const { loading, error, success } = storeToRefs(projectStore);
const { updateProject, fetchProject } = projectStore;

const teamStore = useTeamStore();
const { teams } = storeToRefs(teamStore);
const { fetchTeams } = teamStore;

const employeeStore = useEmployeeStore();
const { employees } = storeToRefs(employeeStore);
const { fetchEmployees } = employeeStore;

const form = ref({
  id: "",
  name: "",
  type: "",
  priority: "",
  status: "",
  start_date: "",
  end_date: "",
  description: "",
  photo: "",
  photo_url: "",
  budget: "",
  project_leader_id: "",
  teams: [],
});

const projectPhotoInput = ref(null);
const leaderModal = ref(false);
const searchLeader = ref("");
const selectedLeader = ref(null);

const handleFetchProject = async () => {
  const response = await fetchProject(id);

  form.value = response;

  form.value.photo_url = response.photo;
  form.value.photo = null;

  form.value.project_leader_id = response.leader.id;

  selectedLeader.value = {
    user: response.leader.user,
    job_information: response.leader?.employee_profile?.job_information,
    employee_profile: response.leader?.employee_profile,
  };

  form.value.teams = response.teams.map((team) => team.id);
  if (form.value.budget) {
    form.value.budget = formatRupiahInput(form.value.budget);
  }
};

const handleSubmit = async () => {
  const payload = { ...form.value };
  payload.budget =
    parseInt(String(form.value.budget).replace(/[^0-9]/g, "")) || 0;
  await updateProject(id, payload);

  if (success.value) {
    router.back();
  }
};

const handleProjectPhotoSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    form.value.photo = file;
    form.value.photo_url = URL.createObjectURL(file);
  }
};

const handleSelectLeader = (employee) => {
  selectedLeader.value = employee;
  form.value.project_leader_id = employee.id;
  leaderModal.value = false;
};

const handleRemoveLeader = () => {
  selectedLeader.value = null;
  form.value.project_leader_id = "";
};

const handleRemovePhoto = () => {
  form.value.photo = "";
  form.value.photo_url = "";
  if (projectPhotoInput.value) {
    projectPhotoInput.value.value = "";
  }
};

const clearAllTeams = () => {
  form.value.teams = [];
};

onMounted(async () => {
  await fetchTeams();
  await fetchEmployees({
    limit: 6,
  });
  await handleFetchProject();
});

const formatRupiahInput = (value) => {
  const digits = String(value ?? "").replace(/[^0-9]/g, "");
  if (!digits) return "";
  return new Intl.NumberFormat("id-ID").format(parseInt(digits));
};

const formattingBudget = ref(false);

watch(
  () => form.value.budget,
  (val) => {
    if (formattingBudget.value) return;
    const formatted = formatRupiahInput(val);
    if (formatted !== val) {
      formattingBudget.value = true;
      form.value.budget = formatted;
      formattingBudget.value = false;
    }
  }
);

watch(
  searchLeader,
  debounce(() => {
    fetchEmployees({
      limit: 6,
      search: searchLeader.value,
    });
  }, 300),
  { deep: true }
);
</script>

<template>
  <div class="flex gap-5 pl-5 items-start">
    <!-- Form Section -->
    <div class="flex-1">
      <form class="space-y-6" @submit.prevent="handleSubmit" v-if="!loading">
        <!-- Project Information Section -->
        <div class="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
          <div class="flex items-center gap-3 mb-6">
            <div
              class="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center"
            >
              <Briefcase class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 class="text-brand-dark text-xl font-bold">
                Informasi Proyek
              </h3>
              <p class="text-brand-light text-sm font-normal">
                Detail dasar dan deskripsi proyek
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Project Photo -->
            <div class="md:col-span-2 mb-4">
              <label class="block text-brand-dark text-base font-semibold mb-1"
                >Foto Proyek</label
              >
              <div class="flex items-start gap-4">
                <div class="w-64 h-42">
                  <!-- Photo Container with Default Background -->
                  <div class="relative w-64 h-42">
                    <!-- Default background -->
                    <div
                      class="w-64 h-42 absolute bg-gray-50 rounded-[16px] border-2 border-dashed border-[#DCDEDD]"
                    ></div>

                    <div
                      class="w-64 h-42 relative z-10 flex items-center justify-center rounded-[16px] overflow-hidden"
                    >
                      <img
                        :src="form.photo_url"
                        alt="Foto Proyek"
                        class="w-64 h-42 object-cover rounded-[16px]"
                        v-if="form.photo_url"
                      />
                      <div
                        v-else
                        class="flex flex-col items-center justify-center text-gray-400"
                      >
                        <Image class="w-10 h-10 mb-2" />
                        <span class="text-sm font-medium">Foto Proyek</span>
                      </div>
                    </div>

                    <!-- Upload overlay (shown on hover) - only when no photo uploaded -->
                    <div
                      class="absolute inset-0 rounded-[16px] flex items-center justify-center transition-all duration-300 cursor-pointer z-20 group"
                    >
                      <div
                        class="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 rounded-[16px] transition-opacity duration-300"
                      ></div>
                      <Upload
                        class="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10"
                        @click="projectPhotoInput.click()"
                      />
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    ref="projectPhotoInput"
                    @change="handleProjectPhotoSelect"
                  />
                  <button
                    type="button"
                    @click="projectPhotoInput.click()"
                    class="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-2 flex items-center gap-2"
                  >
                    <ImagePlus class="w-4 h-4 text-gray-600" />
                    <span class="text-brand-dark text-base font-semibold"
                      >Pilih Foto</span
                    >
                  </button>
                  <button
                    type="button"
                    class="hidden border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-2 flex items-center gap-2"
                  >
                    <Eye class="w-4 h-4 text-gray-600" />
                    <span class="text-brand-dark text-base font-semibold"
                      >Pratinjau Foto</span
                    >
                  </button>
                  <button
                    type="button"
                    @click="handleRemovePhoto"
                    class="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-2 flex items-center gap-2"
                  >
                    <X class="w-4 h-4 text-gray-600" />
                    <span class="text-brand-dark text-base font-semibold"
                      >Hapus Foto</span
                    >
                  </button>
                  <p class="text-brand-light text-xs">
                    JPG, PNG hingga 2MB (disarankan: 640x424px)
                  </p>
                </div>
              </div>
            </div>

            <!-- Project Name -->
            <div class="md:col-span-2 mb-4">
              <Input
                id="name"
                name="name"
                type="text"
                v-model="form.name"
                label="Nama Proyek *"
                placeholder="Masukkan nama proyek"
                :required="true"
                :error="error?.name?.join(', ')"
              >
                <template #icon>
                  <Briefcase class="h-5 w-5 text-gray-400" />
                </template>
              </Input>
            </div>

            <!-- Priority -->
            <div class="md:col-span-2 mb-4">
              <label class="block text-brand-dark text-base font-semibold mb-1"
                >Prioritas *</label
              >
              <div class="grid grid-cols-3 gap-4">
                <!-- Low Priority -->
                <label
                  class="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-gray-50 rounded-[12px] flex items-center justify-center"
                    >
                      <Minus class="w-5 h-5 text-gray-600" />
                    </div>
                    <div class="flex flex-col">
                      <p class="text-brand-dark text-base font-semibold">Rendah</p>
                    </div>
                  </div>
                  <div
                    class="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2"
                  >
                    <input
                      type="radio"
                      name="project_priority"
                      value="low"
                      class="hidden"
                      v-model="form.priority"
                    />
                    <div
                      class="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"
                    ></div>
                    <p
                      class="text-xs font-semibold after:content-['Pilih'] group-has-[:checked]:after:content-['Dipilih']"
                    ></p>
                  </div>
                </label>

                <!-- Medium Priority -->
                <label
                  class="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-yellow-50 rounded-[12px] flex items-center justify-center"
                    >
                      <Flag class="w-5 h-5 text-yellow-600" />
                    </div>
                    <div class="flex flex-col">
                      <p class="text-brand-dark text-base font-semibold">
                        Sedang
                      </p>
                    </div>
                  </div>
                  <div
                    class="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2"
                  >
                    <input
                      type="radio"
                      name="project_priority"
                      value="medium"
                      class="hidden"
                      v-model="form.priority"
                    />
                    <div
                      class="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"
                    ></div>
                    <p
                      class="text-xs font-semibold after:content-['Pilih'] group-has-[:checked]:after:content-['Dipilih']"
                    ></p>
                  </div>
                </label>

                <!-- High Priority -->
                <label
                  class="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-red-50 rounded-[12px] flex items-center justify-center"
                    >
                      <Zap class="w-5 h-5 text-red-600" />
                    </div>
                    <div class="flex flex-col">
                      <p class="text-brand-dark text-base font-semibold">
                        Tinggi
                      </p>
                    </div>
                  </div>
                  <div
                    class="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2"
                  >
                    <input
                      type="radio"
                      name="project_priority"
                      value="high"
                      class="hidden"
                      v-model="form.priority"
                    />
                    <div
                      class="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"
                    ></div>
                    <p
                      class="text-xs font-semibold after:content-['Pilih'] group-has-[:checked]:after:content-['Dipilih']"
                    ></p>
                  </div>
                </label>
              </div>
            </div>

            <div
              class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5 mb-4"
            >
              <!-- Project Type -->
              <div>
                <Select
                  id="type"
                  name="type"
                  v-model="form.type"
                  label="Jenis Proyek *"
                  placeholder="Pilih jenis proyek"
                  :options="[
                    { value: 'web_development', label: 'Pengembangan Web' },
                    { value: 'mobile_app', label: 'Aplikasi Seluler' },
                    { value: 'design', label: 'Desain' },
                    { value: 'marketing', label: 'Pemasaran' },
                    { value: 'research', label: 'Penelitian' },
                    { value: 'infrastructure', label: 'Infrastruktur' },
                  ]"
                  :required="true"
                  :error="error?.type?.join(', ')"
                >
                  <template #icon>
                    <Tag class="h-5 w-5 text-gray-400" />
                  </template>
                </Select>
              </div>

              <!-- Start Date -->
              <div>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  v-model="form.start_date"
                  label="Tanggal Mulai *"
                  :required="true"
                  :error="error?.start_date?.join(', ')"
                >
                  <template #icon>
                    <Calendar class="h-5 w-5 text-gray-400" />
                  </template>
                </Input>
              </div>

              <!-- End Date -->
              <div>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  v-model="form.end_date"
                  label="Tanggal Selesai *"
                  :required="true"
                  :error="error?.end_date?.join(', ')"
                >
                  <template #icon>
                    <Calendar class="h-5 w-5 text-gray-400" />
                  </template>
                </Input>
              </div>
            </div>

            <!-- Project Description -->
            <div class="md:col-span-2">
              <TextArea
                id="description"
                name="description"
                v-model="form.description"
                label="Deskripsi Proyek"
                placeholder="Jelaskan tujuan dan ruang lingkup proyek..."
                :rows="4"
                :error="error?.description?.join(', ')"
              >
                <template #icon>
                  <FileText class="h-5 w-5 text-gray-400" />
                </template>
              </TextArea>
            </div>
          </div>
        </div>

        <!-- Project Leader Section -->
        <div class="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
          <div class="flex items-center gap-3 mb-6">
            <div
              class="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center"
            >
              <Crown class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 class="text-brand-dark text-xl font-bold">Pemimpin Proyek</h3>
              <p class="text-brand-light text-sm font-normal">
                Tetapkan pemimpin proyek untuk mengelola proyek ini
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Project Leader Selection -->
            <div class="md:col-span-2">
              <label class="block text-brand-dark text-base font-semibold mb-1"
                >Pilih Pemimpin Proyek</label
              >
              <button
                type="button"
                @click="leaderModal = true"
                class="w-full border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-4 py-3 flex items-center gap-3 text-left"
              >
                <UserCheck class="w-5 h-5 text-gray-400" />
                <span class="text-[#0D2929] font-normal flex-1">
                  {{ selectedLeader?.user?.name || "Pilih pemimpin proyek" }}
                </span>
                <ChevronDown class="w-4 h-4 text-gray-400" />
              </button>
              <input
                type="hidden"
                id="selectedLeaderValue"
                name="project_leader"
                v-model="form.project_leader_id"
              />

              <!-- Selected Leader Info -->
              <div
                class="mt-3 p-4 bg-gray-50 rounded-[12px] border border-[#DCDEDD]"
                v-if="selectedLeader"
              >
                <div class="flex items-center gap-3">
                  <img
                    :src="selectedLeader?.user?.profile_photo"
                    alt="Foto Pemimpin"
                    class="w-12 h-12 rounded-full object-cover"
                    v-if="selectedLeader?.user?.profile_photo"
                  />
                  <div
                    class="w-12 h-12 rounded-[12px] flex items-center justify-center bg-gray-100"
                    v-else
                  >
                    <UserCheck class="w-5 h-5 text-gray-400" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-brand-dark text-base font-semibold">
                      {{ selectedLeader?.user?.name }}
                    </h4>
                    <p class="text-brand-light text-sm">
                      {{ selectedLeader?.job_information?.job_title }}
                    </p>
                  </div>
                  <button
                    type="button"
                    @click="handleRemoveLeader"
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Assignment Section -->
        <div class="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
          <div class="flex items-center gap-3 mb-6">
            <div
              class="w-12 h-12 bg-purple-50 rounded-[12px] flex items-center justify-center"
            >
              <Users class="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 class="text-brand-dark text-xl font-bold">Penugasan Tim</h3>
              <p class="text-brand-light text-sm font-normal">
                Pilih tim yang akan mengerjakan proyek ini
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <!-- Available Teams -->
            <div>
              <label class="block text-brand-dark text-base font-semibold mb-3"
                >Tim yang Tersedia</label
              >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Product Development Team -->
                <label
                  class="group team-card flex items-center justify-between w-full min-h-[70px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer hover:border-[#0C51D9] hover:border-2"
                  v-for="(team, index) in teams"
                  :key="index"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-12 h-12 relative flex items-center justify-center rounded-[12px] overflow-hidden"
                    >
                      <!-- Main blue background -->
                      <div
                        class="w-full h-full absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-[12px]"
                      ></div>
                      <!-- Lucide icon -->
                      <Code class="w-5 h-5 text-white relative z-10" />
                    </div>
                    <div class="flex flex-col">
                      <p class="text-brand-dark text-base font-semibold">
                        {{ team.name }}
                      </p>
                      <p class="text-brand-light text-sm">
                        {{ team.members_count }} anggota • Aktif
                      </p>
                    </div>
                  </div>
                  <div
                    class="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2"
                  >
                    <input
                      type="checkbox"
                      name="assigned_teams[]"
                      :value="team.id"
                      class="hidden"
                      v-model="form.teams"
                    />
                    <div
                      class="flex size-[18px] rounded border border-[#DCDEDD] group-has-[:checked]:bg-[#0C51D9] group-has-[:checked]:border-[#0C51D9] transition-all duration-300 items-center justify-center"
                    >
                      <Check
                        class="w-3 h-3 text-white opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                    <p
                      class="text-xs font-semibold after:content-['Pilih'] group-has-[:checked]:after:content-['Dipilih']"
                    ></p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Selected Teams Summary -->
            <div id="selectedTeamsSummary" class="hidden">
              <div class="border-t border-[#DCDEDD] pt-4">
                <div class="flex items-center justify-between mb-3">
                  <label class="block text-brand-dark text-base font-semibold"
                    >Tim yang Dipilih</label
                  >
                  <button
                    type="button"
                    @click="clearAllTeams"
                    class="text-brand-light text-sm hover:text-brand-dark transition-colors"
                  >
                    Hapus Semua
                  </button>
                </div>
                <div id="selectedTeamsList" class="flex flex-wrap gap-2"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Settings Section -->
        <div class="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
          <div class="flex items-center gap-3 mb-6">
            <div
              class="w-12 h-12 bg-orange-50 rounded-[12px] flex items-center justify-center"
            >
              <Settings class="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 class="text-brand-dark text-xl font-bold">
                Pengaturan Proyek
              </h3>
              <p class="text-brand-light text-sm font-normal">
                Konfigurasi status proyek, anggaran
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-5">
            <!-- Budget -->
            <div class="mb-4">
              <Input
                id="budget"
                name="budget"
                type="text"
                v-model="form.budget"
                label="Anggaran"
                placeholder="100.000.000"
                :error="error?.budget?.join(', ')"
              >
                <template #icon> Rp </template>
              </Input>
            </div>

            <!-- Initial Project Status (Full Width) -->
            <div class="md:col-span-2 mb-4">
              <label class="block text-brand-dark text-base font-semibold mb-1"
                >Status Proyek Awal</label
              >
              <div class="grid grid-cols-2 gap-4">
                <!-- Active Option -->
                <label
                  class="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-green-50 rounded-[12px] flex items-center justify-center"
                    >
                      <PlayCircle class="w-5 h-5 text-green-600" />
                    </div>
                    <div class="flex flex-col">
                      <p class="text-brand-dark text-base font-semibold">
                        Aktif
                      </p>
                    </div>
                  </div>
                  <div
                    class="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2"
                  >
                    <input
                      type="radio"
                      name="project_status"
                      value="active"
                      class="hidden"
                      v-model="form.status"
                    />
                    <div
                      class="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"
                    ></div>
                    <p
                      class="text-xs font-semibold after:content-['Pilih'] group-has-[:checked]:after:content-['Dipilih']"
                    ></p>
                  </div>
                </label>

                <!-- Planning Option -->
                <label
                  class="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-blue-50 rounded-[12px] flex items-center justify-center"
                    >
                      <ClipboardList class="w-5 h-5 text-blue-600" />
                    </div>
                    <div class="flex flex-col">
                      <p class="text-brand-dark text-base font-semibold">
                        Perencanaan
                      </p>
                    </div>
                  </div>
                  <div
                    class="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2"
                  >
                    <input
                      type="radio"
                      name="project_status"
                      value="planning"
                      class="hidden"
                      v-model="form.status"
                    />
                    <div
                      class="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"
                    ></div>
                    <p
                      class="text-xs font-semibold after:content-['Pilih'] group-has-[:checked]:after:content-['Dipilih']"
                    ></p>
                  </div>
                </label>

                <!-- On Hold Option -->
                <label
                  class="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-yellow-50 rounded-[12px] flex items-center justify-center"
                    >
                      <PauseCircle class="w-5 h-5 text-yellow-600" />
                    </div>
                    <div class="flex flex-col">
                      <p class="text-brand-dark text-base font-semibold">
                        Tertunda
                      </p>
                    </div>
                  </div>
                  <div
                    class="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2"
                  >
                    <input
                      type="radio"
                      name="project_status"
                      value="on_hold"
                      class="hidden"
                      v-model="form.status"
                    />
                    <div
                      class="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"
                    ></div>
                    <p
                      class="text-xs font-semibold after:content-['Pilih'] group-has-[:checked]:after:content-['Dipilih']"
                    ></p>
                  </div>
                </label>

                <!-- Draft Option -->
                <label
                  class="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-gray-50 rounded-[12px] flex items-center justify-center"
                    >
                      <FileText class="w-5 h-5 text-gray-600" />
                    </div>
                    <div class="flex flex-col">
                      <p class="text-brand-dark text-base font-semibold">
                        Draf
                      </p>
                    </div>
                  </div>
                  <div
                    class="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2"
                  >
                    <input
                      type="radio"
                      name="project_status"
                      value="draft"
                      class="hidden"
                      v-model="form.status"
                    />
                    <div
                      class="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"
                    ></div>
                    <p
                      class="text-xs font-semibold after:content-['Pilih'] group-has-[:checked]:after:content-['Dipilih']"
                    ></p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex items-center gap-4 pb-6">
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-6 py-3 flex items-center gap-2"
          >
            <span class="text-brand-white text-base font-semibold"
              >Perbarui Proyek</span
            >
            <Plus class="w-4 h-4 text-white" />
          </button>
          <button
            type="button"
            @click="router.back()"
            class="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-6 py-3 flex items-center gap-2"
          >
            <span class="text-brand-dark text-base font-semibold">Batal</span>
          </button>
        </div>
      </form>
    </div>

    <RightSidebar />
  </div>

  <!-- Project Leader Selection Modal -->
  <div
    class="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center"
    v-if="leaderModal"
  >
    <div
      class="bg-white rounded-[20px] border border-[#DCDEDD] w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden"
    >
      <!-- Modal Header -->
      <div class="p-6 border-b border-[#DCDEDD]">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center"
            >
              <Crown class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 class="text-brand-dark text-xl font-bold">
                Pilih Pemimpin Proyek
              </h3>
              <p class="text-brand-light text-sm font-normal">
                Pilih pegawai untuk memimpin proyek ini
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="leaderModal = false"
            class="w-10 h-10 rounded-full border border-[#DCDEDD] flex items-center justify-center hover:border-[#0C51D9] hover:border-2 transition-all duration-200"
          >
            <X class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="p-6 border-b border-[#DCDEDD]">
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
          >
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            class="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
            placeholder="Cari pegawai..."
            v-model="searchLeader"
          />
        </div>
      </div>

      <!-- Employees List -->
      <div class="p-6 overflow-y-auto max-h-96">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            class="leader-card border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300 p-4 cursor-pointer"
            v-for="employee in employees"
            :key="employee.id"
            @click="handleSelectLeader(employee)"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-14 h-14 relative flex items-center justify-center rounded-[12px] overflow-hidden"
              >
                <img
                  :src="employee.user?.profile_photo"
                  alt="Foto Pegawai"
                  class="w-14 h-14 rounded-[12px] object-cover"
                  v-if="employee.user?.profile_photo"
                />
                <div
                  class="w-14 h-14 rounded-[12px] flex items-center justify-center bg-gray-100"
                  v-else
                >
                  <UserCheck class="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div class="flex-1">
                <h4 class="text-brand-dark text-base font-bold">
                  {{ employee.user?.name }}
                </h4>
                <p class="text-brand-light text-sm font-normal">
                  {{ employee.job_information?.job_title }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results Message -->
        <div class="text-center py-8" v-if="employees.length === 0">
          <SearchX class="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h4 class="text-brand-dark text-base font-semibold mb-1">
            Tidak ada pegawai ditemukan
          </h4>
          <p class="text-brand-light text-sm">
            Coba sesuaikan kata pencarian Anda
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
