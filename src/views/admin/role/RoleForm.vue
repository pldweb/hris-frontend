<script setup>
import { useRoleStore } from '@/stores/role';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Alert from '@/components/common/Alert.vue';

const route = useRoute();
const router = useRouter();
const roleStore = useRoleStore();

const { permissions, loading, error, success } = storeToRefs(roleStore);
const { fetchPermissions, fetchRole, createRole, updateRole } = roleStore;

const isEditMode = computed(() => !!route.params.id);

const formData = ref({
    name: '',
    permissions: []
});

onMounted(async () => {
    await fetchPermissions();

    if (isEditMode.value) {
        const role = await fetchRole(route.params.id);
        if (role) {
            formData.value.name = role.name;
            if (role.permissions) {
                formData.value.permissions = role.permissions.map(p => p.name);
            }
        }
    }
});

const handleSubmit = async () => {
    if (isEditMode.value) {
        await updateRole(route.params.id, formData.value);
    } else {
        await createRole(formData.value);
    }

    if (!error.value) {
        router.push({ name: 'admin.roles' });
    }
};

const handleBack = () => {
    router.push({ name: 'admin.roles' });
};
</script>

<template>
  <Alert type="error" :title="error" :show="error" />

  <div class="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-4 sm:p-5">
    <div class="mb-6">
      <h3 class="text-brand-dark text-xl font-bold">{{ isEditMode ? 'Edit Peran' : 'Tambah Peran' }}</h3>
      <p class="text-brand-light text-sm font-normal mt-1">
        Isi informasi peran dan atur hak akses yang diizinkan.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      
      <!-- Role Name -->
      <div class="max-w-md">
        <label class="block text-sm font-semibold text-brand-dark mb-1">Nama Peran</label>
        <div class="relative">
          <input
            type="text"
            v-model="formData.name"
            class="w-full pl-4 pr-10 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 transition-all duration-300 font-semibold text-brand-dark bg-white"
            placeholder="Masukkan nama peran"
            required
            :disabled="loading"
          />
        </div>
      </div>

      <!-- Permissions list -->
      <div>
        <label class="block text-sm font-semibold text-brand-dark mb-3">Hak Akses (Izin)</label>
        <div v-if="loading && !Object.keys(permissions).length" class="text-sm text-gray-500">Memuat perizinan...</div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Grouped by Keys -->
            <div 
                v-for="(group, key) in permissions" 
                :key="key"
                class="bg-gray-50 rounded-[12px] p-4 border border-gray-100"
            >
                <h4 class="font-bold text-brand-dark uppercase tracking-wider text-xs mb-3 border-b border-gray-200 pb-2">{{ key }}</h4>
                <div class="space-y-2">
                    <label 
                        v-for="perm in group" 
                        :key="perm.id" 
                        class="flex items-center gap-2 cursor-pointer group"
                    >
                        <input
                            type="checkbox"
                            :value="perm.name"
                            v-model="formData.permissions"
                            class="w-4 h-4 text-[#0C51D9] rounded border-gray-300 focus:ring-[#0C51D9] transition-all cursor-pointer"
                        />
                        <span class="text-sm text-gray-700 group-hover:text-brand-dark transition-colors">{{ perm.name }}</span>
                    </label>
                </div>
            </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          @click="handleBack"
          class="px-6 py-3 rounded-[12px] border border-[#DCDEDD] text-gray-700 hover:bg-gray-50 font-semibold transition-all"
        >
          Batal
        </button>
        <button
          type="submit"
          class="px-6 py-3 rounded-[12px] bg-[#0C51D9] text-white hover:bg-[#073ba3] hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 font-semibold transition-all"
          :disabled="loading"
        >
          {{ loading ? 'Penyimpanan...' : 'Simpan Peran' }}
        </button>
      </div>
    </form>
  </div>
</template>
