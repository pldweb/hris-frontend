<script setup>
import { useRoleStore } from '@/stores/role';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { PlusIcon, EditIcon, Trash2Icon, AlertCircleIcon } from 'lucide-vue-next';
import Alert from '@/components/common/Alert.vue';

const roleStore = useRoleStore();
const { roles, loading, success, error } = storeToRefs(roleStore);
const { fetchRoles, deleteRole } = roleStore;

onMounted(() => {
    fetchRoles();
});

const handleDelete = async (role) => {
    if (confirm(`Apakah Anda yakin ingin menghapus peran ${role.name}?`)) {
        await deleteRole(role.id);
        if (!error.value) {
            fetchRoles();
        }
    }
};

const isSystemRole = (name) => {
    return ['superadmin', 'manager', 'hr', 'employee', 'finance'].includes(name);
};
</script>

<template>
  <Alert type="success" :title="success" :show="success" />
  <Alert type="error" :title="error" :show="error" />

  <div class="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-4 sm:p-5">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h3 class="text-brand-dark text-xl font-bold">Manajemen Peran</h3>
        <p class="text-brand-light text-sm font-normal mt-1">
          Kelola daftar peran dan izin akses pada sistem.
        </p>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
        <RouterLink
          :to="{ name: 'admin.roles.create' }"
          class="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-3 flex items-center gap-2 w-full sm:w-auto"
        >
          <PlusIcon class="w-4 h-4 text-white" />
          <span class="text-brand-white text-sm font-semibold">Tambah Peran</span>
        </RouterLink>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm whitespace-nowrap">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="px-4 py-3 font-semibold text-gray-600 rounded-tl-lg">Nama Peran</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Hak Akses</th>
            <th class="px-4 py-3 font-semibold text-gray-600 rounded-tr-lg">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100" v-if="!loading && roles.length">
          <tr v-for="role in roles" :key="role.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="px-4 py-3 text-brand-dark font-medium capitalize">{{ role.name }}</td>
            <td class="px-4 py-3 text-brand-dark">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {{ role.permissions ? role.permissions.length : 0 }} Izin
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <RouterLink
                  :to="{ name: 'admin.roles.edit', params: { id: role.id } }"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                  v-if="!['superadmin'].includes(role.name)"
                >
                  <EditIcon class="w-4 h-4" />
                </RouterLink>
                <button
                  @click="handleDelete(role)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus"
                  v-if="!isSystemRole(role.name)"
                >
                  <Trash2Icon class="w-4 h-4" />
                </button>
                <span v-if="['superadmin'].includes(role.name)" class="text-xs text-gray-400 italic">Hanya Baca</span>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="loading">
          <tr>
            <td colspan="3" class="px-4 py-8 text-center text-gray-500">Memuat data...</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="3" class="px-4 py-8 text-center text-gray-500">Tidak ada peran ditemukan.</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>
